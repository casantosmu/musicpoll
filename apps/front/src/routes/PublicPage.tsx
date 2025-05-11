import { PropsWithChildren } from "react";
import { Navigate } from "react-router";
import useAuth from "@/providers/auth/useAuth.ts";

export default function PublicPage({ children }: PropsWithChildren) {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
