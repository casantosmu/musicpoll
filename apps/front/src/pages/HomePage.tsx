import { Navigate } from "react-router";
import useAuth from "@/providers/auth/useAuth";

export default function HomePage() {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
}
