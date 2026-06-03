
import { useParams } from "react-router-dom";
import useFavoriteStore from "@/Pages/Favorites/FavoritesStore";
import useProduct from "@/components/Products/Hooks/useProduct";
import useProductStore from "../ProductStore";

const useRelatedProducts = ()=>{
    
 const { category } = useParams();
 const {addProductToFavList,deleteProductFromFav} = useFavoriteStore();
 const {favItems,setFavItems} = useProduct(false)
 const {products} = useProductStore()


    return{
        category,
        addProductToFavList,
        deleteProductFromFav,
        favItems,
        setFavItems,
        products,
    }
}


export default useRelatedProducts;