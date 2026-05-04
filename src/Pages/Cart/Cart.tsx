import MainHead from "@/components/PublicCompontents/MainHead";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Text,
  Button,
  Input,
  Heading,
  VStack,
  Separator,
  Card,
  Table,
  IconButton,
  Image,
} from "@chakra-ui/react";
import useCartStore from "@/Pages/Cart/cartStore";
import { Link } from "react-router-dom";
import { Toaster, toaster } from "@/components/ui/toaster";
import ColumnsHeader from "./Data/CartData";
import { useState } from "react";

const Cart = () => {
  const { deleteProductFromCart, cartItems, setCurrentChoseQuantity } =
    useCartStore();
  const [quantityErrors, setQuantityErrors] = useState<{
    [key: string]: boolean;
  }>({});

  if (cartItems.length < 1) {
    return (
      <Box minHeight={{base:'auto',sm:'300px'}}>
        <MainHead head="No Products To Show" />
      </Box>
    );
  }

  return (
    <>
      <Toaster />
        <MainHead head="Cart" />
      <Box px={{ base: 0, md: 0 }}>
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

            {/* RIGHT SIDE — TOTALS + COUPON */}
            <GridItem>
              <VStack align="stretch" gap={6}>
                {/* TOTALS CARD */}
                <Card.Root
                  border="1px solid #e2e2e2"
                  p={{ base: 4, md: 5 }}
                  bg="#fafafa"
                >
                  <Heading
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "19px",
                    }}
                    mb={4}
                  >
                    Cart Totals
                  </Heading>

                  <VStack align="stretch" gap={3}>
                    <Flex justify="space-between">
                      <Text
                        color="gray.600"
                        fontSize={{
                          base: "7px",
                          sm: "12px",
                          md: "16px",
                          lg: "20px",
                        }}
                      >
                        Subtotal
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {cartItems.reduce(
                          (acc, item) =>
                            acc +
                            item.currentShoseQuantity *
                              parseFloat(item.product.productPrice),
                          0
                        )}{" "}
                        $
                      </Text>
                    </Flex>

                    <Flex justify="space-between">
                      <Text
                        color="gray.600"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        others
                      </Text>
                      <Text
                        fontWeight="semibold"
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        0 $
                      </Text>
                    </Flex>

                    <Separator />

                    <Flex justify="space-between">
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        Total
                      </Text>
                      <Text
                        fontWeight="bold"
                        color="#7008e7"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {cartItems.reduce(
                          (acc, item) =>
                            acc +
                            item.currentShoseQuantity *
                              parseFloat(item.product.productPrice),
                          0
                        )}{" "}
                        $
                      </Text>
                    </Flex>
                  </VStack>

                  <Button
                    mt={6}
                    w="100%"
                    bg="#ba1e9a"
                    color="white"
                    borderRadius="full"
                    _hover={{ bg: "#7008e7" }}
                    fontSize={{ base: 13, sm: 14, md: 14, lg: 15 }}
                  >
                    <Link to={"/checkout"}>Check Out</Link>
                  </Button>
                </Card.Root>

                {/* COUPON CARD */}
                <Card.Root
                  border="1px solid #e2e2e2"
                  p={{ base: 4, md: 5 }}
                  bg="#fafafa"
                >
                  <Heading
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "16px",
                      lg: "20px",
                    }}
                    mb={3}
                  >
                    Apply Coupon
                  </Heading>
                  <Text
                    fontSize={{ base: 8, sm: 10, md: 12, lg: 15 }}
                    color="gray.500"
                    mb={3}
                  >
                    Enter your coupon code if you have one.
                  </Text>
                  <VStack gap={3}>
                    <Input
                      placeholder="Coupon"
                      bg="white"
                      size="sm"
                      borderRadius="full"
                    />
                    <Button
                      bg="#ba1e9a"
                      color="white"
                      borderRadius="full"
                      px={6}
                      fontSize={{ base: 13, sm: 14, md: 14, lg: 15 }}
                      _hover={{ bg: "#7008e7" }}
                    >
                      APPLY
                    </Button>
                  </VStack>
                </Card.Root>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
