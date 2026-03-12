import { createBrowserRouter } from "react-router";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProtectedRoute from "./features/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Auth,
    },
    {
        path: "products",
        Component: ProtectedRoute,
        children: [
            {
                index: true,
                Component: Products,
            },
        ],
    },
]);

export default router