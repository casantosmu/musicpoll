import { createContext } from "react";
import User from "./User.ts";

const AuthContext = createContext<{
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    isLoggedIn: boolean;
    isLoading: boolean;
} | null>(null);

export default AuthContext;
