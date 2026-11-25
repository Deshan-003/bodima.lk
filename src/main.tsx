import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ListingsProvider } from "./data/listingsStore";
import { AdminAuthProvider } from "./admin/auth/AdminAuthContext";
import { AdminDataProvider } from "./admin/data/store";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ListingsProvider>
        <AdminAuthProvider>
          <AdminDataProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AdminDataProvider>
        </AdminAuthProvider>
      </ListingsProvider>
    </AuthProvider>
  </StrictMode>,
);
