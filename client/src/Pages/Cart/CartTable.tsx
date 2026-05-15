import { toaster } from "@/components/ui/toaster";
import { Box, Card, GridItem, IconButton, Image, Input, Table, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import ColumnsHeader from "./Data/CartData";
import useCartStore from "./cartStore";
import { useState } from "react";

const CartTable = () => {
  const [quantityErrors, setQuantityErrors] = useState<{
    [key: string]: boolean;
  }>({});
      const { deleteProductFromCart, cartItems, setCurrentChoseQuantity } = useCartStore();
  return (
    <>
                <GridItem>
              <Card.Root borderRadius="lg" overflow="hidden">
                <Box>
                  <Table.Root w="100%" tableLayout="fixed">
                    <Table.Header>
                      <Table.Row>
                        {ColumnsHeader.map((item) => (
                          <Table.ColumnHeader
                            textAlign={"center"}
                            key={item.label}
                            color="#7008e7"
                            fontSize={{
                              base: "7px",
                              sm: "12px",
                              md: "15px",
                              lg: "19px",
                            }}
                            whiteSpace="nowrap"
                          >
                            {item.label}
                          </Table.ColumnHeader>
                        ))}
                        <Table.ColumnHeader
                          textAlign="start"
                          whiteSpace="nowrap"
                        ></Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {cartItems.map((product) => (
                        <Table.Row key={product.product.id}>
                          <Table.Cell whiteSpace="nowrap" textAlign={"center"}>
                            <Link
                              to={`/${product.product.href}${product.product.id}/${product.product.category}`}
                            >
                              <Image
                                width={{ base: 8, md: 10 }}
                                src={product?.product.productImg}
                              />
                            </Link>
                          </Table.Cell>

                          <Table.Cell whiteSpace="nowrap" textAlign={"start"}>
                            <Text
                              fontSize={{
                                base: "5px",
                                sm: "12px",
                                md: "9px",
                                lg: "13px",
                              }}
                            >
                              {product.product.productName}
                            </Text>
                          </Table.Cell>

                          <Table.Cell
                            textAlign={"center"}
                            whiteSpace="nowrap"
                            fontSize={{
                              base: "7px",
                              sm: "12px",
                              md: "16px",
                              lg: "20px",
                            }}
                          >
                            {product.product.productPrice}
                          </Table.Cell>

                          <Table.Cell
                            textAlign={"center"}
                            whiteSpace="nowrap"
                            fontSize={{
                              base: "7px",
                              sm: "12px",
                              md: "16px",
                              lg: "20px",
                            }}
                          >
                            {product.currentShoseSize}
                          </Table.Cell>

                          <Table.Cell textAlign={"start"} whiteSpace="nowrap">
                            {quantityErrors[product.currentShoeseID] && (
                              <Text color="red" fontSize="10px" mb={1}>
                                There is not enough quantity
                              </Text>
                            )}
                            <Input
                              maxWidth={"100%"}
                              marginLeft={{ base: -2.5 }}
                              type="number"
                              value={product.currentShoseQuantity}
                              borderRadius="full"
                              min={1}
                              max={
                                product.product.sizesAndQuantities.find(
                                  (q) => q.Size == product.currentShoseSize
                                )?.quantity
                              }
                              fontSize={{
                                base: "7px",
                                sm: "12px",
                                md: "16px",
                                lg: "18px",
                              }}
                              onChange={(e) => {
                                const maxQuantity =
                                  product.product.sizesAndQuantities.find(
                                    (q) => q.Size == product.currentShoseSize
                                  )?.quantity || 0;

                                const newQuantity = parseInt(e.target.value);

                                setCurrentChoseQuantity(
                                  product.currentShoeseID,
                                  newQuantity
                                );

                                if (newQuantity > maxQuantity) {
                                  setQuantityErrors((prev) => ({
                                    ...prev,
                                    [product.currentShoeseID]: true,
                                  }));
                                } else {
                                  setQuantityErrors((prev) => ({
                                    ...prev,
                                    [product.currentShoeseID]: false,
                                  }));
                                }
                              }}
                            />
                          </Table.Cell>

                          <Table.Cell
                            whiteSpace="nowrap"
                            textAlign="center"
                            fontSize={{
                              base: "7px",
                              sm: "12px",
                              md: "16px",
                              lg: "20px",
                            }}
                          >
                            {product.currentShoseQuantity *
                              parseFloat(product.product.productPrice)}{" "}
                            $
                          </Table.Cell>

                          <Table.Cell whiteSpace="nowrap" textAlign="start">
                            <IconButton
                              aria-label="Remove item"
                              variant="ghost"
                            >
                              <Text
                                _hover={{
                                  bg: "red",
                                  color: "white",
                                  border: "none",
                                }}
                                transition="0.3s"
                                px={2}
                                marginLeft={{ base: -4 }}
                                border="1px solid #333"
                                fontSize={{
                                  base: "7px",
                                  sm: "12px",
                                  md: "16px",
                                  lg: "18px",
                                }}
                                onClick={() => {
                                  deleteProductFromCart(
                                    product.product.id +
                                      "-" +
                                      product.currentShoseSize
                                  );
                                  toaster.create({
                                    title:
                                      "Product Deleted From your cart successfully!",
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
                </Box>
              </Card.Root>
            </GridItem>
    </>
  )
}

export default CartTable
