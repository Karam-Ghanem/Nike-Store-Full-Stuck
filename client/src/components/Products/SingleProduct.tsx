import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import AddToCartButton from "../PublicCompontents/AddToCartButton";
import MainHead from "../PublicCompontents/MainHead";
import RelatedProducts from "./RelatedProducts";
import View360 from "../About/View360";
import { Toaster, toaster } from "@/components/ui/toaster";

import { useEffect } from "react";
import useSingleProduct from "./Hooks/useSingleProduct";


interface Props{
  isAdmin:boolean;
}
const SingleProduct = ({isAdmin}:Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const {cartItems,userChosen,chosenSize,currentProduct,deleteProductFromCart,getQuantityForSize,isEnoughQuantity,setChosenSize,setIsEnoughQuantity,setUserChosen} = useSingleProduct()


  return (
    <>
      <Toaster />
      <SimpleGrid
        columns={{ base: 1, sm: 1, lg: 1, xl: 2 }}
        gap={20}
        marginTop={30}
        marginBottom={35}
      >
        <Box className="shadow-xl flex justify-center">
          <Image src={currentProduct?.productImg} width={{base:'250px',sm:'350px',md:'450px',lg:'550'}} height={{base:'250px',sm:'100',md:'400px',lg:'400px'}} />
        </Box>

        <Box>
          <Heading size={"3xl"} marginBottom={2}>
            {currentProduct?.productName}
          </Heading>

          <Text marginBottom={4} fontSize={18}>
            {currentProduct?.category}
          </Text>

          <Text marginBottom={4} fontSize={18}>
            {currentProduct?.productPrice}
          </Text>

          <Text marginBottom={4} fontSize={16} color={"#777"}>
            {currentProduct?.productDescription}
          </Text>

          {/* Sizes */}
          <Box marginY={5}>
            {currentProduct?.sizesAndQuantities.map((s) => (
              <Button
                onClick={() => {
                  setChosenSize(s.Size);
                  if (
                    (userChosen.find((uc) => uc.Size == s.Size)?.quantity ??
                      0) >
                    (currentProduct?.sizesAndQuantities.find(
                      (ss) => ss.Size === s.Size
                    )?.quantity ?? 0)
                  ) {
                    setIsEnoughQuantity(false);
                  } else {
                    setIsEnoughQuantity(true);
                  }
                }}
                bg={chosenSize === s.Size ? "#7008e7" : "#7777"}
                color={chosenSize === s.Size ? "white" : "black"}
                fontSize={12}
                size={"sm"}
                marginEnd={1}
                marginBottom={1}
                key={s.Size}
              >
                {s.Size}
              </Button>
            ))}
          </Box>

          {/* Quantity */}
          <Box marginBottom={4} display={isAdmin ? "none" : "block"}>
            <Field.Root marginTop={3}>
              <Field.Label fontSize={"15px"}>Chose quantity :</Field.Label>

              <Input
                value={getQuantityForSize(chosenSize)}
                onChange={(e) => {
                  const newQ = parseInt(e.target.value);
                  setUserChosen((prev) =>
                    prev.map((uc) =>
                      uc.Size === chosenSize ? { ...uc, quantity: newQ } : uc
                    )
                  );
                  if (
                    newQ >
                    (currentProduct?.sizesAndQuantities.find(
                      (ss) => ss.Size === chosenSize
                    )?.quantity ?? 0)
                  ) {
                    setIsEnoughQuantity(false);
                  } else {
                    setIsEnoughQuantity(true);
                  }
                }}
                min={1}
                max={
                  currentProduct?.sizesAndQuantities.find(
                    (ss) => ss.Size === chosenSize
                  )?.quantity
                }
                disabled={
                  currentProduct?.sizesAndQuantities.find(
                    (cp) => cp.Size === chosenSize
                  )?.quantity
                    ? false
                    : true
                }
                width={"100px"}
                type="number"
                required
                border={"1px solid #a800b7"}
              />

              <Field.ErrorText></Field.ErrorText>
            </Field.Root>
          </Box>

          <HStack display={isAdmin ? "none" : "flex"}>
            <AddToCartButton
              isEnoughQuantity={isEnoughQuantity}
              currentShoeseID={currentProduct?.id+"-"+chosenSize}
              isSelectSize={chosenSize ? false : true}
              currentShoeseSize={chosenSize}
              currentShoeseQuantity={getQuantityForSize(chosenSize)}
              product={currentProduct}
            />

            <Button
              onClick={() => {
                deleteProductFromCart(currentProduct?.id + chosenSize);
                toaster.create({
                  title: "Product Deleted From your Cart Successfully!",
                  type: "success",
                  duration: 5000,
                });
              }}
              display={
                cartItems
                  .map((item) => item.currentShoeseID)
                  .includes(currentProduct?.id + chosenSize)
                  ? "block"
                  : "none"
              }
              borderRadius={20}
              bg={"red"}
              color={"white"}
              _hover={{ bg: "white", color: "red" }}
              transition={"0.8s"}
            >
              Remove
            </Button>
          </HStack>
        </Box>
      </SimpleGrid>

      {/* 360° View */}
      <MainHead head=" 360° View" />
      <View360 />

      {/* Related Products */}
      <Box display={isAdmin ? "none" : "block"}>
        <MainHead head="Related Products" />
        <RelatedProducts />
      </Box>
    </>
  );
};

export default SingleProduct;
