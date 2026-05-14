
import { useParams } from "react-router-dom";
import useFavoriteStore from "@/Pages/Favorites/FavoritesStore";
import useProduct from "@/components/Products/Hooks/useProduct";

const useRelatedProducts = ()=>{

 const { category } = useParams();
 const {addProductToFavList,deleteProductFromFav} = useFavoriteStore();
 const {favItems,setFavItems} = useProduct(false)


    return{
        category,
        addProductToFavList,
        deleteProductFromFav,
        favItems,
        setFavItems,
    }
}


export default useRelatedProducts;