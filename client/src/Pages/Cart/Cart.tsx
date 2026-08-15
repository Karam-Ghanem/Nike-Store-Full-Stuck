import MainTitle from "@/components/PublicCompontents/MainTitle";
import {
  Box,
  Grid,
} from "@chakra-ui/react";
import useCartStore from "@/Pages/Cart/cartStore";
import { Toaster } from "@/components/ui/toaster";
import CartTable from "./CartTable";
import CartTotalAndCoupon from "./CartTotalAndCoupon";
import { useEffect } from "react";

const Cart = () => {
  const { cartItems, loadCart } =useCartStore();

  useEffect(() => {
    void loadCart();
  }, [loadCart]);


  if (cartItems.length < 1) {
    return (
      <Box minHeight={{base:'auto',sm:'300px'}}>
        <MainTitle title="No Products To Show" />
      </Box>
    );
  }

  return (
    <>
      <Toaster />
        <MainTitle title="Cart" />
        <Box
          mx="auto"
          borderRadius="lg"
          boxShadow={{ base: "none", sm: "lg" }}
          p={{ base: 0, md: 8 }}
        >
          <Grid
            templateColumns={{ base: "1fr", md: "3fr 1fr" }}
            gap={{ base: 4, md: 8 }}
            alignItems="flex-start"
          >
            {/* LEFT SIDE — PRODUCTS TABLE */}
            <CartTable/>
            {/* RIGHT SIDE — TOTALS + COUPON */}
            <CartTotalAndCoupon/>
          </Grid>
        </Box>
    </>
  );
};

export default Cart;
