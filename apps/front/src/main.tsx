import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";
import Router from "@/routes/Router";

import "./index.css";

import AuthProvider from "@/providers/auth/AuthProvider.tsx";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById("root")!;

ReactModal.setAppElement(root);

createRoot(root).render(
    <StrictMode>
        <AuthProvider>
            <Router />
        </AuthProvider>
    </StrictMode>,
);
