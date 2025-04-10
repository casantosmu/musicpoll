import { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./AuthContext.tsx";
import User from "./User.ts";
import ApiUsers from "../../api/users.ts";

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
        ApiUsers.me()
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
