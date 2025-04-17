import { createContext } from "react";
import User from "@/providers/auth/User.ts";

const AuthContext = createContext<{
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoggedIn: boolean;
    isLoading: boolean;
} | null>(null);

export default AuthContext;
