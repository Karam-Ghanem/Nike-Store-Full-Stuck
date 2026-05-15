import { Box } from "@chakra-ui/react"
import type { Product } from "./Products Data/productsList"
import { keyframes } from "@emotion/react";

interface Props{
    item:Product;
}
const SoldDesign = ({item}:Props) => {

    const soldAnimation = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(45deg) scale(1.1); }
  50% { transform: rotate(0deg) scale(1); }
  75% { transform: rotate(-45deg) scale(1.1); }
  100% { transform: rotate(0deg) scale(1); }
`;
  return (
    <>
        <Box
        display={item.isDiscounted ? "block" : "none"}
        bg="red.500"
        color="white"
        px="4"
        py="1"
        rounded="md"
        fontWeight="bold"
        w="fit-content"
        boxShadow="lg"
        animation={`${soldAnimation} 3s ease-in-out infinite`}
        >
        SOLD
        </Box>
    </>
  )
}

export default SoldDesign
