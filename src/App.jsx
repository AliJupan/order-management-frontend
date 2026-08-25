import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailPage from "./pages/OrderDetailPage.jsx";
import OrderFormPage from "./pages/OrderFormPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/products", element: <ProductsPage /> },
          { path: "/orders", element: <OrdersPage /> },
          { path: "/orders/:id", element: <OrderDetailPage /> },
          { path: "/orders/add", element: <OrderFormPage /> },
        ],
      },
    ],
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}
