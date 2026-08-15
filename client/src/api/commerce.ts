import type { Product, SizeAndQuantity } from '@/components/Products/Products Data/productsList';

import { apiConfig, apiRequest } from './client';

export interface ApiCategory {
  id: number;
  name: string;
  description: string;
}

export interface ApiProductSize {
  id: number;
  size: string;
  stock: number;
}

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  oldProductPrice: string | null;
  isDiscounted: boolean;
  gender: string;
  image: string | null;
  is_active: boolean;
  isArchived: boolean;
  category: ApiCategory;
  sizes: ApiProductSize[];
}

export interface ApiCartItem {
  id: number;
  product: ApiProduct;
  product_size: ApiProductSize;
  quantity: number;
  added_at: string;
}

export interface ApiFavorite {
  id: number;
  product: ApiProduct;
  created_at: string;
}

export interface ApiOrderItem {
  id: number;
  product: ApiProduct;
  product_size: ApiProductSize;
  quantity: number;
  price: string;
  return_request_status: 'requested' | 'approved' | 'rejected' | null;
}

export interface ApiOrder {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  message: string;
  latitude: string | null;
  longitude: string | null;
  coupon_code: string | null;
  subtotal: string;
  discount_amount: string;
  total_amount: string;
  total_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  return_requested: boolean;
  return_deadline: string | null;
  items: ApiOrderItem[];
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discount_type: 'percent' | 'fixed';
  amount: string;
  discount_amount: string;
  subtotal: string;
  total_amount: string;
}

export interface ApiCoupon {
  id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  amount: string;
  min_order_total: string;
  active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiReturnPolicy {
  return_period_days: number;
  updated_at: string;
}

export interface ApiReturnRequest {
  id: number;
  order_id: number;
  product: ApiProduct;
  product_size: ApiProductSize;
  quantity: number;
  reason: string;
  status: 'requested' | 'approved' | 'rejected';
  return_deadline: string;
  created_at: string;
  updated_at: string;
}

export interface ApiReview {
  id: number;
  user: string;
  product: ApiProduct | null;
  product_id?: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AdminDashboardMetrics {
  total_orders: number;
  completed_orders: number;
  pending_orders: number;
  total_sales: number;
  active_products: number;
  archived_products: number;
  total_reviews: number;
  total_users: number;
  total_favorites: number;
}

export interface ProductWritePayload {
  name: string;
  description: string;
  price: string;
  gender: string;
  categoryName: string;
  sizes: Array<{ size: string; stock: number }>;
  imageFile?: File;
}

function productFormData(payload: ProductWritePayload) {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description);
  form.append('price', payload.price.replace('$', '').trim());
  form.append('gender', payload.gender.toLowerCase() === 'women' || payload.gender.toLowerCase() === 'wommen' ? 'female' : payload.gender.toLowerCase() === 'men' ? 'male' : 'unisex');
  form.append('category_name', payload.categoryName);
  form.append('is_active', 'true');
  form.append('sizes_data', JSON.stringify(payload.sizes));
  if (payload.imageFile) form.append('image', payload.imageFile);
  return form;
}

function normaliseGender(value: string) {
  if (value === 'female') return 'Wommen';
  if (value === 'male') return 'Men';
  return 'Kids';
}

function productImageUrl(image: string | null) {
  if (!image) return undefined;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  const origin = apiConfig.baseUrl.replace(/\/api$/, '');
  return `${origin}${image.startsWith('/') ? image : `/${image}`}`;
}

export function mapApiProduct(product: ApiProduct): Product {
  const sizesAndQuantities: SizeAndQuantity[] = product.sizes.map((size) => ({
    Size: size.size,
    quantity: size.stock,
    apiSizeId: size.id,
  }));
  return {
    id: String(product.id),
    productImg: productImageUrl(product.image),
    productName: product.name,
    productDescription: product.description,
    productPrice: `${product.price}$`,
    isDiscounted: product.isDiscounted,
    isArchived: product.isArchived,
    oldProductPrice: product.oldProductPrice ? `${product.oldProductPrice}$` : '',
    category: product.category.name,
    href: 'product/',
    gender: normaliseGender(product.gender),
    sizesAndQuantities,
  };
}

export function mapCartItem(item: ApiCartItem): Product & { cartItemId: number; selectedSize: ApiProductSize } {
  return {
    ...mapApiProduct(item.product),
    cartItemId: item.id,
    selectedSize: item.product_size,
  };
}

export const commerceApi = {
  getProducts: () => apiRequest<ApiProduct[]>('/products/'),
  getFavorites: () => apiRequest<ApiFavorite[]>('/favorites/'),
  addFavorite: (productId: number) => apiRequest<ApiFavorite>('/favorites/', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId }),
  }),
  removeFavorite: (favoriteId: number) => apiRequest<void>(`/favorites/${favoriteId}/`, { method: 'DELETE' }),
  getCart: () => apiRequest<ApiCartItem[]>('/cart/'),
  addCartItem: (productId: number, productSizeId: number, quantity: number) => apiRequest<ApiCartItem>('/cart/', {
    method: 'POST',
    body: JSON.stringify({ product_id: productId, product_size_id: productSizeId, quantity }),
  }),
  updateCartItem: (cartItemId: number, quantity: number) => apiRequest<ApiCartItem>(`/cart/${cartItemId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  }),
  removeCartItem: (cartItemId: number) => apiRequest<void>(`/cart/${cartItemId}/`, { method: 'DELETE' }),
  validateCoupon: (code: string, subtotal: number) => apiRequest<CouponValidation>('/coupons/validate/', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal: subtotal.toFixed(2) }),
  }),
  getCoupons: () => apiRequest<ApiCoupon[]>('/coupons/'),
  createCoupon: (code: string) => apiRequest<ApiCoupon>('/coupons/', {
    method: 'POST',
    body: JSON.stringify({ code, discount_type: 'percent', amount: '50.00', min_order_total: '0.00', active: true }),
  }),
  deleteCoupon: (couponId: number) => apiRequest<void>(`/coupons/${couponId}/`, { method: 'DELETE' }),
  getReturnPolicy: () => apiRequest<ApiReturnPolicy>('/return-policy/', { authenticated: false }),
  updateReturnPolicy: (returnPeriodDays: number) => apiRequest<ApiReturnPolicy>('/return-policy/', {
    method: 'PATCH',
    body: JSON.stringify({ return_period_days: returnPeriodDays }),
  }),
  getOrders: () => apiRequest<ApiOrder[]>('/orders/'),
  createOrder: (payload: Record<string, unknown>) => apiRequest<ApiOrder>('/orders/', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getReturns: () => apiRequest<ApiReturnRequest[]>('/returns/'),
  createReturn: (orderItemId: number, reason = '') => apiRequest<ApiReturnRequest>('/returns/', {
    method: 'POST',
    body: JSON.stringify({ order_item_id: orderItemId, reason }),
  }),
  getReviews: (productId?: number) => apiRequest<ApiReview[]>(productId ? `/reviews/?product=${productId}` : '/reviews/', { authenticated: false }),
  createReview: (productId: number | null, rating: number, comment: string) => apiRequest<ApiReview>('/reviews/', {
    method: 'POST',
    body: JSON.stringify({ ...(productId ? { product_id: productId } : {}), rating, comment }),
  }),
  deleteReview: (reviewId: number) => apiRequest<void>(`/reviews/${reviewId}/`, { method: 'DELETE' }),
  getAdminDashboard: () => apiRequest<AdminDashboardMetrics>('/admin/dashboard/'),
  createProduct: (payload: ProductWritePayload) => apiRequest<ApiProduct>('/products/', {
    method: 'POST',
    body: productFormData(payload),
  }),
  updateProduct: (productId: number, payload: ProductWritePayload) => apiRequest<ApiProduct>(`/products/${productId}/`, {
    method: 'PUT',
    body: productFormData(payload),
  }),
  archiveProduct: (productId: number) => apiRequest<{ status: string; id: number }>(`/products/${productId}/archive/`, { method: 'POST' }),
  unarchiveProduct: (productId: number) => apiRequest<{ status: string; id: number }>(`/products/${productId}/unarchive/`, { method: 'POST' }),
  setProductDiscount: (productId: number, percent: number) => apiRequest<{ status: string; id: number }>(`/products/${productId}/set_discount/`, {
    method: 'POST',
    body: JSON.stringify({ discount_percent: percent }),
  }),
  setBulkDiscount: (type: string, percent: number) => apiRequest<{ status: string; count: number }>('/products/bulk_discount/', {
    method: 'POST',
    body: JSON.stringify({ type, discount_percent: percent }),
  }),
};
