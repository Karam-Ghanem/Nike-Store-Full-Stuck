import shoese1 from "@/assets/shoese/_1.jpeg";
import shoese2 from "@/assets/shoese/_2.jpeg";
import shoese3 from "@/assets/shoese/_3.jpeg";
import shoese4 from "@/assets/shoese/_4.jpeg";
import shoese5 from "@/assets/shoese/_5.jpeg";
import shoese6 from "@/assets/shoese/_6.jpeg";
import shoese7 from "@/assets/shoese/_7.jpeg";
import shoese8 from "@/assets/shoese/_8.jpeg";


export interface SizeAndQuantity{
    Size:string;
    quantity:number;    
}


export interface Product{
    id: string;
    productImg: string | undefined;
    productName: string;
    productDescription: string;
    productPrice: string;
    isDiscounted:boolean;
    isArchived:boolean;
    oldProductPrice:string;
    category: string;
    href: string; 
    gender:string;
    sizesAndQuantities:SizeAndQuantity[];
}

const ProductsList =[

    {
        id:"0",
        productImg:shoese1,
        productName:"Nike Air Force 1",
        productDescription:"This Nike sneaker is perfect for urban streetwear looks, minimalist modern outfits.",
        productPrice:"400$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Lifestyle",
        href:'product/',
        gender:"Men",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    {
        id:"1",
        productImg:shoese2,
        productName:"Nike Air Max 90",
        productDescription:"This Nike runner is perfect for athletic-inspired styles, clean contemporary wardrobes.",
        productPrice:"500$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Running",
        href:'product/',
        gender:"Wommen",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ],
    },
    {
        id:"2",
        productImg:shoese3,
        productName:"Nike Air Jordan 1",
        productDescription:"This Nike Air model is perfect for bold street aesthetics, retro‑inspired fashion.",
        productPrice:"600$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Basketball",
        href:'product/',
        gender:"Kids",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    {
        id:"3",
        productImg:shoese4,
        productName:"Nike Dunk Low",
        productDescription:"This Nike Court shoe is perfect for casual everyday outfits, sporty chic combinations.",
        productPrice:"700$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Training-Gym",
        href:'product/',
        gender:"Men",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    {
        id:"4",
        productImg:shoese5,
        productName:"Nike Blazer Mid '77",
        productDescription:"This Nike Zoom pair is perfect for high‑energy training vibes, futuristic activewear looks.",
        productPrice:"80$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Football/Soccer",
        href:'product/',
        gender:"Wommen",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    {
        id:"5",
        productImg:shoese6,
        productName:"Nike Pegasus 40",
        productDescription:"This Nike Dunk is perfect for vintage street culture, colorful expressive styles.",
        productPrice:"900$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Tennis",
        href:'product/',
        gender:"Kids",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    {
        id:"6",
        productImg:shoese7,
        productName:"Nike React Infinity Run",
        productDescription:"This Nike Free shoe is perfect for relaxed lifestyle outfits, breathable summer looks.",
        productPrice:"1000$",
        isDiscounted:false,
        isArchived:false,
        oldProductPrice:'',
        category:"Skateboarding",
        href:'product/',
        gender:"Men",
        sizesAndQuantities:[
        {Size:'40',quantity:1},
        {Size:'41',quantity:2},
        {Size:'42',quantity:3},
        {Size:'43',quantity:4},
        ]
    },
    {
        id:"7",
        productImg:shoese8,
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


]



export default ProductsList;