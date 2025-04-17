import { PropsWithChildren, useEffect, useState } from "react";
import API from "@/API.ts";
import User from "@/providers/auth/User.ts";
import AuthContext from "@/providers/auth/AuthContext.tsx";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const login = (user: User) => {
        setUser(user);
    };

    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        API.me()
            .then((result) => {
                if (result.success) {
                    login(result.data);
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const value = { user, login, logout, isLoggedIn: !!user, isLoading };
    return <AuthContext value={value}>{children}</AuthContext>;
}
