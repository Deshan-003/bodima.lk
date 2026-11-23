import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse", dropdown: true },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

/** White floating header card that sits on top of the purple hero */
export default function Header() {
  const { pathname } = useLocation();

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
      </div>
    </header>
  );
}
