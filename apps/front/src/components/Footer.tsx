import { Link } from "react-router";
import { Mail } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-zinc-800 mt-auto py-4 md:py-6 shadow-inner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo and copyright - smaller on mobile */}
                    <div className="mb-2 md:mb-0">
                        <div className="flex items-center justify-center md:justify-start">
                            <span className="text-green-500 font-bold text-sm md:text-lg">MusicPolls</span>
                        </div>
                        <p className="text-zinc-400 text-xs md:text-sm text-center md:text-left">
                            © {currentYear} MusicPolls. All rights reserved.
                        </p>
                    </div>

                    {/* Links - more compact on mobile */}
                    <div className="flex flex-col items-center md:items-end">
                        <div className="flex space-x-4 md:space-x-6 mb-2 md:mb-3 text-xs md:text-sm">
                            <Link to="/privacy-policy" className="text-zinc-400 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link to="/terms" className="text-zinc-400 hover:text-white transition-colors">
                                Terms
                            </Link>
                            <a
                                href="mailto:contact@musicpolls.net"
                                className="text-zinc-400 hover:text-white transition-colors flex items-center"
                            >
                                <Mail className="h-3 w-3 md:h-4 md:w-4 text-green-500 mr-1" />
                                <span className="hidden sm:inline">contact@musicpolls.net</span>
                                <span className="sm:hidden">Contact</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
