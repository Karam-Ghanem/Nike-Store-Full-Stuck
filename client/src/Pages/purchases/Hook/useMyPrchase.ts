

import useCartStore from "@/Pages/Cart/cartStore";
import { useState } from "react";

const useMyPurchase = ()=>{
    
  const { myPurchases, purchaseDate, returnProduct } = useCartStore();
  const [returnPeriod,] = useState(10)
  const [allowed,setAllowed] = useState(false)

    return{
        myPurchases,
        purchaseDate,
        returnProduct,
        returnPeriod,
        allowed,
        setAllowed

    }
}


export default useMyPurchase;