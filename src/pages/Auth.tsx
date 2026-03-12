import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import AuthForm from "../features/AuthForm/AuthForm";

const Auth = () => {
    const { token, onLogin, error } = useAuth();

    if (token) {
        return <Navigate to="/products" />;
    }

    return (
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
            <AuthForm onLogin={onLogin} error={error} />
        </div>
    )
}

export default Auth;