import { create } from 'zustand';

import { commerceApi, mapApiProduct, type ApiCartItem, type ApiOrder } from '@/api/commerce';
import { getAccessToken } from '@/api/client';
import type { Product } from '@/components/Products/Products Data/productsList';

export interface CatrtItem {
  product: Product;
  currentShoseSize: string;
  currentShoseQuantity: number;
  currentShoeseID: string;
  cartItemId?: number;
  orderItemId?: number;
  orderId?: number;
  orderedAt?: string;
  returnStatus?: 'requested' | 'approved' | 'rejected' | null;
}

interface CartStore {
  cartItems: CatrtItem[];
  myPurchases: CatrtItem[];
  purchaseDate: Date;
  currentShoeseQuantity: number;
  isDiscounted: boolean;
  couponCode: string | null;
  couponDiscountAmount: number;
  setIsDiscounted: (isDiscounted: boolean) => void;
  setCoupon: (couponCode: string, discountAmount: number) => void;
  clearCoupon: () => void;
  loadCart: () => Promise<void>;
  loadPurchases: () => Promise<void>;
  addProductToCart: (product: Product, currentShoseSize: string, currentShoeseQuantity: number, currentShoeseID: string) => Promise<void>;
  setCurrentChoseQuantity: (currentShoeseID: string, currentShoeseQuantity: number) => Promise<void>;
  deleteProductFromCart: (currentShoeseID: string) => Promise<void>;
  getTotalPrice: (cartItems: CatrtItem[]) => number;
  getFinalPrice: () => number;
  addProductsToMyPurchases: (myPurchases: CatrtItem[], purchaseDate: Date) => void;
  clearCartAfterOrder: () => void;
  returnProduct: (productID: string | Product, reason?: string) => Promise<void>;
  editProductPriceAfterUseCoupon: () => void;
}

function cartItemFromApi(item: ApiCartItem): CatrtItem {
  const product = mapApiProduct(item.product);
  return {
    product,
    currentShoseSize: item.product_size.size,
    currentShoseQuantity: item.quantity,
    currentShoeseID: `${product.id}-${item.product_size.size}`,
    cartItemId: item.id,
  };
}

function purchaseItemsFromOrder(order: ApiOrder): CatrtItem[] {
  return order.items.map((item) => {
    const product = mapApiProduct(item.product);
    return {
      product,
      currentShoseSize: item.product_size.size,
      currentShoseQuantity: item.quantity,
      currentShoeseID: `${product.id}-${item.product_size.size}`,
      orderItemId: item.id,
      orderId: order.id,
      orderedAt: order.created_at,
      returnStatus: item.return_request_status,
    };
  });
}

const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  myPurchases: [],
  purchaseDate: new Date(),
  currentShoeseQuantity: 0,
  isDiscounted: false,
  couponCode: null,
  couponDiscountAmount: 0,

  setIsDiscounted: (isDiscounted) => set({ isDiscounted }),
  setCoupon: (couponCode, couponDiscountAmount) => set({
    couponCode,
    couponDiscountAmount,
    isDiscounted: true,
  }),
  clearCoupon: () => set({ couponCode: null, couponDiscountAmount: 0, isDiscounted: false }),

  loadCart: async () => {
    if (!getAccessToken()) return;
    const items = await commerceApi.getCart();
    set({ cartItems: items.map(cartItemFromApi) });
  },

  loadPurchases: async () => {
    if (!getAccessToken()) return;
    const orders = await commerceApi.getOrders();
    const purchases = orders.flatMap(purchaseItemsFromOrder);
    set({
      myPurchases: purchases,
      purchaseDate: orders.length ? new Date(orders[0].created_at) : new Date(),
    });
  },

  addProductToCart: async (product, currentShoseSize, currentShoseQuantity, currentShoeseID) => {
    const existing = get().cartItems.find((item) => item.currentShoeseID === currentShoeseID);
    const selectedSize = product.sizesAndQuantities.find((size) => size.Size === currentShoseSize);
    if (!selectedSize?.apiSizeId || !getAccessToken()) {
      if (!existing) {
        set((state) => ({
          cartItems: [...state.cartItems, { product, currentShoseSize, currentShoseQuantity, currentShoeseID }],
        }));
      }
      return;
    }
    if (existing?.cartItemId) {
      const response = await commerceApi.updateCartItem(existing.cartItemId, existing.currentShoseQuantity + currentShoseQuantity);
      const updated = cartItemFromApi(response);
      set((state) => ({ cartItems: state.cartItems.map((item) => item.cartItemId === updated.cartItemId ? updated : item) }));
      return;
    }
    const response = await commerceApi.addCartItem(Number(product.id), selectedSize.apiSizeId, currentShoseQuantity);
    const created = cartItemFromApi(response);
    set((state) => ({ cartItems: [...state.cartItems, created] }));
  },

  setCurrentChoseQuantity: async (currentShoeseID, currentShoeseQuantity) => {
    const current = get().cartItems.find((item) => item.currentShoeseID === currentShoeseID);
    if (current?.cartItemId && getAccessToken()) {
      const response = await commerceApi.updateCartItem(current.cartItemId, currentShoeseQuantity);
      const updated = cartItemFromApi(response);
      set((state) => ({ cartItems: state.cartItems.map((item) => item.cartItemId === updated.cartItemId ? updated : item) }));
      return;
    }
    set((state) => ({
      cartItems: state.cartItems.map((item) => item.currentShoeseID === currentShoeseID
        ? { ...item, currentShoseQuantity: currentShoeseQuantity }
        : item),
    }));
  },

  deleteProductFromCart: async (currentShoeseID) => {
    const current = get().cartItems.find((item) => item.currentShoeseID === currentShoeseID);
    if (current?.cartItemId && getAccessToken()) await commerceApi.removeCartItem(current.cartItemId);
    set((state) => ({ cartItems: state.cartItems.filter((item) => item.currentShoeseID !== currentShoeseID) }));
  },

  getTotalPrice: (cartItems) => cartItems.reduce(
    (total, item) => total + item.currentShoseQuantity * parseFloat(item.product.productPrice),
    0,
  ),

  getFinalPrice: () => Math.max(0, get().getTotalPrice(get().cartItems) - get().couponDiscountAmount),

  addProductsToMyPurchases: (myPurchases, purchaseDate) => set({
    myPurchases: [...myPurchases],
    purchaseDate,
    cartItems: [],
    couponCode: null,
    couponDiscountAmount: 0,
    isDiscounted: false,
  }),

  clearCartAfterOrder: () => set({
    cartItems: [],
    couponCode: null,
    couponDiscountAmount: 0,
    isDiscounted: false,
  }),

  returnProduct: async (productID, reason = '') => {
    const key = typeof productID === 'string' ? productID : productID.id;
    const purchase = get().myPurchases.find((item) => item.currentShoeseID === key || item.product.id === key);
    if (purchase?.orderItemId && getAccessToken()) {
      await commerceApi.createReturn(purchase.orderItemId, reason.trim());
      set((state) => ({
        myPurchases: state.myPurchases.map((item) => item.orderItemId === purchase.orderItemId
          ? { ...item, returnStatus: 'requested' }
          : item),
      }));
      return;
    }
    set((state) => ({
      myPurchases: state.myPurchases.filter((item) => item.currentShoeseID !== key),
      cartItems: state.cartItems.filter((item) => item.currentShoeseID !== key),
    }));
  },

  editProductPriceAfterUseCoupon: () => {
    // The backend owns final pricing. This no-op preserves the existing UI action signature.
  },
}));

export default useCartStore;
