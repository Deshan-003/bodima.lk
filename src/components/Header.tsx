import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  UserCircle2,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse", dropdown: true },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** White floating header card that sits on top of the purple hero */
export default function Header() {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="relative z-30 mx-3 mt-3 rounded-2xl bg-white shadow-card">
      <div className="relative mx-auto flex h-[92px] max-w-[1180px] items-center justify-between px-8">
        <Logo />

        <nav className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-9 lg:flex">
          {NAV_LINKS.map((item) => {
            const active =
              pathname === item.to ||
              (item.to === "/browse" && pathname.startsWith("/browse/"));
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`relative flex h-full items-center gap-1 text-[15px] font-semibold transition ${
                  active ? "text-primary-700" : "text-night hover:text-primary-700"
                }`}
              >
                {item.label}
                {item.dropdown && (
                  <ChevronDown size={14} strokeWidth={2.75} className="mt-0.5" />
                )}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-t-full bg-primary-700" />
                )}
              </Link>
            );
          })}
        </nav>

        {user ? (
          <div className="relative">
            <button
              type="button"
              aria-label="Account menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2.5 rounded-full bg-primary-50 py-1.5 pl-1.5 pr-3.5 transition hover:bg-primary-100"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-700 text-[15px] font-extrabold text-white">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-[120px] truncate text-[15px] font-bold text-night sm:block">
                {user.name}
              </span>
              <ChevronDown
                size={15}
                strokeWidth={2.75}
                className="text-night/60"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-60 rounded-2xl bg-white p-4 shadow-bar">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-lav text-primary-700">
                    <UserCircle2 size={22} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-extrabold text-night">
                      {user.name}
                    </p>
                    <p className="truncate text-[12px] font-medium text-night/55">
                      {user.email}
                    </p>
                  </div>
                </div>
                <p className="mt-3 rounded-lg bg-lav px-3 py-2 text-[12px] font-bold capitalize text-primary-700">
                  Signed in as {user.role}
                </p>
                {user.role === "owner" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/dashboard");
                    }}
                    className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-bold text-night/70 transition hover:bg-lav hover:text-night"
                  >
                    <LayoutDashboard size={17} strokeWidth={2.4} />
                    Dashboard
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/chats");
                  }}
                  className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-bold text-night/70 transition hover:bg-lav hover:text-night"
                >
                  <MessageCircle size={17} strokeWidth={2.4} />
                  My Chats
                </button>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-[14px] font-bold text-night/70 transition hover:bg-lav hover:text-night"
                >
                  <LogOut size={17} strokeWidth={2.4} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full bg-primary-100 px-7 py-3 text-[15px] font-bold text-night transition hover:bg-primary-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-accent px-7 py-3 text-[15px] font-bold text-night shadow-cta transition hover:bg-accent-dark"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
