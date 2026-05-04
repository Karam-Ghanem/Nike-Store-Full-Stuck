import {
  Box,
  IconButton,
  Stack,
  Toolbar,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import { type PaletteMode } from "@mui/material/styles";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Text } from "@chakra-ui/react";
import AdminLinks from "./Header/AdminLinks";
import MobileLinks from "./Header/MobileLinks";

const drawerWidth = 240;

interface AppBarProps {
  open?: boolean;
  isMobile?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile",
})<AppBarProps>(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,

  ...(open &&
    !isMobile && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

interface Props {
  open: boolean;
  handleDrawerOpen: () => void;
  setMode: React.Dispatch<React.SetStateAction<PaletteMode>>;
}

const TopBar = ({ open, handleDrawerOpen, setMode }: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="fixed" open={open} isMobile={isMobile}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && !isMobile && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box className="hidden md:block">
          <Stack direction="row">
            {AdminLinks.map((link) => (
              <Link to={link.href} key={link.id}>
                <Text marginEnd={{md:'4', lg: "6" }}
                fontSize={{ md: "11px", lg: "16px",xl:"16px" }}>{link.label}</Text>
              </Link>
            ))}
          </Stack>
        </Box>

        <MobileLinks />

        <Box flexGrow={1} />

        <Stack direction={"row"}>
          <IconButton
            onClick={() => {
              localStorage.setItem(
                "currentMode",
                theme.palette.mode === "dark" ? "light" : "dark"
              );
              setMode((prev) => (prev === "light" ? "dark" : "light"));
            }}
            color="inherit"
          >
            {theme.palette.mode === "light" ? (
              <LightModeOutlinedIcon />
            ) : (
              <DarkModeOutlinedIcon />
            )}
          </IconButton>

          <IconButton color="inherit">
            <NotificationsOutlinedIcon />
          </IconButton>

          <IconButton color="inherit">
            <SettingsOutlinedIcon />
          </IconButton>

          <IconButton color="inherit">
            <Person2OutlinedIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
