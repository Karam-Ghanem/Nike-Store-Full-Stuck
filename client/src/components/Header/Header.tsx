import { Stack, Container } from "@chakra-ui/react";

import HeaderLogo from "./HeaderLogo";
import HeaderLinks from "./HeaderLinks";
import HeaderIcons from "./HeaderIcons";
import MobileLinks from "../MobileLinks";

const Header = () => {
  return (
    <Container marginBottom={"10px"}>
      <Stack
        bg={"white"}
        padding="15px 25px"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        className="shadow-lg  rounded-md"
      >
        {/* logo */}
        <HeaderLogo />

        {/* icons */}
        <HeaderIcons />

        {/* links on md lg */}
        <HeaderLinks />

        {/* Links on mobile */}
        <MobileLinks />
      </Stack>
    </Container>
  );
};

export default Header;
