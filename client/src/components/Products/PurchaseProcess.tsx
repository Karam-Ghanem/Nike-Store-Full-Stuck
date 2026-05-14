import useCartStore from "@/Pages/Cart/cartStore";
import { Box, Button } from "@chakra-ui/react";
import type { Product } from "./Products Data/productsList";
import { Link } from "react-router-dom";

interface Props{
    item:Product;
}
const PurchaseProcess = ({item}:Props) => {

    const {cartItems} = useCartStore()
  return (
    <>
      <Box>
        <Button
        fontSize={{base:6,sm:10 ,md:12 ,lg:15 }}
        width={{base:'20px',sm:"60px" ,md:"80px" ,lg:"100px" }}
          bg={
            cartItems.map((item) => item.product.id).includes(item!.id)
              ? "green"
              : "#6c14d0"
          }
        >
          <Link to={`/${item.href}${item.id}/${item.category}`}>
            {cartItems.map((item) => item.product.id).includes(item!.id)
              ? "Added"
              : "Add To Cart"}
          </Link>
        </Button>
      </Box>
    </>
  );
}

export default PurchaseProcess
