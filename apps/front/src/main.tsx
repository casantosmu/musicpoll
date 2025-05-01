import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import "./index.css";

import AuthProvider from "@/providers/auth/AuthProvider.tsx";
import PublicLayout from "@/layouts/PublicLayout.tsx";
import ProtectedLayout from "@/layouts/ProtectedLayout.tsx";
import HomePage from "@/pages/HomePage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";
import CreatePollPage from "@/pages/CreatePollPage.tsx";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById("root")!;

ReactModal.setAppElement(root);

createRoot(root).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<HomePage />} />
                    </Route>

                    <Route element={<ProtectedLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/create-poll" element={<CreatePollPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
);
