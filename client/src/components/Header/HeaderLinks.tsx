import Links from "./links";
import { Container, Stack } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const HeaderLinks = () => {
  return (
    <Box className="hidden md:block">
      <Container>
        <Stack
          direction="row"
          justifyContent={{ sm: "start", md: "start", lg: "space-between" }}
        >
          {Links.map((link) => (
            <Link to={link.href} key={link.id}>
              <Text
              
                color="#a21caf"
                marginEnd={{md:'1', lg: "4" }}
                fontSize={{ md: "9px", lg: "14px",xl:"21px" }}
                _hover={{
                  color: "#4d06a3",
                  marginTop: "-8px",
                  cursor: "pointer",
                }}
                transition="0.5s"
              >
                {link.label}
              </Text>
            </Link>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default HeaderLinks;
