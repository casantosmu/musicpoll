import { Navigate, Outlet } from "react-router";
import useAuth from "@/providers/auth/useAuth.ts";

export default function PublicLayout() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}
