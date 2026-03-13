import { Navigate, Outlet } from 'react-router';
import useAuth from '../../shared/hooks/useAuth';

const ProtectedRoute = () => {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute