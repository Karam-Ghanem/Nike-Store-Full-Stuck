import { Box, IconButton, Stack } from "@chakra-ui/react";
import { FaHeart, FaShoppingCart, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useAuthStore from "@/auth/authStore";
import { toaster } from "@/components/ui/toaster";

import ColorModeToggle from "../ColorModeToggle";

const HeaderIcons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isFavoritesPage = location.pathname === "/favorites";
  const isCartPage = location.pathname === "/cart";

  const signOut = async () => {
    await logout();
    toaster.create({ title: "You have been logged out.", type: "success", duration: 3000 });
    navigate("/");
  };

  return (
    <Box className="hidden md:block" marginStart={{ md: -5 }}>
      <Stack direction="row" scale={{ md: 0.6, lg: 0.8, xl: 1 }}>
        <Link to="/favorites">
          <IconButton
            aria-label="Favorites"
            bg={isFavoritesPage ? "#7008e7 " : "inherit"}
            _hover={isFavoritesPage ? { bg: "" } : { bg: "#f9f9fb" }}
          >
            <FaHeart color={isFavoritesPage ? "white" : "#7008e7"} />
          </IconButton>
        </Link>
        <Link to="/cart">
          <IconButton
            aria-label="Cart"
            bg={isCartPage ? "#7008e7 " : "inherit"}
            _hover={isCartPage ? { bg: "" } : { bg: "#f9f9fb" }}
          >
            <FaShoppingCart color={isCartPage ? "white" : "#7008e7"} />
          </IconButton>
        </Link>
        {user ? (
          <IconButton
            aria-label={`Log out ${user.username}`}
            title={`Log out ${user.username}`}
            bg="inherit"
            _hover={{ bg: "#f9f9fb" }}
            onClick={signOut}
          >
            <FaSignOutAlt color="#7008e7" />
          </IconButton>
        ) : (
          <Link to="/auth">
            <IconButton aria-label="Log in or create account" bg="inherit" _hover={{ bg: "#f9f9fb" }}>
              <FaUser color="#7008e7" />
            </IconButton>
          </Link>
        )}
        <ColorModeToggle />
      </Stack>
    </Box>
  );
};

export default HeaderIcons;
