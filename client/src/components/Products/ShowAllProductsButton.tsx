import { Box, Text } from "@chakra-ui/react"
import { Link } from "react-router-dom"

const ShowAllProductsButton = () => {
  return (
    <>
    <Box
    marginBottom="50px"
    textAlign={{ base: "center", md: "start" }}    
    >
        <Link to={"/products"}>
        <Text
        cursor="pointer"
        display={{ base: "inline-block", md: "inline" }}
        color="white"
        backgroundColor="#6c14d0"
        padding={{ base: "10px", sm: "10px 20px", lg: "15px 30px" }}
        className="shadow-xl shadow-blue-500/50"
        _hover={{ color: "black", backgroundColor: "#a800b7" }}
        transition="0.5s"
        fontSize={{
            base: "13px",
            sm: "18px",
            md: "19px",
            lg: "18px",
            xl: "18px",
        }}
        >
        Show All Products
        </Text>
    </Link>
    </Box>
    </>
  )
}

export default ShowAllProductsButton
