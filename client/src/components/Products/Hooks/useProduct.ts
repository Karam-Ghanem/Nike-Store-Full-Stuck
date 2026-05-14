import useFavoriteStore from "@/Pages/Favorites/FavoritesStore";
import { useState } from "react";
import useProductStore from "@/components/Products/ProductStore";

const useProduct = (homePage:boolean)=>{
  
    const { products } = useProductStore();

    const [isAnimating,setIsAnimating] = useState(false)

    const { addProductToFavList, favoritesItems, deleteProductFromFav } =useFavoriteStore();

    const [favItems, setFavItems] = useState(favoritesItems.map((item) => item.id));


  return{
    products,
    isAnimating,
    setIsAnimating,
    addProductToFavList,
    deleteProductFromFav,
    favItems,
    setFavItems,
    homePage,
  }


}


export default useProduct;