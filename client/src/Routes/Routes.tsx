import About from "@/components/About/About";
import Products from "@/components/Products/Products";
import SingleProduct from "@/components/Products/SingleProduct";
import Review from "@/Pages/Review/Review";
import Services from "@/Pages/Services/Services";
import Cart from "@/Pages/Cart/Cart";
import Favorites from "@/Pages/Favorites/Favorites";
import HomePage from "@/Pages/HomePage";
import Layout from "@/Pages/Layout";
import CheckOut from "@/Pages/CheckOut/CheckOut";
import Pay from "@/Pages/CheckOut/Pay";
import AdminApp from "@/Admin/AdminApp";
import NotFound from "@/Admin/page/notFound/NotFound";
import Wallet from "@/Pages/CheckOut/Wallet";
import MyPurchases from "@/Pages/purchases/MyPurchases";
import AuthPage from "@/Pages/Auth/AuthPage";

import { createBrowserRouter, Navigate } from "react-router-dom";
import useAuthStore from "@/auth/authStore";

function AdminRoute() {
  const { user, initialized } = useAuthStore();
  if (!initialized) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!user.is_staff) return <Navigate to="/" replace />;
  return <AdminApp />;
}
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
      { path: "auth", element: <AuthPage />},
    ],
  },
  {
    path: "admin",
    element: <AdminRoute />,
    children: [
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
