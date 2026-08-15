import { Box } from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { Button, Menu, Portal, Text } from "@chakra-ui/react";
import Links from "./Header/links";
import { Link, useNavigate } from "react-router-dom";
import ColorModeToggle from "./ColorModeToggle";
import useAuthStore from "@/auth/authStore";



const MobileLinks = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <Box className="md:hidden">
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="sm">
              <FaBars color="#a800b7" />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner
              width={{ base: "100px", sm: "300px" }}
              maxWidth="100%"
            >
              <Menu.Content marginLeft="-150px" marginTop="20px">
                {Links.map((link) => (
                  <Box
                    key={link.id}
                    borderBottom="1px solid #fcfc "
                    width="100%"
                  >
                    <Menu.Item
                      fontSize={10}
                      value="new-txt"
                      color="#c571cd"
                      bg="transparent"
                      fontWeight={600}
                      _hover={{
                        color: "#4d06a3",
                        cursor: "pointer",
                        marginLeft: "30px",
                      }}
                      transition="0.5s"
                    >
                      <Link to={link.href}>
                        <Text padding={3}>{link.label}</Text>
                      </Link>
                    </Menu.Item>
                  </Box>
                ))}
                <Menu.Item
                  borderBottom="1px solid #fcfc "
                  fontSize={10}
                  value="new-txt"
                  color="#c571cd"
                  bg="transparent"
                  fontWeight={600}
                  _hover={{
                    color: "#4d06a3",
                    cursor: "pointer",
                    marginLeft: "30px",
                  }}
                  transition="0.5s"
                >
                  <Link to={"/favorites"}>
                    <Text padding={3}>Favorites</Text>
                  </Link>
                </Menu.Item>

                <Menu.Item
                  borderBottom="1px solid #fcfc "
                  fontSize={10}
                  value="new-txt"
                  color="#c571cd"
                  bg="transparent"
                  fontWeight={600}
                  _hover={{
                    color: "#4d06a3",
                    cursor: "pointer",
                    marginLeft: "30px",
                  }}
                  transition="0.5s"
                >
                  <Link to={"/cart"}>
                    <Text padding={3}>Cart</Text>
                  </Link>
                </Menu.Item>

                {user ? (
                  <Menu.Item
                    borderBottom="1px solid #fcfc"
                    fontSize={10}
                    value="logout"
                    color="#c571cd"
                    bg="transparent"
                    fontWeight={600}
                    _hover={{ color: "#4d06a3", cursor: "pointer", marginLeft: "30px" }}
                    transition="0.5s"
                    onClick={() => void signOut()}
                  >
                    <Text padding={3}>Log Out</Text>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    borderBottom="1px solid #fcfc"
                    fontSize={10}
                    value="auth"
                    color="#c571cd"
                    bg="transparent"
                    fontWeight={600}
                    _hover={{ color: "#4d06a3", cursor: "pointer", marginLeft: "30px" }}
                    transition="0.5s"
                  >
                    <Link to="/auth"><Text padding={3}>Log In</Text></Link>
                  </Menu.Item>
                )}
                <Menu.Item
                  fontSize={10}
                  value="new-txt"
                  color="#c571cd"
                  bg="transparent"
                  fontWeight={600}
                  _hover={{
                    color: "#4d06a3",
                    cursor: "pointer",
                    marginLeft: "30px",
                  }}
                  transition="0.5s"
                >
                  <Link to={""}>
                    <Text  scale={0.6} textAlign={'start'}>
                      <ColorModeToggle />
                    </Text>
                  </Link>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Box>
    </>
  );
};

export default MobileLinks;
