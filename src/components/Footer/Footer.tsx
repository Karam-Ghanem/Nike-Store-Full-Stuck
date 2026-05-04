import {  Container, SimpleGrid } from "@chakra-ui/react";
import FooterContact from "./FooterContact";
import GetHelp from "./GetHelp";
import OurStores from "./OurStores";
import FollwUs from "./FollwUs";

const Footer = () => {
  return (
    
    <Container marginTop={40} className="mt-auto" >
      <SimpleGrid
        fontSize={{ base: 13, sm: 13,md:16, lg: 15, xl: 15 }}
        padding={10}
        paddingBottom={2}
        justifyContent={"space-between"}
        columns={{ base: 1, sm: 2,md:2, lg: 4, xl: 4 }}
        bg={"#f3f1f1"}
        gap={10}
      >
        {/* Footer Contact */}
        <FooterContact />
        {/* Get Help */}
        <GetHelp />
        {/* Our Stores */}
        <OurStores />
        {/* Follw Us */}
        <FollwUs />
      </SimpleGrid>
    </Container>
  );
};

export default Footer;
