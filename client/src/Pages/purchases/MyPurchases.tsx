import MainHead from "@/components/PublicCompontents/MainHead";
import {
  Box,
  Flex,
  Text,
  Card,
  Table,
  IconButton,
  Image,
  Button,
  Popover,
  Portal,
  HStack,
} from "@chakra-ui/react";
import { MdInfoOutline } from "react-icons/md";
import MainDialog from "@/Admin/components/MainDialog";
import useMyPurchase from "./Hook/useMyPrchase";

const MyPurchases = () => {
  const {
    myPurchases,
    purchaseDate,
    returnPeriod,
    returnProduct,
    allowed,
    setAllowed,
  } = useMyPurchase();

  if (myPurchases.length < 1) {
    return (
      <Box minHeight={{ base: "auto", sm: "300px" }}>
        <MainHead head="No Products To Show" />
      </Box>
    );
  }

  return (
    <>
      <MainHead head="MY PURCHASES" />

      <Box maxW="1100px" mx="auto" p={{ base: 2, md: 6 }}>
        <Flex direction="column" gap={6}>
          <Card.Root borderRadius="lg" overflow="hidden" p={2}>
            <Table.Root w="100%">
              <Table.Header bg="#f6f6f6">
                <Table.Row>
                  <Table.ColumnHeader
                    color="#7008e7"
                    textAlign="center"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Image
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    color="#7008e7"
                    textAlign="center"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Product
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    color="#7008e7"
                    textAlign="center"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Price
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    color="#7008e7"
                    textAlign="center"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Date
                  </Table.ColumnHeader>

                  <Table.ColumnHeader
                    color="#7008e7"
                    textAlign="center"
                    fontSize={{
                      base: "7px",
                      sm: "12px",
                      md: "15px",
                      lg: "25px",
                    }}
                  >
                    Return
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {myPurchases.map((product) => (
                  <Table.Row key={product.product.id}>
                    {/* IMAGE */}
                    <Table.Cell textAlign="center">
                      <Popover.Root>
                        <Popover.Trigger asChild>

                          <Image
                            width={{
                              base: "50px",
                              sm: "80px",
                              md: "100px",
                              lg: "100px",
                            }}
                            src={product.product.productImg}
                          />
                        </Popover.Trigger>

                        <Portal>
                          <Popover.Positioner>
                            <Popover.Content>
                              <Popover.Arrow />
                              <Popover.Body>
                                <Image
                                  width="100%"
                                  src={product.product.productImg}
                                />
                              </Popover.Body>
                            </Popover.Content>
                          </Popover.Positioner>
                        </Portal>
                      </Popover.Root>
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
                        {product.product.productName}
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
                        {product.product.productPrice}
                      </Text>
                    </Table.Cell>

                    {/* DATE */}
                    <Table.Cell textAlign="center">
                      <Text
                        fontSize={{
                          base: "7px",
                          sm: "12px",
                          md: "16px",
                          lg: "20px",
                        }}
                      >
                        {`${purchaseDate.getDate()}-${
                          purchaseDate.getMonth() + 1
                        }-${purchaseDate.getFullYear()}`}
                      </Text>
                    </Table.Cell>

                    {/* RETURN */}
                    <Table.Cell textAlign="center">
                      <IconButton
                        aria-label="Return item"
                        variant="ghost"
                        size="sm"
                        minW={{ base: "26px", md: "30px" }}
                        h={{ base: "26px", md: "30px" }}
                        p={0}
                      >
                        {(new Date().getTime() - purchaseDate.getTime()) /
                          1000 >
                        returnPeriod ? (
                          allowed && (
                            <Text
                              color="red"
                              fontSize={{
                                base: "1px",
                                sm: "12px",
                                md: "16px",
                                lg: "20px",
                              }}
                            >
                              {`Sorry You Can Not Replace After ${returnPeriod} Seconds`}
                            </Text>
                          )
                        ) : (
                          <MainDialog
                            id={product.product.id}
                            parameter={product.currentShoeseID}
                            completeTheProcess={(pro) => returnProduct(pro)}
                            theProces="Return"
                          >
                            <Button
                              disabled={
                                (new Date().getTime() -
                                  purchaseDate.getTime()) /
                                  1000 >
                                returnPeriod
                              }
                              width={{
                                base: "8px",
                                sm: "60px",
                                md: "80px",
                                lg: "100px",
                              }}
                              fontSize={{
                                base: "7px",
                                sm: "12px",
                                md: "16px",
                                lg: "20px",
                              }}
                              bg="#7008e7"
                              _hover={{
                                backgroundColor: "#E53935",
                                color: "#333",
                              }}
                            >
                              Return
                            </Button>
                          </MainDialog>
                        )}

                        {(new Date().getTime() - purchaseDate.getTime()) /
                          1000 >
                          returnPeriod && (
                          <Text
                            pointerEvents={{ base: "none", md: "auto" }}
                            onClick={() => setAllowed(!allowed)}
                          >
                            <MdInfoOutline size={22} color="red" />
                          </Text>
                        )}
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Root>
        </Flex>

        {(new Date().getTime() - purchaseDate.getTime()) / 1000 >
          returnPeriod && (
          <HStack
            display={{ base: "flex", md: "none" }}
            marginTop={4}
            color={"red"}
            fontSize={10}
          >
            <MdInfoOutline /> :
            {`Sorry You Can Not Replace After ${returnPeriod} Seconds`}
          </HStack>
        )}
      </Box>
    </>
  );
};

export default MyPurchases;
