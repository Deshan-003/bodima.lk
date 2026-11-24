import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AdminAuthProvider } from "./admin/auth/AdminAuthContext";
import { AdminDataProvider } from "./admin/data/store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AdminAuthProvider>
        <AdminDataProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AdminDataProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </StrictMode>,
);
