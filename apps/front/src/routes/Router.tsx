import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/layouts/Layout";
import ProtectedPage from "@/routes/ProtectedPage";
import PublicPage from "@/routes/PublicPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "@/pages/TermsAndConditionsPage";
import PollPage from "@/pages/PollPage";
import DashboardPage from "@/pages/DashboardPage";
import CreatePollPage from "@/pages/CreatePollPage";
import PollResultsPage from "@/pages/PollResultsPage";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />

                <Route
                    path="/login"
                    element={
                        <PublicPage>
                            <LoginPage />
                        </PublicPage>
                    }
                />

                <Route
                    path="/privacy-policy"
                    element={
                        <Layout>
                            <PrivacyPolicyPage />
                        </Layout>
                    }
                />

                <Route
                    path="/terms"
                    element={
                        <Layout>
                            <TermsAndConditionsPage />
                        </Layout>
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

                <Route
                    path="/poll/:id/results"
                    element={
                        <Layout>
                            <PollResultsPage />
                        </Layout>
                    }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
