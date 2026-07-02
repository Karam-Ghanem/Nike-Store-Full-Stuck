

import useReturnStore from "@/Admin/page/Replacement/ReturnStore";
import useProductStore from "@/components/Products/ProductStore";
import useCartStore from "@/Pages/Cart/cartStore";
import { useState } from "react";

const useMyPurchase = ()=>{
    
  const { myPurchases, purchaseDate, returnProduct } = useCartStore();
  const {increaseStock} = useProductStore()
  const {returnPeriod} = useReturnStore()
  const [allowed,setAllowed] = useState(false)

    return{
        myPurchases,
        purchaseDate,
        returnProduct,
        returnPeriod,
        allowed,
        setAllowed,
      increaseStock

    }
}


export default useMyPurchase;