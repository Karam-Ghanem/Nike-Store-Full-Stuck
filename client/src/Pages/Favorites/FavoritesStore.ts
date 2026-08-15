import { create } from 'zustand';

import { commerceApi, mapApiProduct } from '@/api/commerce';
import { getAccessToken } from '@/api/client';
import type { Product } from '@/components/Products/Products Data/productsList';

interface ProductStore {
  favoritesItems: Product[];
  loadFavorites: () => Promise<void>;
  addProductToFavList: (product: Product) => Promise<void>;
  deleteProductFromFav: (productID: string) => Promise<void>;
}

const useFavoriteStore = create<ProductStore>((set, get) => ({
  favoritesItems: [],

  loadFavorites: async () => {
    if (!getAccessToken()) return;
    const favorites = await commerceApi.getFavorites();
    set({
      favoritesItems: favorites.map((favorite) => ({
        ...mapApiProduct(favorite.product),
        favoriteId: favorite.id,
      })),
    });
  },

  addProductToFavList: async (product) => {
    if (!getAccessToken()) return;
    const favorite = await commerceApi.addFavorite(Number(product.id));
    set((state) => ({
      favoritesItems: [...state.favoritesItems, { ...mapApiProduct(favorite.product), favoriteId: favorite.id }],
    }));
  },

  deleteProductFromFav: async (productID) => {
    const favorite = get().favoritesItems.find((product) => product.id === productID);
    if (favorite?.favoriteId && getAccessToken()) await commerceApi.removeFavorite(favorite.favoriteId);
    set((state) => ({ favoritesItems: state.favoritesItems.filter((product) => product.id !== productID) }));
  },
}));

export default useFavoriteStore;
