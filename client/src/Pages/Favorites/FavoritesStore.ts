import { create } from 'zustand'
import type { Product } from '@/components/Products/Products Data/productsList';

interface productStore{
    favoritesItems:Product [];
    addProductToFavList:(product:Product)=>void;
    deleteProductFromFav:(productID:string)=>void;
}
const useFavoriteStore =create<productStore>(set=>({
    favoritesItems:[],
    addProductToFavList:(product)=>set((store)=>({
        favoritesItems:[...store.favoritesItems,product]
    })),
    deleteProductFromFav:(productID)=>set((store)=>({
        favoritesItems:store.favoritesItems.filter((prod)=>prod.id!=productID)
    })),
}))

export default useFavoriteStore;