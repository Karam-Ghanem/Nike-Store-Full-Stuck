import { create } from "zustand";

import { commerceApi, mapApiProduct, type ProductWritePayload } from "@/api/commerce";
import { getAccessToken } from "@/api/client";
import type { CatrtItem } from "@/Pages/Cart/cartStore";
import type { Archive } from "@/Admin/page/archive/archiveList";

import type { Product } from "./Products Data/productsList";
import ProductsList from "./Products Data/productsList";
import type { Query } from "./ProductControls";

interface ProductStore {
  products: Product[];
  allProducts: Product[];
  isLoading: boolean;
  loadProducts: () => Promise<void>;
  Filteration: (query: Query) => void;
  archivedProducts: Archive[];
  Searching: (textSearch: string) => void;
  addProduct: (product: Product) => Promise<void>;
  removeFromArchive: (productID: string) => Promise<void>;
  archiveProduct: (product: Product) => Promise<void>;
  editProduct: (productID: string, product: Product) => Promise<void>;
  applyDiscount: (on: string, percent: number) => Promise<void>;
  applyDiscountOnShoese: (productID: string, percent: number) => Promise<void>;
  decreaseStock: (cartItem: CatrtItem[]) => void;
  increaseStock: (returnedItem: CatrtItem) => void;
}

const toProductPayload = (product: Product): ProductWritePayload => ({
  name: product.productName,
  description: product.productDescription,
  price: product.productPrice,
  gender: product.gender,
  categoryName: product.category,
  sizes: product.sizesAndQuantities.map((size) => ({ size: size.Size, stock: size.quantity })),
  imageFile: product.imageFile,
});

const filterProducts = (products: Product[], query: Query) => {
  if (query.selectedCategory && query.selectedGender) {
    return products.filter((prod) => prod.category === query.selectedCategory && prod.gender === query.selectedGender);
  }
  if (query.selectedCategory) return products.filter((prod) => prod.category === query.selectedCategory);
  if (query.selectedGender) return products.filter((prod) => prod.gender === query.selectedGender);
  return products;
};

const useProductStore = create<ProductStore>((set, get) => ({
  products: ProductsList,
  allProducts: ProductsList,
  archivedProducts: [],
  isLoading: false,

  loadProducts: async () => {
    set({ isLoading: true });
    try {
      const apiProducts = await commerceApi.getProducts();
      const products = apiProducts.map(mapApiProduct);
      const archivedProducts = products.filter((product) => product.isArchived).map((product) => ({ product, date: new Date() }));
      set({ products, allProducts: products, archivedProducts });
    } catch {
      // Static project data remains a visual fallback while the backend is unavailable.
    } finally {
      set({ isLoading: false });
    }
  },

  Filteration: (query) => set((state) => ({ products: filterProducts(state.allProducts, query) })),

  Searching: (searchText) => set((state) => {
    const text = searchText.trim();
    if (!text) return { products: state.allProducts };
    const normalized = text.toLowerCase();
    return {
      products: state.allProducts.filter((product) =>
        product.productName.toLowerCase().includes(normalized)
        || product.productPrice.replace('$', '') === text,
      ),
    };
  }),

  addProduct: async (product) => {
    const created = getAccessToken() ? mapApiProduct(await commerceApi.createProduct(toProductPayload(product))) : product;
    set((state) => ({
      products: [...state.products, created],
      allProducts: [...state.allProducts, created],
    }));
  },

  archiveProduct: async (product) => {
    if (getAccessToken()) await commerceApi.archiveProduct(Number(product.id));
    set((state) => ({
      products: state.products.map((item) => item.id === product.id ? { ...item, isArchived: true } : item),
      allProducts: state.allProducts.map((item) => item.id === product.id ? { ...item, isArchived: true } : item),
      archivedProducts: [...state.archivedProducts, { product: { ...product }, date: new Date() }],
    }));
  },

  removeFromArchive: async (productID) => {
    if (getAccessToken()) await commerceApi.unarchiveProduct(Number(productID));
    set((state) => ({
      archivedProducts: state.archivedProducts.filter((archived) => archived.product.id !== productID),
      products: state.products.map((product) => product.id === productID ? { ...product, isArchived: false } : product),
      allProducts: state.allProducts.map((product) => product.id === productID ? { ...product, isArchived: false } : product),
    }));
  },

  editProduct: async (productID, product) => {
    const updated = getAccessToken() ? mapApiProduct(await commerceApi.updateProduct(Number(productID), toProductPayload(product))) : product;
    set((state) => {
      const replace = (item: Product) => item.id === productID ? { ...updated } : item;
      return { products: state.products.map(replace), allProducts: state.allProducts.map(replace) };
    });
  },

  applyDiscount: async (on, percent) => {
    if (getAccessToken()) await commerceApi.setBulkDiscount(on, percent);
    set((state) => {
    const applies = (product: Product) => on === 'All' || product.category === on || product.gender === on;
    const update = (product: Product) => !applies(product) ? product : {
      ...product,
      isDiscounted: true,
      oldProductPrice: product.productPrice,
      productPrice: `${(parseFloat(product.productPrice) * (1 - percent / 100)).toFixed(2)}$`,
    };
    return { products: state.products.map(update), allProducts: state.allProducts.map(update) };
    });
  },

  applyDiscountOnShoese: async (productID, percent) => {
    const product = get().allProducts.find((item) => item.id === productID);
    if (getAccessToken() && product) {
      await commerceApi.setProductDiscount(Number(productID), percent);
    }
    set((state) => {
    const update = (product: Product) => product.id !== productID ? product : {
      ...product,
      isDiscounted: true,
      oldProductPrice: product.productPrice,
      productPrice: `${(parseFloat(product.productPrice) * (1 - percent / 100)).toFixed(2)}$`,
    };
    return { products: state.products.map(update), allProducts: state.allProducts.map(update) };
    });
  },

  decreaseStock: (cartItems) => set((state) => {
    const update = (product: Product) => {
      const purchases = cartItems.filter((item) => item.product.id === product.id);
      if (!purchases.length) return product;
      return {
        ...product,
        sizesAndQuantities: product.sizesAndQuantities.map((size) => {
          const purchase = purchases.find((item) => item.currentShoseSize === size.Size);
          return purchase ? { ...size, quantity: size.quantity - purchase.currentShoseQuantity } : size;
        }),
      };
    };
    return { products: state.products.map(update), allProducts: state.allProducts.map(update) };
  }),

  increaseStock: (returnedItem) => set((state) => {
    const update = (product: Product) => product.id !== returnedItem.product.id ? product : {
      ...product,
      sizesAndQuantities: product.sizesAndQuantities.map((size) => size.Size !== returnedItem.currentShoseSize ? size : {
        ...size,
        quantity: size.quantity + returnedItem.currentShoseQuantity,
      }),
    };
    return { products: state.products.map(update), allProducts: state.allProducts.map(update) };
  }),
}));

export default useProductStore;
