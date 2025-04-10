import { Navigate, Outlet } from "react-router";
import useAuth from "../providers/auth/useAuth.ts";

export default function ProtectedLayout() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
