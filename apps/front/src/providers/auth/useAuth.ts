import { use } from "react";
import AuthContext from "@/providers/auth/AuthContext.tsx";

export default function useAuth() {
    const context = use(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
