import { useState } from "react";
import Categories from "@/components/Products/Products Data/ProductCategories";
import Genders from "@/components/Products/Products Data/ProductsGender";
import useProductStore from "@/components/Products/ProductStore";
import { useParams } from "react-router-dom";

const useSalesAdmin = ()=>{
  const [selectedType, setSelectedType] = useState("");
  const [selectedPercentage, setSelectedPercentage] = useState(1);
  const {products} = useProductStore()
  const {id} = useParams()
  const shoeseName =id? products.find(prod=>prod.id==id)?.productName : ''
  

  const {applyDiscount,applyDiscountOnShoese} = useProductStore()
  const categoriesAndGenders = [
    ...Categories,
    ...Genders.filter((gender) => gender.label != "All"),
  ];


    return {
        id,
        selectedType,
        setSelectedType,
        selectedPercentage,
        setSelectedPercentage,
        shoeseName,
        applyDiscount,
        applyDiscountOnShoese,
        categoriesAndGenders,
    }
}


export default useSalesAdmin;