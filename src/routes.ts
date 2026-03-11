import { createBrowserRouter } from "react-router";
import Auth from "./pages/Auth";
import Goods from "./pages/Goods";

const router = createBrowserRouter([
    {
        path: "/",
        Component: Auth
    },
    {
        path: "goods",
        Component: Goods
    },
]);

export default router