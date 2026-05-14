import { IconButton } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { Box, Stack } from "@chakra-ui/react";
import ColorModeToggle from "../ColorModeToggle";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const HeaderIcons = () => {
  const location = useLocation();
  const isFavoritesPage = location.pathname === "/favorites";
  const isCartPage = location.pathname === "/cart";
  return (
    <Box className="hidden md:block" marginStart={{md:-5}}>
      <Stack direction="row" scale={{md:0.6,lg:0.8,xl:1}}>
        <Link to="/favorites">
          <IconButton
            bg={isFavoritesPage ? "#7008e7 " : "inherit"}
            _hover={isFavoritesPage ? { bg: "" } : { bg: "#f9f9fb" }}
          >
            <FaHeart color={isFavoritesPage ? "white" : "#7008e7"} />
          </IconButton>
        </Link>

        <Link to="/cart">
          <IconButton
            bg={isCartPage ? "#7008e7 " : "inherit"}
            _hover={isCartPage ? { bg: "" } : { bg: "#f9f9fb" }}
          >
            <FaShoppingCart color={isCartPage ? "white" : "#7008e7"} />
          </IconButton>
        </Link>

        <IconButton bg="inherit" _hover={{ bg: "#f9f9fb" }}>
          <FaUser color="#7008e7" />
        </IconButton>
        <ColorModeToggle />
      </Stack>
    </Box>
  );
};

export default HeaderIcons;
