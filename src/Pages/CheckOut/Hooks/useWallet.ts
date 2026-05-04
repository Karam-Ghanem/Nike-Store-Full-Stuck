
import { useNavigate, useParams } from "react-router-dom";
import paymentData from "../Data/PaymentData";
import { useState } from "react";

import useCartStore from "@/Pages/Cart/cartStore";
import useProductStore from "@/components/Products/ProductStore";
import type { Transaction } from "../Wallet";


const useWallet = ()=>{
  const { type } = useParams();
  const navigate = useNavigate()
  const [transactionData, setTransactionData] = useState<Transaction>({
    walletAddress: "66233636",
    transactionID: "",
  });

  type PaymentKey = keyof typeof paymentData;

  const data = paymentData[type as PaymentKey];
  const { getTotalPrice, cartItems,addProductsToMyPurchases } = useCartStore();
  const { decreaseStock } = useProductStore();

    return{
        navigate,
        transactionData,
        setTransactionData,
        data,
        getTotalPrice,
        cartItems,
        addProductsToMyPurchases,
        decreaseStock
    }
}

export default useWallet;