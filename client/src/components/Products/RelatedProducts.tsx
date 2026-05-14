import { Box, IconButton, Text } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import { Card, Image } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import ProductsList from "./Products Data/productsList";
import { Link } from "react-router-dom";
import PurchaseProcess from "./PurchaseProcess";


import { Toaster,toaster } from "../ui/toaster";
import useRelatedProducts from "./Hooks/useRelatedProducts";

const RelatedProducts = () => {

  const {addProductToFavList,category,deleteProductFromFav,favItems,setFavItems} = useRelatedProducts()

  return (
    <>
      <Toaster />
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3, xl: 4 }} gap="10px">
        {ProductsList.map(
          (item) =>
            item.category == category && (
              <Card.Root
                height={570}
                scale={0.9}
                cursor="pointer"
                maxW="sm"
                overflow="hidden"
                key={item.id}
                backgroundColor={
                  favItems.includes(item.id) ? "pink" : "#f6f6f6"
                }
                borderRadius="10px"
                border="5px solid #f6f6f6"
                className="shadow-xl shadow-blue-500/50"
                _hover={{ margin: "-20px 0 0 -20px" }}
                transition="0.3s"
              >
                <Link to={`/${item.href}${item.id}/${item.category}`}>
                  <Image
                    width={"100%"}
                    height={"300px"}
                    src={item.productImg}
                    alt="error"
                    backgroundColor="#f6f6f6"
                  />
                </Link>
                <Card.Body gap="2">
                  <Card.Title fontSize={{ base: 17, sm: 18, lg: 20, xl: 20 }}>
                    {item.productName}
                  </Card.Title>
                  <Card.Description
                    fontSize={{ base: 14, sm: 15, lg: 15, xl: 16 }}
                  >
                    {item.productDescription}
                  </Card.Description>
                  <Text
                    textStyle="2xl"
                    fontWeight="medium"
                    letterSpacing="tight"
                    mt="2"
                  >
                    {item.productPrice}
                  </Text>
                </Card.Body>
                <Card.Footer gap="2">
                  <PurchaseProcess item={item} />
                  <Box textAlign="end" width="100%">
                    <IconButton
                      alignItems="center"
                      bg="inherit"
                      _hover={{ bg: "#f2e7fe" }}
                      onClick={() => {
                        if (!favItems.includes(item.id)) {
                          addProductToFavList(item);
                          setFavItems([...favItems, item.id]);
                        } else {
                          deleteProductFromFav(item.id);
                          const newFavItem = favItems.filter(
                            (i) => i != item.id
                          );
                          setFavItems(newFavItem);
                        }
                        toaster.create({
                          title: `One  Product ${
                            favItems.includes(item.id)
                              ? "deleted from"
                              : "added to"
                          }  your Favourite successfully!`,
                          type: "success",
                          duration: 5000,
                        });
                      }}
                    >
                      <FaHeart size={24} color="#7008e7" />
                    </IconButton>
                  </Box>
                </Card.Footer>
              </Card.Root>
            )
        )}
      </SimpleGrid>
    </>
  );
};

export default RelatedProducts;
