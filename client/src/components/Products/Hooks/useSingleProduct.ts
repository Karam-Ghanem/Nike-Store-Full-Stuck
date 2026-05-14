
import { useParams } from "react-router-dom";
import { useState } from "react";
import useCartStore from "@/Pages/Cart/cartStore";
import useProductStore from "../ProductStore";

const useSingleProduct = ()=>{
  const { id } = useParams();
  const { cartItems, deleteProductFromCart } = useCartStore();
  const { products } = useProductStore();

  const currentProduct = products.find((product2) => product2.id === id);


    const [isEnoughQuantity, setIsEnoughQuantity] = useState(true);



  // -----------------------------
  // 1) userChosen: quantity لكل نمرة
  // -----------------------------
  const [userChosen, setUserChosen] = useState(
    currentProduct?.sizesAndQuantities.map((sq) => ({
      Size: sq.Size,
      quantity: 1,
    })) || []
  );

  // -----------------------------
  // 2) النمرة المختارة
  // -----------------------------
  const [chosenSize, setChosenSize] = useState("");

  // -----------------------------
  // 3) جلب الكمية الحالية للنمرة المختارة
  // -----------------------------
  const getQuantityForSize = (size: string) => {
    return userChosen.find((uc) => uc.Size === size)?.quantity || 1;
  };


    return {
        userChosen,
        cartItems,
        chosenSize,
        currentProduct,
        deleteProductFromCart,
        getQuantityForSize,
        isEnoughQuantity,
        setChosenSize,
        setIsEnoughQuantity,
        setUserChosen,
    }
}


export default useSingleProduct;