  import { faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faHeadset } from "@fortawesome/free-solid-svg-icons"; 
   
   
   const ServicesData = [
    {
      name: "Fast Delivery",
      img: "faTruckFast",
      description: " Your Nike shoes arrive swiftly within 24 hours locally! ",
    },
    {
      name: "10 Days Replacement",
      img: "faRotateLeft",
      description: " Easy exchanges, no hassle your satisfaction guaranteed! ",
    },
    {
      name: "24 x 7 Support",
      img: "faHeadset",
      description: " 24/7 customer care instant help anytime! ",
    },
  ];


   export const components = {
    faTruckFast: faTruckFast,
    faRotateLeft: faRotateLeft,
    faHeadset: faHeadset,
  };












  export default ServicesData