import { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import useAuth from "@/providers/auth/useAuth.ts";

export default function ProtectedPage({ children }: PropsWithChildren) {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
