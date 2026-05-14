



import type { Product, SizeAndQuantity } from "@/components/Products/Products Data/productsList";
import { useParams } from "react-router-dom";
import useProductStore from "@/components/Products/ProductStore";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import Categories from "@/components/Products/Products Data/ProductCategories";
import Genders from "@/components/Products/Products Data/ProductsGender";


const useProductAdmin = ()=>{
  const Sizes = ["30","31","32","33","34","35","36","37","38","39","40","41","42","43","44","45","46","47"];
  const {addProduct,products,editProduct} = useProductStore();
  const {id} = useParams();
  const currenntProductData = products.find(product=>product.id==id);
  // const [ currentShoeseSizes, ] =useState((currenntProductData?.sizesAndQuantities.map((size) => size.Size) || [])
  const [ currentShoeseSizesAndQuantity, ] =useState<SizeAndQuantity[]>((currenntProductData?.sizesAndQuantities.map((size) => size) ||[]))




  const [newProduct, setNewProduct] = useState<Product>(currenntProductData ||{
    productName: "",
    productDescription: "",
    productPrice: "",
    oldProductPrice:'',
    isDiscounted:false,
    isArchived:false,
    category: "Category",
    sizesAndQuantities:currentShoeseSizesAndQuantity,
    gender: "Gender ",
    href: "product/",
    id:uuidv4(),
    productImg:"",
  });

  const genders = Genders.filter((_gender,index)=>index!==0)
  const categories = Categories.filter((_cat,index)=>index!==0)

    return {
        Categories,
        Genders,
        Sizes,
        addProduct,
        categories,
        currenntProductData,
        editProduct,
        newProduct,
        setNewProduct,
        genders,
        id,
        currentShoeseSizesAndQuantity,
    }
}

export default useProductAdmin;