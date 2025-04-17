import { useState } from "react";
import { Navigate, Outlet } from "react-router";
import { LogOut, Music, Plus, User } from "lucide-react";
import API from "@/API.ts";
import useAuth from "@/providers/auth/useAuth.ts";
import useOnClickOutside from "@/hooks/useOnClickOutside.tsx";

export default function ProtectedLayout() {
    const { logout, isLoggedIn, isLoading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const userMenuRef = useOnClickOutside<HTMLDivElement>(() => {
        setIsMenuOpen(false);
    });

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        API.logout()
            .then((result) => {
                if (result.success) {
                    logout();
                }
            })
            .catch(console.error)
            .finally(() => {
                setIsMenuOpen(false);
            });
    };

    if (isLoading) {
        return null;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            {/* Header/Navbar */}
            <header className="bg-zinc-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        {/* Logo */}
                        <a href="/dashboard" className="flex items-center">
                            <Music className="h-8 w-8 text-green-500" />
                            <span className="ml-2 text-xl font-bold hidden sm:block">MusicPolls</span>
                        </a>

                        {/* Navigation */}
                        <nav className="flex flex-1 items-center justify-end">
                            <a
                                href="/create-poll"
                                className="flex items-center px-4 py-2 rounded-full text-sm text-white bg-zinc-700 hover:bg-zinc-600 mr-4"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Poll
                            </a>
                        </nav>

                        {/* User Avatar and Dropdown */}
                        <div className="relative">
                            <button
                                onClick={toggleMenu}
                                type="button"
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                                aria-label="User menu"
                            >
                                <User className="h-5 w-5" />
                            </button>

                            {/* Dropdown Menu */}
                            {isMenuOpen && (
                                <div
                                    ref={userMenuRef}
                                    className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-800 ring-1 ring-zinc-700"
                                >
                                    <nav className="py-1">
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-zinc-700 cursor-pointer"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Sign out
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>
        </div>
    );
}
