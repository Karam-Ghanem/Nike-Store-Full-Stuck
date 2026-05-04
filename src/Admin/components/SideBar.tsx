import {
  Avatar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { grey } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/assets/nikelogo.png";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}));

const menu1 = [
  { text: "Dashboard", icon: <HomeOutlinedIcon />, path: "dashboard" },
  { text: "Manage Team", icon: <PeopleOutlinedIcon />, path: "team" },
  {
    text: "Contacts Information",
    icon: <ContactsOutlinedIcon />,
    path: "/admin/contacts",
  },
  {
    text: "Invoices Balances",
    icon: <ReceiptOutlinedIcon />,
    path: "/admin/invoices",
  },
];

const menu2 = [
  { text: "Profile Form", icon: <PersonOutlinedIcon />, path: "/admin/form" },
  {
    text: "Calendar",
    icon: <CalendarTodayOutlinedIcon />,
    path: "/admin/calendar",
  },
  { text: "FAQ Page", icon: <HelpOutlineOutlinedIcon />, path: "/admin/faq" },
];

const menu3 = [
  { text: "Bar Chart", icon: <BarChartOutlinedIcon />, path: "/admin/bar" },
  {
    text: "Pie Chart",
    icon: <PieChartOutlineOutlinedIcon />,
    path: "/admin/pie",
  },
  { text: "Line Chart", icon: <TimelineOutlinedIcon />, path: "/admin/line" },
  {
    text: "Geography Chart",
    icon: <MapOutlinedIcon />,
    path: "/admin/geography",
  },
];

interface Props {
  open: boolean;
  handleDrawerClose: () => void;
}

export default function SideBar({ open, handleDrawerClose }: Props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="temporary" // 🔥 Temporary على كل الشاشات
      anchor="left"
      open={open}
      onClose={handleDrawerClose}
      ModalProps={{ keepMounted: true }}
      slotProps={{
        backdrop: { invisible: false },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: "fixed",
          zIndex: 1300,
        },
      }}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>

      <Divider />

      <Avatar
        src={Logo}
        sx={{
          mx: "auto",
          width: 88,
          height: 88,
          my: 1,
          border: "2px solid grey",
        }}
      />

      <Typography align="center" sx={{ fontSize: 17 }}>
        Karam Ghanem
      </Typography>

      <Typography
        align="center"
        sx={{ fontSize: 15, color: theme.palette.info.main }}
      >
        Admin
      </Typography>

      <Divider />

      {[menu1, menu2, menu3].map((menu, idx) => (
        <List key={idx}>
          {menu.map((item) => (
            <ListItem key={item.path} disablePadding>
              <Tooltip title={item.text} placement="right">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    handleDrawerClose(); // 🔥 يسكر بعد التنقل
                  }}
                  sx={{
                    minHeight: 48,
                    px: 2.5,
                    bgcolor:
                      location.pathname === item.path
                        ? theme.palette.mode === "dark"
                          ? grey[800]
                          : grey[300]
                        : "",
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: 3 }}>
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText primary={item.text} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      ))}
    </Drawer>
  );
}
