import { createContext, useContext, useState, type ReactNode } from "react";

/** Frontend demo credentials only — there is intentionally no backend or real authentication. */
export const ADMIN_EMAIL = "admin@bodima.lk";
export const ADMIN_PASSWORD = "Admin@123";

const STORAGE_KEY = "bodima.admin.auth.v1";

export interface AdminSession {
  email: string;
  name: string;
  loginAt: number;
}

type SignInResult = { ok: true } | { ok: false; error: string };

interface AdminAuthValue {
  session: AdminSession | null;
  signIn: (email: string, password: string) => SignInResult;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminSession;
    if (
      parsed &&
      typeof parsed.email === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.loginAt === "number"
    ) {
      return parsed;
    }
  } catch {
    // Ignore malformed demo sessions.
  }
  return null;
}

/** Demo-only admin session. localStorage is NOT secure production authentication. */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(readSession);

  const signIn = (email: string, password: string): SignInResult => {
    const normalized = email.trim().toLowerCase();
    if (normalized !== ADMIN_EMAIL.toLowerCase()) {
      return { ok: false, error: "Incorrect email address. Use the demo admin email shown below." };
    }
    if (password !== ADMIN_PASSWORD) {
      return { ok: false, error: "Incorrect password. Please try again." };
    }
    const next: AdminSession = { email: ADMIN_EMAIL, name: "Bodima Administrator", loginAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSession(next);
    return { ok: true };
  };

  const signOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
