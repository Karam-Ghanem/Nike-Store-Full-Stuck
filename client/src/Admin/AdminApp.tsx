import { Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  styled,
  type PaletteMode,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import TopBar from "./components/TopBar";
import SideBar from "./components/SideBar";
import { getDesignTokens } from "./theme";

import Dashboard from "./page/dashboard/Dashboard";
import Team from "./page/team/Team";
import Contacts from "./page/contacts/Contacts";
import Invoices from "./page/invoices/Invoices";
import Form from "./page/form/Form";
import Calendar from "./page/calendar/Calendar";
import FAQ from "./page/faq/FAQ";
import BarChart from "./page/barChart/BarChart";
import PieChart from "./page/pieChart/PieChart";
import LineChart from "./page/lineChart/LineChart";
import Geography from "./page/geography/Geography";
import NotFound from "./page/notFound/NotFound";
import { useState, useMemo, useEffect } from "react";
import AddProduct from "./page/AddEditProduct/AddEdit";
import Products from "@/components/Products/Products";
import Sale from "./page/sale/Sale";
import SingleProduct from "@/components/Products/SingleProduct";
import UsersReview from "./page/usersReviews/UsersReview";
import Archive from "./page/archive/Archive";
import SetCoupon from "./page/Coupon/SetCoupon";
import ReturnPolicy from "./page/Replacement/ReturnPolicy";
import ReturnRequests from "./page/Replacement/ReturnRequests";
import AddAdmin from "./page/AddAdmin/AddAdmin";
import useProductStore from "@/components/Products/ProductStore";
const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export default function AdminApp() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<PaletteMode>(
    (localStorage.getItem("currentMode") as PaletteMode) || "light"
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  const loadProducts = useProductStore((state) => state.loadProducts);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 🔥 كل شي لازم يكون داخل نفس الـ flex */}
      <Box sx={{ display: "flex" }}>
        {/* السايدبار */}
        <SideBar open={open} handleDrawerClose={() => setOpen(false)} />

        {/* المحتوى + التوب بار */}
        <Box sx={{ flexGrow: 1 }}>
          <TopBar
            open={open}
            handleDrawerOpen={() => setOpen(true)}
            setMode={setMode}
          />

          <Box component="main" sx={{ p: 3 }}>
            <DrawerHeader />

            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route
                path="addproduct"
                element={<AddProduct title="ADD PRODUCT" />}
              />
              <Route
                path="editproduct/:id"
                element={<AddProduct title="EDIT PRODUCT" />}
              />
              <Route
                path="edit_archive_product"
                element={<Products edit_delete={true} homePage={false} />}
              />
              <Route path="sale/:id?" element={<Sale />} />
              <Route path="archive" element={<Archive />} />
              <Route path="/archive/:id/:category"element={<SingleProduct isAdmin={true} />}/>

              <Route path="coupon" element={<SetCoupon/>} />
              <Route path="return-policy" element={<ReturnPolicy/>} />
              <Route path="return-requests" element={<ReturnRequests />} />
              <Route path="add-admin" element={<AddAdmin />} />


              <Route path="usersReview" element={<UsersReview />} />
              <Route path="team" element={<Team />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="form" element={<Form />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="bar" element={<BarChart />} />
              <Route path="pie" element={<PieChart />} />
              <Route path="line" element={<LineChart />} />
              <Route path="geography" element={<Geography />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
