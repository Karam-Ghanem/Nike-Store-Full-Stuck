

import { useState } from "react";
import useProduct from "./useProduct";

const useProductPagentaion = ()=>{


    const {products,homePage} = useProduct(false)

    const [currentPage,setCurrentPage] = useState(1);
    const produtsPerPage = 4;
    const lastIndex = currentPage * produtsPerPage;
    const firstIndex = lastIndex - produtsPerPage;

    
    const completePages =products.length>produtsPerPage ?  Math.floor(products.length / produtsPerPage) : 1;
    const lastPage = products.length % produtsPerPage;
    const needed =products.length>=produtsPerPage ? lastPage > 0 ? completePages+1 : completePages : 1;

    const actualProductList = homePage ? products.slice(0, 4) :  products.slice(firstIndex,lastIndex);




  return{

    completePages,
   currentPage,
    produtsPerPage,
    setCurrentPage,
    firstIndex,
    lastIndex,
    needed,
    actualProductList,
  }
}


export default useProductPagentaion;