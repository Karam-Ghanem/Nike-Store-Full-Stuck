

import useCartStore from "@/Pages/Cart/cartStore";
import { useState } from "react";
// import useReturnStore from "@/Admin/page/Replacement/ReturnStore";

const useMyPurchase = ()=>{
    
  const { myPurchases, purchaseDate, returnProduct } = useCartStore();
  const [returnPeriod,] = useState(10)
  const [allowed,setAllowed] = useState(false)
  // const {returnPeriod} = useReturnStore()
  

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