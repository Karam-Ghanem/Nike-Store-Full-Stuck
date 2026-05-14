import { Box, Text, VStack } from "@chakra-ui/react";
import MainHead from "../PublicCompontents/MainHead";
import View360 from "./View360";

const About = () => {
  return (
    <>
      <MainHead head="WEB ABOUT" />
      <VStack>
        <View360/>
        <Box
        width={{lg:'50%'}}
          padding={4}
          boxShadow={"0 0 12px #c72092"}
          border={"1px solid #701ad1"}
          borderRadius={10}
          textAlign="center"
        >
          <Text
          
            textAlign="start"
            lineHeight="1.6"
            fontSize={{
              base: "12px",
              sm: "14px",
              md: "15px",
              lg: "15px",
              xl: "16px",
            }}
          >
            Welcome to Nike Store, your premier destination for authentic Nike
            footwear in Lattakia, Syria. Established in 2024, we are committed
            to bringing you the latest and most stylish Nike sneakers for men
            and women, all 100% genuine and backed by quality assurance. At Nike
            Store, we pride ourselves on fast and reliable service, offering
            24-hour shipping within Syria and international delivery within one
            week. Whether you're looking for performance running shoes, trendy
            lifestyle sneakers, or durable training footwear, we’ve got you
            covered. Our mission is to provide an exceptional shopping
            experience with top-tier customer support. Thank you for choosing
            Nike Store—step into style and comfort with us!
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default About;
