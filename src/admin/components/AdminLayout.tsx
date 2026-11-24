import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  ChevronDown,
  Clock3,
  ExternalLink,
  Flag,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Store,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Logo from "../../components/Logo";
import { useAdminAuth } from "../auth/AdminAuthContext";
import { useAdminData } from "../data/store";
import { Avatar, ToastProvider, cx } from "./ui";

type NavItem = { label: string; to: string; icon: LucideIcon; end?: boolean };
type NavGroup = { label: string; items: NavItem[] };

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true }],
  },
  {
    label: "Marketplace",
    items: [
      { label: "All Listings", to: "/admin/listings", icon: Building2 },
      { label: "Pending Listings", to: "/admin/listings/pending", icon: Clock3 },
      { label: "Reported Listings", to: "/admin/listings/reported", icon: Flag },
      { label: "Locations", to: "/admin/locations", icon: MapPin },
    ],
  },
  {
    label: "User Management",
    items: [
      { label: "All Users", to: "/admin/users", icon: Users },
      { label: "Seekers", to: "/admin/users/seekers", icon: UserRound },
      { label: "Owners", to: "/admin/users/owners", icon: Store },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "Messages / Enquiries", to: "/admin/messages", icon: MessageSquare },
      { label: "Reviews & Feedback", to: "/admin/reviews", icon: Star },
      { label: "Reports & Complaints", to: "/admin/reports", icon: AlertTriangle },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
      { label: "Notifications", to: "/admin/notifications", icon: Bell },
      { label: "Admin Settings", to: "/admin/settings", icon: Settings },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/listings": "All Listings",
  "/admin/listings/pending": "Pending Listings",
  "/admin/listings/reported": "Reported Listings",
  "/admin/locations": "Locations",
  "/admin/users": "All Users",
  "/admin/users/seekers": "Seekers",
  "/admin/users/owners": "Owners",
  "/admin/messages": "Messages / Enquiries",
  "/admin/reviews": "Reviews & Feedback",
  "/admin/reports": "Reports & Complaints",
  "/admin/analytics": "Analytics",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Admin Settings",
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { signOut } = useAdminAuth();
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between px-1">
        <Link to="/admin" onClick={onNavigate}>
          <Logo variant="light" />
        </Link>
        <span className="hidden rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-accent sm:inline-flex">
          Admin
        </span>
      </div>

      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto pb-4" aria-label="Admin navigation">
        {ADMIN_NAV.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/35">
              {group.label}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cx(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition",
                        isActive
                          ? "bg-white/15 text-white shadow-[inset_3px_0_0_0_#FBC63F]"
                          : "text-white/65 hover:bg-white/10 hover:text-white",
                      )
                    }
                  >
                    <Icon size={18} strokeWidth={2.2} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 pt-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          <ExternalLink size={18} strokeWidth={2.2} /> Back to Website
        </Link>
        <button
          type="button"
          onClick={() => {
            signOut();
            navigate("/admin/login", { replace: true });
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-accent transition hover:bg-white/10"
        >
          <LogOut size={18} strokeWidth={2.2} /> Logout
        </button>
      </div>
    </>
  );
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { session, signOut } = useAdminAuth();
  const { data } = useAdminData();

  const title = PAGE_TITLES[pathname] ?? "Admin Console";
  const unreadNotifications = data.notifications.filter((n) => !n.read).length;
  const displayName = data.adminProfile.name || session?.name || "Administrator";

  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-page font-sans">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[262px] shrink-0 flex-col bg-[#271B63] px-5 py-7 text-white lg:flex">
          <SidebarContent />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation"
              className="absolute inset-0 bg-ink/60"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-[#271B63] px-5 py-7 text-white shadow-bar">
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-4 top-7 grid h-8 w-8 place-items-center rounded-lg bg-white/10"
              >
                <X size={18} />
              </button>
              <div className="mt-4 flex h-full flex-col">
                <SidebarContent onNavigate={() => setSidebarOpen(false)} />
              </div>
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          {/* Top navigation */}
          <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-primary-100 bg-white/95 px-4 backdrop-blur sm:px-7">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lav text-primary-700 lg:hidden"
            >
              <Menu size={20} strokeWidth={2.3} />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-night/40">Admin Console</p>
              <p className="truncate text-[16px] font-extrabold leading-tight text-night">{title}</p>
            </div>

            <div className="ml-auto flex items-center gap-2.5">
              <form
                className="relative hidden md:block"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search.trim()) {
                    navigate(`/admin/users?q=${encodeURIComponent(search.trim())}`);
                    setSearch("");
                  }
                }}
              >
                <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-night/40" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users…"
                  aria-label="Search users"
                  className="h-10 w-52 rounded-xl border border-primary-100 bg-white pl-10 pr-3 text-[13px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
                />
              </form>

              <Link
                to="/admin/notifications"
                aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`}
                className="relative grid h-10 w-10 place-items-center rounded-xl bg-lav text-primary-700 transition hover:bg-primary-100"
              >
                <Bell size={19} strokeWidth={2.2} />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white">
                    {unreadNotifications}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-lav"
                >
                  <Avatar name={displayName} size="sm" />
                  <span className="hidden text-[13px] font-bold text-night sm:block">Admin</span>
                  <ChevronDown size={15} className="text-night/45" />
                </button>
                {menuOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close account menu"
                      className="fixed inset-0 z-10 cursor-default"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-12 z-20 w-60 rounded-2xl border border-primary-100 bg-white p-2 shadow-bar">
                      <div className="border-b border-primary-100 px-3 py-3">
                        <p className="text-[13px] font-extrabold text-night">{displayName}</p>
                        <p className="mt-0.5 truncate text-[12px] font-medium text-night/55">{session?.email}</p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-lav px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-primary-700">
                          <ShieldCheck size={11} /> Super Admin
                        </span>
                      </div>
                      <Link
                        to="/admin/settings"
                        onClick={() => setMenuOpen(false)}
                        className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-night/70 hover:bg-lav hover:text-night"
                      >
                        <Settings size={15} /> Profile & settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          signOut();
                          navigate("/admin/login", { replace: true });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={15} /> Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-7 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
