import { Box, HStack } from "@chakra-ui/react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import FooterTitle from "./FooterTitle";

const FollwUs = () => {
  return (
    <Box marginBottom={{ base: 6, sm: 6, lg: 0 }}>
      <FooterTitle head="Follow Us" />
      <HStack maxWidth={'250px'} justifyContent={'space-between'}>
        <FaFacebookF />
        <FaTwitter />
        <FaInstagram />
        <FaLinkedinIn />
      </HStack>
    </Box>
  );
};

export default FollwUs;
