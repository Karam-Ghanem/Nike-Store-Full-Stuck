import { Button } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import type { Product } from "../Products/Products Data/productsList";
import { Toaster, toaster } from "@/components/ui/toaster";
import useCartStore from "@/Pages/Cart/cartStore";
import { Alert } from "@chakra-ui/react";
interface Props {
  product?: Product;
  currentShoeseSize: string;
  currentShoeseQuantity: number;
  isSelectSize: boolean;
  currentShoeseID: string;
  isEnoughQuantity:boolean
}
const AddToCartButton = ({ product,currentShoeseSize,currentShoeseQuantity,currentShoeseID,isSelectSize,isEnoughQuantity }: Props) => {
  const { addProductToCart, cartItems } = useCartStore();





  return (
    <>
      <Box
        textAlign="center"
        width={"fit-content"}
        borderRadius="20px"
        className={
          !cartItems
            .map((item) => item.currentShoeseID)
            .includes(currentShoeseID)
            ? "bg-linear-to-r from-purple-400 via-pink-500 to-red-500"
            : "bg-green-600 "
        }
      >
        <Toaster />

        {isEnoughQuantity ? (
          <Button
            disabled={isSelectSize}
            color={"white"}
            cursor={
              !cartItems
                .map((item) => item.currentShoeseID)
                .includes(currentShoeseID)
                ? "pointer"
                : "menuitem"
            }
            onClick={() => {
              if (
                !cartItems
                  .map((item) => item.currentShoeseID)
                  .includes(currentShoeseID)
              ) {
                addProductToCart(
                  product!,
                  currentShoeseSize,
                  currentShoeseQuantity,
                  currentShoeseID
                );
                toaster.create({
                  title: "Product added to your cart successfully!",
                  type: "success",
                  duration: 5000,
                });
              }
            }}
            variant="ghost"
            transition="0.8s"
            _hover={
              !cartItems
                .map((item) => item.currentShoeseID)
                .includes(currentShoeseID)
                ? { backgroundColor: "#16a34a", color: "white" }
                : {
                    backgroundColor: "#16a34a",
                    color: "white",
                    borderRadius: "20px",
                  }
            }
            fontSize={{ base: 12, sm: 14, lg: 15, xl: 16 }}
          >
            {/* Add to cart */}

            {cartItems
              .map((item) => item.currentShoeseID)
              .includes(currentShoeseID)
              ? "Added"
              : "Add To Cart"}

          </Button>
        ) : (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Not Enough Quantity</Alert.Title>
              <Alert.Description>
                Unfortunately, the requested quantity is not available at the
                moment. We are working on restocking within the next few days.
                Thank you for your understanding.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )}
      </Box>
    </>
  );
};

export default AddToCartButton;








