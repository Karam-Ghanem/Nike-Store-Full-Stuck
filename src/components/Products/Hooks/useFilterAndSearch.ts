
import useProductStore from "@/components/Products/ProductStore";



import { useState } from "react";
import { type Query } from "@/components/Products/ProductControls";

const useFilterAndSearch = (isAnimating:(animate:boolean)=>void)=>{
// search
    const startSearching = () => {
    isAnimating(true);
    setTimeout(() => {
      Searching(searchText);
      isAnimating(false);
    }, 800);
  };
  const ResetSearching = () => {
    isAnimating(true);
    setTimeout(() => {
      Searching("");
      isAnimating(false);
    }, 800);
  };

  const { Searching ,products } = useProductStore();

  const [searchText, setSearchText] = useState("");

// filter


    const [selectedCategory, setSelectedCategry] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [query, setQuery] = useState<Query>({selectedCategory: "",selectedGender: "",});
    const { Filteration } = useProductStore();


//returns

    return {
        startSearching,
        ResetSearching,
        setSearchText,
        searchText,
        selectedCategory,
        setSelectedCategry,
        selectedGender,
        setSelectedGender,
        query,
        setQuery,
        Filteration,
        products
    }
}


export default useFilterAndSearch