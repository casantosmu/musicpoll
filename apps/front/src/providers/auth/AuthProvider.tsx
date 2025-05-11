import { PropsWithChildren, useEffect, useState } from "react";
import UserAPI from "@/api/UserAPI";
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
        UserAPI.me()
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-900">
                <div className="flex items-center justify-center flex-col">
                    <div className="animate-spin rounded-full h-16 w-16 border-3 border-t-green-500 border-b-green-500 border-r-transparent border-l-transparent"></div>
                    <p className="mt-4 text-zinc-300 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    // eslint-disable-next-line react-x/no-unstable-context-value
    const value = { user, login, logout, isLoggedIn: !!user, isLoading };
    return <AuthContext value={value}>{children}</AuthContext>;
}
