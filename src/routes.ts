import { createBrowserRouter } from "react-router";
import Auth from "./pages/Auth";
import Goods from "./pages/Goods";
import ProtectedRoute from "./features/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Auth,
    },
    {
        path: "goods",
        Component: ProtectedRoute,
        children: [
            {
                index: true,
                Component: Goods,
            },
        ],
    },
]);

export default router