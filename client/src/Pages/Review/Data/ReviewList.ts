  
import Mekdad from "@/assets/Mekdad.jpg";
import AlAbbas from "@/assets/Al-Abbas.jpg";
import Zein from "@/assets/Zein.jpg";
import Hadi from "@/assets/Hadi.jpg";
import Soliman from "@/assets/Soliman.jpg";
import Mayyas from "@/assets//Mayas.jpg";
  export interface ReviewType {
  name: string;
  img: string | undefined;
  description: string;
}

  const ReviewList = [
    {
      name: " Mekdad Ahmad ",
      img: Mekdad,      
      description:
        "I ordered the Nike Air Max 270, and they’re even better in person! The cushioning is amazing for all-day wear, and the sizing was spot on (I went with my usual size). Shipping was fast, and the packaging was secure. Will definitely buy from this store again!",
    },
    {
      name: " Hadi Hasan ",
      img: Hadi,
      
      description:
        "The Nike Air Force 1s I got are legit and super stylish. The leather quality is premium, and they fit true to size. Customer service was helpful when I asked about sizing. Highly recommend this shop for authentic Nikes at a fair price!",
    },
    {
      name: "  Soliman Al Taweel  ",
      img: Soliman,      
      description:
        "Love my Nike React Vision shoes! The design is sleek, but they were a bit stiff at first. After a few wears, they molded to my feet and now feel great. One star off because they weren’t instantly comfy, but overall, a solid purchase.",
    },
    {
      name: "  Al Abbas Abbas  ",
      img: AlAbbas,      
      description:
        "I was hesitant to buy sneakers online, but these Nike Jordan 1s are the real deal! The details, stitching, and comfort are all top-notch. The site’s sizing guide was accurate, and delivery took only 2 days. Will be a returning customer!",
    },
    {
      name: "  Mayyas Al Rhayah  ",
      img: Mayyas,
      description:
        "Bought the Nike Revolution 6 for my workouts, and they’re fantastic! Lightweight, breathable, and no blisters even after long runs. The price was lower than other stores, and shipping was super fast. 10/10 experience!",
    },
    {
      name: "  Zein Zaher  ",
      img: Zein,
      description:
        "Got the Nike Dunk Low as a gift for my brother, and he loved them! The shoes came in a nice box, and the website even offered a gift message option. Smooth checkout and fast delivery. Great service!",
    },
  ];

  export default ReviewList;