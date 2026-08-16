import { useState } from "react";
import useProduct from "./useProduct";

// عدّل هذه القيمة لتحديد عدد المنتجات الظاهرة في كل صفحة.
export const PRODUCTS_PER_PAGE = 4;

const useProductPagentaion = (
  homePage: boolean,
  productsPerPage: number = PRODUCTS_PER_PAGE,
) => {
  const { products } = useProduct(homePage);
  const [currentPage, setCurrentPage] = useState(1);
  const safeProductsPerPage = Math.max(1, productsPerPage);
  const lastIndex = currentPage * safeProductsPerPage;
  const firstIndex = lastIndex - safeProductsPerPage;
  const needed = Math.max(1, Math.ceil(products.length / safeProductsPerPage));

  const actualProductList = homePage
    ? products.slice(0, safeProductsPerPage)
    : products.slice(firstIndex, lastIndex);

  return {
    completePages: needed,
    currentPage,
    produtsPerPage: safeProductsPerPage,
    setCurrentPage,
    firstIndex,
    lastIndex,
    needed,
    actualProductList,
  };
};

export default useProductPagentaion;
