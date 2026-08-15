import { Alert, Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "@/auth/authStore";
import { Toaster, toaster } from "@/components/ui/toaster";
import useCartStore from "@/Pages/Cart/cartStore";

import type { Product } from "../Products/Products Data/productsList";

interface Props {
  product?: Product;
  currentShoeseSize: string;
  currentShoeseQuantity: number;
  isSelectSize: boolean;
  currentShoeseID: string;
  isEnoughQuantity: boolean;
}

const AddToCartButton = ({
  product,
  currentShoeseSize,
  currentShoeseQuantity,
  currentShoeseID,
  isSelectSize,
  isEnoughQuantity,
}: Props) => {
  const { addProductToCart, cartItems } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const isAdded = cartItems.some((item) => item.currentShoeseID === currentShoeseID);

  const addToCart = async () => {
    if (!product || isAdded) return;
    if (!user) {
      toaster.create({ title: "Please log in before adding products to your cart.", type: "info", duration: 3500 });
      navigate('/auth');
      return;
    }
    try {
      await addProductToCart(product, currentShoeseSize, currentShoeseQuantity, currentShoeseID);
      toaster.create({ title: "Product added to your cart successfully!", type: "success", duration: 5000 });
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : "Unable to add this product to your cart.",
        type: "error",
        duration: 4500,
      });
    }
  };

  return (
    <Box
      textAlign="center"
      width="fit-content"
      borderRadius="20px"
      className={!isAdded ? "bg-linear-to-r from-purple-400 via-pink-500 to-red-500" : "bg-green-600 "}
    >
      <Toaster />
      {isEnoughQuantity ? (
        <Button
          disabled={isSelectSize}
          color="white"
          cursor={!isAdded ? "pointer" : "menuitem"}
          onClick={() => void addToCart()}
          variant="ghost"
          transition="0.8s"
          _hover={!isAdded ? { backgroundColor: "#16a34a", color: "white" } : {
            backgroundColor: "#16a34a",
            color: "white",
            borderRadius: "20px",
          }}
          fontSize={{ base: 12, sm: 14, lg: 15, xl: 16 }}
        >
          {isAdded ? "Added" : "Add To Cart"}
        </Button>
      ) : (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Not Enough Quantity</Alert.Title>
            <Alert.Description>
              Unfortunately, the requested quantity is not available at the moment. We are working on restocking within the next few days.
              Thank you for your understanding.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </Box>
  );
};

export default AddToCartButton;
