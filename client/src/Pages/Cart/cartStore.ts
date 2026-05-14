import { create } from 'zustand'
import type { Product } from '@/components/Products/Products Data/productsList';



export interface CatrtItem{
    product:Product;
    currentShoseSize:string;
    currentShoseQuantity:number ;
    currentShoeseID:string;
}

interface cartStore{
    cartItems:CatrtItem [];
    myPurchases:CatrtItem[];
    purchaseDate:Date ;
    currentShoeseQuantity:number;
    addProductToCart:(product:Product,currentShoseSize:string,currentShoeseQuantity:number,currentShoeseID:string)=>void;
    setCurrentChoseQuantity:(currentShoeseID:string,currentShoeseQuantity:number)=>void;
    deleteProductFromCart:(currentShoeseID:string)=>void;
    getTotalPrice:(cartItems:CatrtItem[])=>number;
    addProductsToMyPurchases:(myPurchases:CatrtItem[],purchaseDate:Date)=>void;
    returnProduct:(productID:string | Product)=>void;
}
const useCartStore =create<cartStore>(set=>({
    cartItems:[],
    myPurchases:[],
    purchaseDate:new Date(),
    currentShoeseQuantity:0,
    addProductToCart:(product,currentShoeseSize,currentShoeseQuantity,currentShoeseID)=>set((store)=>({
        cartItems:[...store.cartItems,{product: product,currentShoseSize: currentShoeseSize,currentShoseQuantity:currentShoeseQuantity,currentShoeseID:currentShoeseID}]
    })),
    setCurrentChoseQuantity:(currentShoeseID,currentShoeseQuantity)=>set((store)=>({
       cartItems:[...store.cartItems.map((product)=>{if(product.currentShoeseID===currentShoeseID)product.currentShoseQuantity=currentShoeseQuantity; return product})]

    })),
    deleteProductFromCart:(currentShoeseID)=>set((store)=>({
        cartItems:store.cartItems.filter((prod)=>prod.currentShoeseID!=currentShoeseID)
    })),
    getTotalPrice:(cartItems)=>{
    const totalPrice =cartItems.reduce(
    (acc, item) =>
    acc + item.currentShoseQuantity! * parseFloat(item.product.productPrice),
    0
    )
    return totalPrice;
    },
    addProductsToMyPurchases:(myPurchases,purchaseDate)=>set(()=>({
        myPurchases:[...myPurchases],
        purchaseDate:purchaseDate,
        cartItems:[],

        
    })),
    returnProduct:(productID)=>set((store)=>({
        myPurchases:store.myPurchases.filter((prod)=>prod.currentShoeseID!=productID),
        cartItems:store.cartItems.filter((prod)=>prod.currentShoeseID!=productID)

    }))
}))

export default useCartStore;