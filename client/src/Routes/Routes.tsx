import About from "@/components/About/About";
import Products from "@/components/Products/Products";
import SingleProduct from "@/components/Products/SingleProduct";
import Review from "@/Pages/Review/Review";
import Services from "@/Pages/Services/Services";
import Cart from "@/Pages/Cart/Cart";
import Favorites from "@/Pages/Favorites/Favorites";
import HomePage from "@/Pages/HomePage";
import Layout from "@/Pages/Layout";
import { createBrowserRouter } from "react-router-dom";
import CheckOut from "@/Pages/CheckOut/CheckOut";
import Pay from "@/Pages/CheckOut/Pay";

import AdminApp from "@/Admin/AdminApp";
// import Team from "@/Admin/page/team/Team";
// import Dashboard from "@/Admin/page/dashboard/Dashboard";
// import Contacts from "@/Admin/page/contacts/Contacts";
// import Invoices from "@/Admin/page/invoices/Invoices";
// import Form from "@/Admin/page/form/Form";
// import Calendar from "@/Admin/page/calendar/Calendar";
// import FAQ from "@/Admin/page/faq/FAQ";
// import BarChart from "@/Admin/page/barChart/BarChart";
// import PieChart from "@/Admin/page/pieChart/PieChart";
// import LineChart from "@/Admin/page/lineChart/LineChart";
// import Geography from "@/Admin/page/geography/Geography";
import NotFound from "@/Admin/page/notFound/NotFound";
import Wallet from "@/Pages/CheckOut/Wallet";
import MyPurchases from "@/Pages/purchases/MyPurchases";
// import AddProduct from "@/Admin/page/addProduct/AddProduct";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <About /> },
      { path: "review", element: <Review /> },
      { path: "services", element: <Services /> },
      { path: "products", element: <Products edit_delete={false} homePage={false} /> },
      { path: "product/:id/:category", element: <SingleProduct isAdmin={false}/> },
      { path: "cart", element: <Cart /> },
      { path: "favorites", element: <Favorites /> },
      { path: "checkout", element: <CheckOut />},
      { path: "checkout/pay", element: <Pay />},
      { path: "checkout/pay/wallet/:type", element: <Wallet />},
      { path: "mypurchases", element: <MyPurchases />},
    ],
  },
  {
    path: "admin",
    element: <AdminApp />,
    children: [
      // { path: "dashboard", element: <Dashboard/> },
      // { path: "addproduct", element: <AddProduct /> },
      // { path: "editproducts", element: <Products homePage={false} /> },
      // { path: "team", element: <Team /> },
      // { path: "contacts", element: <Contacts /> },
      // { path: "invoices", element: <Invoices /> },
      // { path: "form", element: <Form /> },
      // { path: "calendar", element: <Calendar /> },
      // { path: "faq", element: <FAQ /> },
      // { path: "bar", element: <BarChart /> },
      // { path: "pie", element: <PieChart /> },
      // { path: "line", element: <LineChart /> },
      // { path: "geography", element: <Geography /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
