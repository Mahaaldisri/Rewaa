import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/checkout/CheckoutPage";
import { OrderConfirmationPage } from "@/pages/OrderConfirmationPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { AccountPage } from "@/pages/account/AccountPage";
import { OrderDetailPage } from "@/pages/account/OrderDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

/**
 * Single route table for the storefront.
 * `/p/*` uses a catch-all so any product slug (current or future) resolves to
 * the same data-driven `ProductPage`; unknown slugs fall back to a friendly
 * "not found" state handled inside the page itself.
 */
export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "p/*", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "order/:orderId", element: <OrderConfirmationPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "account", element: <AccountPage /> },
      { path: "account/orders", element: <AccountPage /> },
      { path: "account/orders/:orderId", element: <OrderDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
