import MainHead from "@/components/PublicCompontents/MainHead";
import {
  Box,
  Flex,
  Text,
  Card,
  Table,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFavoriteStore from "./FavoritesStore";
import { Toaster, toaster } from "@/components/ui/toaster";
import PurchaseProcess from "@/components/Products/PurchaseProcess";

const Favorites = () => {
  const { deleteProductFromFav, favoritesItems } = useFavoriteStore();

  if (favoritesItems.length < 1) {
    return (
      <Box minHeight={{ base: "auto", sm: "300px" }}>
        <MainHead head="No Products To Show" />;
      </Box>
    );

  }

  return (
    <>
      <Toaster />
      <MainHead head="Favorites" />

      <Box mx="auto" p={{ base: 2, md: 6 }}>
        <Flex direction="column" gap={6}>
          <Card.Root borderRadius="lg" overflow="hidden" p={2}>
            <Table.Root w="100%">
              <Table.Header bg="#f6f6f6">
                <Table.Row>
                  <Table.ColumnHeader
                    color="#7008e7"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                    textAlign="center"
                  >
                    Image
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    color="#7008e7"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                    textAlign="center"
                  >
                    Product
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    color="#7008e7"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                    textAlign="center"
                  >
                    Price
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    textAlign="center"
                    color="#7008e7"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Add to Cart
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    textAlign="center"
                    color="#7008e7"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Remove
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {favoritesItems.map((product) => (
                  <Table.Row key={product.id}>
                    {/* IMAGE */}
                    <Table.Cell  whiteSpace="nowrap" textAlign={"center"}>
                      <Link
                        to={`/${product.href}${product.id}/${product.category}`}
                      >
                        <Image
                          width={{ base: 8, md: 10 }}
                          src={product?.productImg}
                        />
                      </Link>
                    </Table.Cell>

                    {/* NAME */}
                    <Table.Cell textAlign="center">
                      <Text
                        fontSize={{
                          base: "7px",
                          sm: "12px",
                          md: "16px",
                          lg: "20px",
                        }}
                      >
                        {product.productName}
                      </Text>
                    </Table.Cell>

                    {/* PRICE */}
                    <Table.Cell textAlign="center">
                      <Text
                        fontSize={{
                          base: "7px",
                          sm: "12px",
                          md: "16px",
                          lg: "20px",
                        }}
                      >
                        {product.productPrice} 
                      </Text>
                    </Table.Cell>

                    {/* ADD TO CART */}
                    <Table.Cell textAlign="center">
                      <PurchaseProcess item={product} />
                    </Table.Cell>

                    {/* REMOVE */}
                    <Table.Cell textAlign="center">
                      <IconButton
                        aria-label="Remove item"
                        variant="ghost"
                        size="sm"
                        minW={{ base: "26px", md: "30px" }}
                        h={{ base: "26px", md: "30px" }}
                        p={0}
                      >
                        <Text
                          _hover={{
                            bg: "red",
                            color: "white",
                            border: "none",
                          }}
                          transition="0.3s"
                          w="100%"
                          h="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          border="1px solid #333"
                          borderRadius="md"
                          fontSize={{
                            base: "10px",
                            sm: "12px",
                            md: "16px",
                            lg: "20px",
                          }}
                          onClick={() => {
                            deleteProductFromFav(product.id);
                            toaster.create({
                              title:
                                "Item Deleted From your Favorites successfully!",
                              type: "success",
                              duration: 5000,
                            });
                          }}
                        >
                          X
                        </Text>
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Flex>
      </Box>
    </>
  );
};

export default Favorites;
