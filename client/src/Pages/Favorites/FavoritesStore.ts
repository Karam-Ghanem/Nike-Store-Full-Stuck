import { create } from 'zustand'
import type { Product } from '@/components/Products/Products Data/productsList';

interface productStore{
    favoritesItems:Product [];
    addProductToFavList:(product:Product)=>void;
    deleteProductFromFav:(productID:string)=>void;
    // setFavoritesItems:(productID:string,newQuantityValue:number)=>void;
}
const useFavoriteStore =create<productStore>(set=>({
    favoritesItems:[],
    addProductToFavList:(product)=>set((store)=>({
        favoritesItems:[...store.favoritesItems,product]
    })),
    deleteProductFromFav:(productID)=>set((store)=>({
        favoritesItems:store.favoritesItems.filter((prod)=>prod.id!=productID)
    })),
    // setFavoritesItems:(productID,newQuantityValue)=>set((store)=>({
    //     // favoritesItems:[...store.favoritesItems.map((product)=>{if(product.id===productID)product.quantity=newQuantityValue; return product})]
    //     favoritesItems:[...store.favoritesItems.map((product)=>{if(product.id===productID)product.sizesAndQuantities=newQuantityValue; return product})]
    // }))
}))

export default useFavoriteStore;