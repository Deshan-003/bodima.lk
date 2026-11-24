import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Logo from "../../components/Logo";
import { ADMIN_EMAIL, ADMIN_PASSWORD, useAdminAuth } from "../auth/AdminAuthContext";
import { primaryBtn } from "../components/ui";

const HIGHLIGHTS = [
  "Monitor users, listings and reports in one place",
  "Moderate complaints and keep the marketplace safe",
  "Track registrations, enquiries and platform activity",
];

export default function AdminLogin() {
  const { session, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const from = (location.state as { from?: string } | null)?.from ?? "/admin";

  if (session) return <Navigate to="/admin" replace />;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    navigate(from.startsWith("/admin") ? from : "/admin", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Brand panel */}
      <aside className="relative hidden w-[46%] max-w-[620px] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#3B22A1] via-[#2F1B85] to-[#201B57] px-12 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="relative">
          <Logo variant="light" />
          <span className="ml-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-accent">
            Admin Console
          </span>
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-accent">
            <Sparkles size={14} strokeWidth={2.6} /> Marketplace Control
          </span>
          <h1 className="mt-5 text-[40px] font-extrabold leading-[1.15] tracking-tight">
            Manage all of Bodima.lk
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-4 max-w-md text-[15px] font-medium leading-relaxed text-white/65">
            A single workspace to oversee seekers, owners, boarding listings and community activity.
          </p>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[14px] font-medium text-white/80">
                <CheckCircle2 size={18} strokeWidth={2.3} className="mt-0.5 shrink-0 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[12px] font-medium text-white/40">
          © 2026 Bodima.lk · Admin demonstration environment
        </p>
      </aside>

      {/* Form panel */}
      <main className="flex flex-1 flex-col items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[430px]">
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="mt-8 lg:mt-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-lav px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-primary-700">
              <ShieldCheck size={14} strokeWidth={2.6} /> Restricted Access
            </span>
            <h2 className="mt-5 text-[30px] font-extrabold leading-tight tracking-tight text-night">
              Admin sign in
            </h2>
            <p className="mt-2 text-[14px] font-medium text-night/60">
              Use the administrator account to continue to the control panel.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="admin-email" className="block text-[13px] font-bold text-night">
                Email Address
              </label>
              <div className="relative mt-1.5">
                <Mail size={18} strokeWidth={2.3} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500" />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="admin@bodima.lk"
                  className="h-12 w-full rounded-xl border border-primary-100 bg-white pl-11 pr-4 text-[15px] font-medium text-night placeholder:font-normal placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-[13px] font-bold text-night">
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock size={18} strokeWidth={2.3} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500" />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-primary-100 bg-white pl-11 pr-4 text-[15px] font-medium text-night placeholder:font-normal placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-bold text-red-700">
                <AlertCircle size={17} strokeWidth={2.4} className="mt-0.5 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" className={`${primaryBtn} h-12 w-full text-[15px]`}>
              Sign In to Admin Panel
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-primary-100 bg-page p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-extrabold uppercase tracking-wider text-primary-700">
                Demo credentials
              </p>
              <button
                type="button"
                onClick={() => {
                  setEmail(ADMIN_EMAIL);
                  setPassword(ADMIN_PASSWORD);
                  setError("");
                }}
                className="inline-flex items-center gap-1.5 text-[12px] font-extrabold text-primary-700 hover:underline"
              >
                <KeyRound size={13} strokeWidth={2.5} /> Fill details
              </button>
            </div>
            <div className="mt-3 space-y-1.5 text-[13px] font-medium text-night/70">
              <p><span className="font-bold text-night">Email:</span> {ADMIN_EMAIL}</p>
              <p><span className="font-bold text-night">Password:</span> {ADMIN_PASSWORD}</p>
            </div>
            <p className="mt-3 border-t border-primary-100 pt-3 text-[11px] font-medium leading-relaxed text-night/50">
              Frontend demonstration only. Credentials are hard-coded and the session is stored in
              localStorage — this is not secure production authentication.
            </p>
          </div>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold text-primary-700 hover:underline"
          >
            <ArrowLeft size={15} strokeWidth={2.5} /> Back to Bodima.lk
          </Link>
        </div>
      </main>
    </div>
  );
}
