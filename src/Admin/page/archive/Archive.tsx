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
import useProductStore from "@/components/Products/ProductStore";
import MainDialog from "@/Admin/components/MainDialog";

const Archive = () => {
  const { archivedProducts, removeFromArchive } = useProductStore();

  if (archivedProducts.length < 1) {
    return (
      <Box minHeight={{ base: "auto", sm: "300px" }}>
        <MainHead head="No Products To Show" />
      </Box>
    );
  }

  return (
    <>
      <MainHead head="Archive" />

      <Box mx="auto" p={{ base: 1, sm: 2, md: 4 }}>
        <Flex direction="column" gap={4}>
          <Card.Root borderRadius="lg" overflow="hidden" p={1}>
            <Table.Root w="100%">
              {/* HEADER */}
              <Table.Header bg="#f6f6f6">
                <Table.Row>
                  {[
                    "Product Image",
                    "Product",
                    "Price",
                    "Archive Date",
                    "More Information",
                    "UnArchive",
                  ].map((title) => (
                    <Table.ColumnHeader
                      key={title}
                      color="#7008e7"
                      textAlign="center"
                      fontSize={{
                        base: "7px",
                        sm: "10px",
                        md: "14px",
                        lg: "20px",
                      }}
                      p={{ base: 1, sm: 2 }}
                    >
                      {title}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>

              {/* BODY */}
              <Table.Body>
                {archivedProducts.map((product) => (
                  <Table.Row key={product.product.id}>
                    {/* IMAGE */}
                    <Table.Cell textAlign="center" p={{ base: 1, sm: 2 }}>
                      <Link
                        to={`/${product.product.href}${product.product.id}/${product.product.category}`}
                      >
                        <Image
                          width={{ base: 6, sm: 8, md: 10 }}
                          src={product.product.productImg}
                        />
                      </Link>
                    </Table.Cell>

                    {/* NAME */}
                    <Table.Cell textAlign="center" p={{ base: 1, sm: 2 }}>
                      <Text
                        fontSize={{
                          base: "7px",
                          sm: "10px",
                          md: "14px",
                          lg: "18px",
                        }}
                      >
                        {product.product.productName}
                      </Text>
                    </Table.Cell>

                    {/* PRICE */}
                    <Table.Cell textAlign="center" p={{ base: 1, sm: 2 }}>
                      <Text
                        fontSize={{
                          base: "7px",
                          sm: "10px",
                          md: "14px",
                          lg: "18px",
                        }}
                      >
                        {product.product.productPrice}
                      </Text>
                    </Table.Cell>

                    {/* ARCHIVE DATE */}
                    <Table.Cell textAlign="center" p={{ base: 1, sm: 2 }}>
                      <Text
                        fontSize={{
                          base: "7px",
                          sm: "10px",
                          md: "14px",
                          lg: "18px",
                        }}
                      >
                        {product.date.getDate() +
                          "/" +
                          (product.date.getMonth() + 1) +
                          "/" +
                          product.date.getFullYear()}
                      </Text>
                    </Table.Cell>

                    {/* MORE */}
                    <Table.Cell textAlign="center" p={{ base: 1, sm: 2 }}>
                      <Flex
                        color="#a800b7"
                        justifyContent="center"
                        fontSize={{
                          base: "7px",
                          sm: "10px",
                          md: "14px",
                          lg: "18px",
                        }}
                      >
                        <Link
                          to={`${product.product.id}/${product.product.category}`}
                        >
                          More
                        </Link>
                      </Flex>
                    </Table.Cell>

                    {/* REMOVE */}
                    <Table.Cell textAlign="center" p={{ base: 1, sm: 2 }}>
                      <IconButton
                        aria-label="Remove item"
                        variant="ghost"
                        size="sm"
                        minW={{ base: "20px", sm: "24px", md: "28px" }}
                        h={{ base: "20px", sm: "24px", md: "28px" }}
                        p={0}
                      >
                        <MainDialog
                          id={product.product.id}
                          completeTheProcess={(id) => removeFromArchive(id)}
                          parameter={product.product.id}
                          theProces="Remove From Archive"
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
                              base: "8px",
                              sm: "10px",
                              md: "14px",
                              lg: "18px",
                            }}
                          >
                            X
                          </Text>
                        </MainDialog>
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

export default Archive;
