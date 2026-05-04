import { Box, Button, Container, Flex, HStack, IconButton, Spinner, Text } from "@chakra-ui/react";
import MainHead from "../PublicCompontents/MainHead";
import { SimpleGrid } from "@chakra-ui/react";
import { Card, Image } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Toaster, toaster } from "@/components/ui/toaster";
import ProductControls from "./ProductControls";
import useProduct from "@/components/Products/Hooks/useProduct";
import PurchaseProcess from "./PurchaseProcess";
import useProductPagentaion from "./Hooks/useProductsPagentation";
import useProductStore from "./ProductStore";
import MainDialog from "@/Admin/components/MainDialog";
interface Props {
  homePage: boolean;
  edit_delete:boolean;
}
const Products = ({ homePage,edit_delete }: Props) => {

  const {
    actualProductList,
    currentPage,
    setCurrentPage,
    needed,
  } = useProductPagentaion();

  const {
    products,
    isAnimating,
    setIsAnimating,
    addProductToFavList,
    deleteProductFromFav,
    favItems,
    setFavItems,
  } = useProduct(false);

  const {archiveProduct} = useProductStore()





  return (
    <>
      <MainHead head="PRODUCTS" />

      {!homePage && (
        <ProductControls isAnimating={(animate) => setIsAnimating(animate)} />
      )}

      <Container>
        {products.length < 1 && <MainHead head="No Products To Show" />}

        {isAnimating ? (
          <Flex justifyContent={"center"} marginTop={100}>
            <Spinner color={"#7008e7"} width={"100px"} height={"100px"} />
          </Flex>
        ) : (
          <Box>
            <Box
              marginBottom="50px"
              textAlign={{ base: "center", md: "start" }}
            >
              {homePage && (
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
              )}
            </Box>

            {actualProductList.length >= 1 && !homePage && (
              <Flex justifyContent={"center"}>
                <Button
                  bg={"#7008e7"}
                  disabled={currentPage == 1}
                  _disabled={{ cursor: "menuitem" }}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                  }}
                >
                  Prev
                </Button>

                <Box margin={"10px 20px"}></Box>
                <Button
                  bg={"#7008e7"}
                  disabled={currentPage == needed}
                  _disabled={{ cursor: "menuitem" }}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                >
                  Next
                </Button>
              </Flex>
            )}

            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 3, lg: 3, xl: 4 }}
              gap="10px"
            >
              {actualProductList.map((item) => (
                <Card.Root
                  display={item.isArchived ? "none" : "block"}
                  // height={edit_delete ? 500 : ""}
                  marginTop={4}
                  cursor="pointer"
                  maxW="2xl"
                  overflow="hidden"
                  key={item.id}
                  backgroundColor={
                    favItems.includes(item.id) ? "pink" : "#f6f6f6"
                  }
                  borderRadius="10px"
                  border={`5px solid ${
                    favItems.includes(item.id) ? "pink" : "#f6f6f6"
                  }`}
                  className="shadow-xl shadow-blue-500/50"
                  _hover={{ margin: "-10px 0 0 -10px" }}
                  transition="0.3s"
                >
                  <Link to={`/${item.href}${item.id}/${item.category}`}>
                    <Image
                      padding={{ base: 0, sm: 1 }}
                      width={"100%"}
                      height={{ base: "150px", sm: "250px" }}
                      src={item.productImg}
                      alt="error"
                      backgroundColor="#f6f6f6"
                    />
                  </Link>
                  <Card.Body gap={{ base: 0, sm: 1 }} marginY={-4}>
                    <Card.Title fontSize={{ base: 17, sm: 18, lg: 20, xl: 20 }}>
                      {item.productName}
                    </Card.Title>
                    <Card.Description
                      fontSize={{ base: 14, sm: 15, lg: 15, xl: 16 }}
                    >
                      {/* <Text fontSize={10}>
                        {item.category}
                        {item.gender}
                      </Text> */}
                      {item.productDescription}
                    </Card.Description>

                    <HStack>
                      {item.isDiscounted ? (
                        <Text
                          marginRight={2}
                          as={"del"}
                          textStyle="2xl"
                          fontWeight="medium"
                          letterSpacing="tight"
                          mt={{ base: 1, sm: 4 }}
                        >
                          {item.oldProductPrice}
                        </Text>
                      ) : (
                        ""
                      )}
                      <Text
                        textStyle="2xl"
                        fontWeight="medium"
                        letterSpacing="tight"
                        marginY={{ base: 1, sm: 4 }}
                      >
                        {item.productPrice}
                      </Text>
                    </HStack>
                  </Card.Body>
                  <Card.Footer gap="0">
                    <PurchaseProcess item={item} />

                    <Box textAlign="end" width="100%">
                      <IconButton
                        alignItems="center"
                        bg="inherit"
                        _hover={{ bg: "#f2e7fe" }}
                      >
                        <Toaster />
                        <FaHeart
                          size={24}
                          color="#7008e7"
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
                              title: `Item ${
                                favItems.includes(item.id)
                                  ? "deleted from"
                                  : "added to"
                              }  your Favourite successfully!`,
                              type: "success",
                              duration: 5000,
                            });
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Card.Footer>
                  {edit_delete && (
                    <HStack
                      justifyContent={"space-between"}
                      width={"100%"}
                      padding={{ base: 2, sm: 2 }}
                      borderTop={"1px solid #6c14d0"}
                    >
                      <Button
                        bg={"blue"}
                        fontSize={{ base: 6, sm: 10, md: 12, lg: 15 }}
                        width={{
                          base: "20px",
                          sm: "60px",
                          md: "80px",
                          lg: "100px",
                        }}
                      >
                        <Link to={`/admin/editproduct/${item.id}`}>Edit</Link>
                      </Button>

                      <MainDialog
                        id={item.id}
                        parameter={item}
                        completeTheProcess={(item) => archiveProduct(item)}
                        theProces="Archive"
                      >
                        <Button
                          fontSize={{ base: 6, sm: 10, md: 12, lg: 15 }}
                          width={{
                            base: "20px",
                            sm: "60px",
                            md: "80px",
                            lg: "100px",
                          }}
                          bg={"red"}
                        >
                          Archive
                        </Button>
                      </MainDialog>
                    </HStack>
                  )}
                </Card.Root>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Container>
    </>
  );
};

export default Products;
