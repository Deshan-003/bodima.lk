import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Building2,
  CircleHelp,
  Eye,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  Wallet,
  Pencil,
} from "lucide-react";
import Logo from "../components/Logo";
import AddPropertyModal from "../components/AddPropertyModal";
import { useAuth } from "../context/AuthContext";
import { useListings } from "../data/listingsStore";
import type { Listing } from "../data/listings";

const STATS = [
  { label: "Total Listings", value: "05", icon: Building2 },
  { label: "Views This Month", value: "1,284", icon: Eye },
  { label: "Active Inquiries", value: "12", icon: MessageSquare },
  { label: "Earnings This Month", value: "Rs. 45,000", icon: Wallet },
];

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Listings", icon: Building2 },
  { label: "Inquiries", icon: Mail },
  { label: "Messages", icon: MessageSquare, to: "/chats" },
  { label: "Profile", icon: User },
];

/** Owner dashboard with listing stats, owned properties and an upload form */
export default function OwnerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { listings, publishListing, updateListing, removeListing } = useListings();
  // The owner's table is the same shared catalogue seekers browse, so newly
  // published posts remain visible here after navigating away and back.
  const properties = listings;
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handlePublish = (property: Listing) => {
    if (editing) {
      updateListing(property);
      setSuccessMessage("Property updated successfully!");
    } else {
      publishListing(property);
      setSuccessMessage("New post published! Seekers can now find it on Browse.");
    }
    setEditing(null);
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 3500);
  };

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (property: Listing) => {
    setEditing(property);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    removeListing(id);
  };

  return (
    <div className="flex min-h-screen bg-page font-sans">
      {/* Dark sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col bg-[#271B63] px-5 py-7 text-white lg:flex">
        <Logo variant="light" />

        <p className="mt-10 px-3 text-[11px] font-extrabold uppercase tracking-widest text-white/40">
          Menu
        </p>
        <nav className="mt-3 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return item.to ? (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <Icon size={19} strokeWidth={2.2} /> {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (item.label === "My Listings") {
                    document
                      .getElementById("my-properties")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold transition ${
                  item.active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={19} strokeWidth={2.2} /> {item.label}
              </button>
            );
          })}
          <Link
            to="/browse"
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold text-accent transition hover:bg-white/10"
          >
            <Eye size={19} strokeWidth={2.2} /> Browse Listings
          </Link>
        </nav>

        <p className="mt-9 px-3 text-[11px] font-extrabold uppercase tracking-widest text-white/40">
          Settings
        </p>
        <div className="mt-3 space-y-1">
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
            <Settings size={19} strokeWidth={2.2} /> Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
            <CircleHelp size={19} strokeWidth={2.2} /> Help Center
          </button>
          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[14px] font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={19} strokeWidth={2.2} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 px-6 py-8 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-night">
              Welcome back, {user?.name ?? "Owner"}!
            </h1>
            <p className="mt-1 text-[14px] font-medium text-night/60">
              Here's what's happening with your listings today.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search
                size={18}
                strokeWidth={2.3}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-night/40"
              />
              <input
                aria-label="Search dashboard"
                placeholder="Search..."
                className="h-11 w-48 rounded-xl border border-primary-100 bg-white pl-11 pr-4 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
              />
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-11 w-11 place-items-center rounded-xl bg-white text-night/70 shadow-card"
            >
              <Bell size={20} strokeWidth={2.2} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-700 text-[16px] font-extrabold text-white">
              {(user?.name ?? "O").slice(0, 1).toUpperCase()}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={openAdd}
          className="mt-6 flex items-center gap-2 rounded-xl bg-primary-700 px-6 py-3.5 text-[15px] font-extrabold text-white shadow-cta transition hover:bg-primary-800"
        >
          <Plus size={19} strokeWidth={2.6} /> Create New Post
        </button>

        {success && (
          <p className="mt-4 rounded-xl bg-[#DFF2E4] px-4 py-3 text-[14px] font-bold text-[#1F7A3D]">
            {successMessage}
          </p>
        )}

        {/* Stat cards */}
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold text-night/55">{stat.label}</p>
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-lav text-primary-700">
                    <Icon size={18} strokeWidth={2.3} />
                  </span>
                </div>
                <p className="mt-3 text-[24px] font-extrabold text-night">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Properties table */}
        <div id="my-properties" className="mt-8 rounded-2xl bg-white shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 px-6 py-5">
            <h2 className="text-[20px] font-extrabold text-night">My Properties</h2>
            <Link
              to="/browse"
              className="text-[14px] font-bold text-primary-700 hover:underline"
            >
              See All Listings &rarr;
            </Link>
          </div>
          <div className="overflow-x-auto px-2 py-2">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">
                  <th className="px-4 py-3">Property</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Bathroom / Key Money</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id} className="border-t border-primary-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.img}
                          alt=""
                          className="h-11 w-14 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-night">{p.title}</p>
                          <p className="text-[12px] font-medium text-night/50">
                            {p.town}, {p.district}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[14px] font-bold text-night">
                      Rs. {p.price.toLocaleString()}
                      <span className="block text-[12px] font-medium text-night/45">/month</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] font-semibold text-night/70">
                      <span>{p.bathroom ?? "—"} bathroom</span>
                      <span className="block text-night/50">
                        {p.keyMoney
                          ? `${p.keyMoney.months} month(s) key money`
                          : "No key money"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {p.isNew ? (
                        <span className="rounded-full bg-primary-100 px-3 py-1 text-[12px] font-bold text-primary-700">
                          New Post
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#DFF2E4] px-3 py-1 text-[12px] font-bold text-[#1F7A3D]">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[14px] font-semibold text-night/70">
                      0
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          aria-label={`Edit ${p.title}`}
                          onClick={() => openEdit(p)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-lav text-primary-700 hover:bg-primary-100"
                        >
                          <Pencil size={15} strokeWidth={2.3} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${p.title}`}
                          onClick={() => handleDelete(p.id)}
                          className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                        >
                          <Trash2 size={15} strokeWidth={2.3} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-[14px] font-semibold text-night/55">
                      No properties yet — create a new post to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <AddPropertyModal
        key={editing?.id ?? "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        initial={editing}
        onPublish={handlePublish}
      />
    </div>
  );
}
