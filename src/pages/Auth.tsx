import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

function Auth() {
    const { token, onLogin } = useAuth();

    if (token) {
        return <Navigate to="/goods" />;
    }

    return (
        <div><button onClick={onLogin}>login</button></div>
    )
}

export default Auth