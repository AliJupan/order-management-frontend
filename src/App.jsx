import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage.jsx"));
const OrderFormPage = lazy(() => import("./pages/OrderFormPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));

function RouteFallback() {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

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
  return (
    <Suspense fallback={<RouteFallback />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}