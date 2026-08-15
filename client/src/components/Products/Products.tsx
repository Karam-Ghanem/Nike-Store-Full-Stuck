import { Box, Container, Flex, HStack, IconButton, Spinner, Text } from "@chakra-ui/react";
import MainTitle from "../PublicCompontents/MainTitle";
import { SimpleGrid } from "@chakra-ui/react";
import { Card, Image } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toaster } from "@/components/ui/toaster";
import ProductControls from "./ProductControls";
import useProduct from "@/components/Products/Hooks/useProduct";
import PurchaseProcess from "./PurchaseProcess";
import useProductPagentaion from "./Hooks/useProductsPagentation";
import EditAndArchiveAdmin from "./EditAndArchiveAdmin";
import ShowAllProductsButton from "./ShowAllProductsButton";
import PagenantionButtons from "./PagenantionButtons";
import SoldDesign from "./SoldDesign";
import { useEffect } from "react";
import useProductStore from "./ProductStore";
import useAuthStore from "@/auth/authStore";
interface Props {
  homePage: boolean;
  edit_delete:boolean;
}
const Products = ({ homePage,edit_delete }: Props) => {
  const loadProducts = useProductStore((state) => state.loadProducts);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);



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

  const toggleFavorite = async (item: typeof products[number]) => {
    if (!user) {
      toaster.create({ title: "Please log in before saving favorites.", type: "info", duration: 3500 });
      navigate('/auth');
      return;
    }
    try {
      if (!favItems.includes(item.id)) {
        await addProductToFavList(item);
        setFavItems([...favItems, item.id]);
      } else {
        await deleteProductFromFav(item.id);
        setFavItems(favItems.filter((id) => id !== item.id));
      }
      toaster.create({
        title: `Item ${favItems.includes(item.id) ? "deleted from" : "added to"} your Favourite successfully!`,
        type: "success",
        duration: 5000,
      });
    } catch (error) {
      toaster.create({
        title: error instanceof Error ? error.message : "Unable to update your favorites.",
        type: "error",
        duration: 4500,
      });
    }
  };

  return (
    <>
      <MainTitle title="PRODUCTS" />

      {!homePage && (
        <ProductControls isAnimating={(animate) => setIsAnimating(animate)} />
      )}

      <Container>
        {products.length < 1 && <MainTitle title="No Products To Show" />}

        {isAnimating ? (
          <Flex justifyContent={"center"} marginTop={100}>
            <Spinner color={"#7008e7"} width={"100px"} height={"100px"} />
          </Flex>
        ) : (
          <Box>
              {homePage && (
                <ShowAllProductsButton/>
              )}

            {actualProductList.length >= 1 && !homePage && (

              <PagenantionButtons needed={needed} currentPage={currentPage} setCurrentPage={(cp)=>setCurrentPage(cp)}/>
            )}

            <SimpleGrid
              columns={{ base: 1, sm: 1, md: 3, lg: 3, xl: 4 }}
              gap="10px"
            >
              {actualProductList.map((item) => (
                <Card.Root
                
                  display={item.isArchived ? "none" : "block"}

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
                  _hover={{ margin: "-0.5px 0 0 -0.5px" }}
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
                      <HStack>
                        {item.productName}
                        <SoldDesign item={item}/>

                      </HStack>
                    </Card.Title>
                    
                    <Card.Description
                      fontSize={{ base: 14, sm: 15, lg: 15, xl: 16 }}
                    >
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
                          mt={{ base: 0, sm: 0 }}
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
                          onClick={() => void toggleFavorite(item)}
                        />
                      </IconButton>
                    </Box>
                  </Card.Footer>
                  
                  {edit_delete && 
                    <EditAndArchiveAdmin item={item}/>
                  }
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
