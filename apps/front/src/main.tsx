import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AuthProvider from "./providers/auth/AuthProvider.tsx";
import PublicLayout from "./layouts/PublicLayout.tsx";
import ProtectedLayout from "./layouts/ProtectedLayout.tsx";

import "./index.css";
import HomePage from "./pages/HomePage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                    </Route>

                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
