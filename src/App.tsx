import { RouterProvider } from "react-router-dom";
import { StoreProvider } from "@/store/StoreProvider";
import { AuthProvider } from "@/store/AuthProvider";
import { router } from "@/router";

/**
 * Storefront root.
 * Routing lives in `src/router.tsx`; this component only wires the global
 * providers (cart/wishlist/toasts + auth session) around the router.
 */
export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <RouterProvider router={router} />
      </StoreProvider>
    </AuthProvider>
  );
}
