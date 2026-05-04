import { SimpleGrid, Box, Heading, Image, HStack, Container } from "@chakra-ui/react";
import backGroundImage from "@/assets/bg1.png";
import ShoeseIMG from "@/assets/shoese/shoes.png";
import Products from "../Products/Products";
import About from "../About/About";
import TextReview from "../../Pages/Review/TextReview";
import Services from "@/Pages/Services/Services";
import WelcomeBack from "../WelcomeBack/WelcomeBack";
import MainHead from "../PublicCompontents/MainHead";

const Landing = () => {

  return (
    <Container>
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 2, lg: 2 }}
        gap="10px"
        marginTop={50}
      >
        <Box >
          <Heading
            size={{ lg: "4xl", xl: "5xl" }}
            display={{ base: "none", sm: "none", md: "none", lg: "block" }}
          >
            NIKE
            <br />
            Collection
          </Heading>
          <HStack justifyContent="center" >
            <Heading
              size="4xl"
              backgroundColor=""
              display={{ sm: "block", md: "block", lg: "none" }}
            >
              NIKE Collection
            </Heading>
          </HStack>
          <Box
            padding={{base:2,sm:2,md:5,lg:6}}
            lineHeight={{ sm: 1.6, md: 2 }}
            bgImage={{
              md: `url(${backGroundImage})`,
              base: `url(${backGroundImage})`,
              lg: "none",
            }}
            bgSize="cover"
            bgRepeat="no-repeat"
            width="100%"
            fontSize={{
              base: "15px",
              sm: "16px",
              md: "15px",
              lg: "16px",
              xl: "17px",
            }}
            className="shadow-xl/30"
          >
            Discover the latest Nike Collection now available in our store!
            Whether you're looking for high-performance sneakers, we have
            everything you need to elevate your sporty style . Stand out with
            Nike’s modern designs and premium quality that deliver comfort and
            sophistication with every step. Shop now and enjoy an unmatched
            shopping experience with exclusive discounts and fast shipping!"
          </Box>
        </Box>
        <Box display={{ base: "none", md: "block" }}>
          <Image width="800px" src={backGroundImage} />
          <Image
            marginTop={{ md: "-40px", lg: "-270px" }}
            marginLeft="10px"
            width={{ md: "250px", lg: "280px", xl: "400px" }}
            src={ShoeseIMG}
          />
        </Box>
      </SimpleGrid>

      {/* Product Section */}
      <Products edit_delete={false} homePage={true} />
      {/* Web About */}
      <About />
      {/* Review */}
      <MainHead head="REVIEWS" />
      <TextReview />
      {/* Services */}
      <Services />
      {/* Welcome Back */}
      <WelcomeBack />
    </Container>
  );
};

export default Landing;
