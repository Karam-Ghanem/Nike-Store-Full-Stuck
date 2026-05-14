import shoese1 from "@/assets/shoese/_1.jpeg";
import type { Product } from "@/components/Products/Products Data/productsList";
// import shoese2 from "@/assets/shoese/_2.jpeg";
// import shoese3 from "@/assets/shoese/_3.jpeg";
export interface Archive{
    product:Product;
    date:Date;
}
const ArchiveList = [
    {product:
        {
        id:"7",
        productImg:shoese1,
        productName:"Nike ZoomX Vaporfly",
        productDescription:"This Nike Blazer is perfect for classic retro wardrobes, timeless minimalist outfits.",
        productPrice:"1100$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Lifestyle",
        href:'product/',
        gender:"Wommen",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    date:new Date(),
    }
    // {id:"0",date:new Date().getDate()+'/'+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),productImg:shoese1,productName:"Nike Air Force 1",productDescription:"This Nike sneaker is perfect for urban streetwear looks, minimalist modern outfits.",productPrice:"300$",category:"A",href:'product/',quantity:1},
    // {id:"1",date:new Date().getDate()+'/'+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),productImg:shoese1,productName:"Nike Air Max 90",productDescription:"This Nike sneaker is perfect for urban streetwear looks, minimalist modern outfits.",productPrice:"400$",category:"B",href:'product/',quantity:1},
    // {id:"2",date:new Date().getDate()+'/'+(new Date().getMonth()+1)+"/"+new Date().getFullYear(),productImg:shoese1,productName:"Nike Dunk Low",productDescription:"This Nike sneaker is perfect for urban streetwear looks, minimalist modern outfits.",productPrice:"500$",category:"C",href:'product/',quantity:1},
]
export default ArchiveList;