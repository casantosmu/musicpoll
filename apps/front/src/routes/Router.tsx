import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/layouts/Layout";
import ProtectedPage from "@/routes/ProtectedPage";
import PublicPage from "@/routes/PublicPage";
import HomePage from "@/pages/HomePage";
import PollPage from "@/pages/PollPage";
import DashboardPage from "@/pages/DashboardPage";
import CreatePollPage from "@/pages/CreatePollPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <PublicPage>
                            <HomePage />
                        </PublicPage>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedPage>
                            <Layout>
                                <DashboardPage />
                            </Layout>
                        </ProtectedPage>
                    }
                />
                <Route
                    path="/create-poll"
                    element={
                        <ProtectedPage>
                            <Layout>
                                <CreatePollPage />
                            </Layout>
                        </ProtectedPage>
                    }
                />

                <Route
                    path="/poll/:id"
                    element={
                        <Layout>
                            <PollPage />
                        </Layout>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
