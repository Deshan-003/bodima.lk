import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { makeSeedData } from "./seed";
import type {
  AdminActivity,
  AdminData,
  AdminListing,
  AdminProfile,
  AdminReview,
  AdminUser,
  ListingStatus,
  LocationEntry,
  PlatformSettings,
  Report,
  UserStatus,
} from "./types";

const STORAGE_KEY = "bodima.admin.data.v1";

function loadData(): AdminData {
  const seed = makeSeedData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const saved = JSON.parse(raw) as Partial<AdminData>;
    return {
      users: Array.isArray(saved.users) ? saved.users : seed.users,
      listings: Array.isArray(saved.listings) ? saved.listings : seed.listings,
      reports: Array.isArray(saved.reports) ? saved.reports : seed.reports,
      reviews: Array.isArray(saved.reviews) ? saved.reviews : seed.reviews,
      enquiries: Array.isArray(saved.enquiries) ? saved.enquiries : seed.enquiries,
      locations: Array.isArray(saved.locations) ? saved.locations : seed.locations,
      activities: Array.isArray(saved.activities) ? saved.activities : seed.activities,
      notifications: Array.isArray(saved.notifications) ? saved.notifications : seed.notifications,
      settings: { ...seed.settings, ...saved.settings },
      adminProfile: { ...seed.adminProfile, ...saved.adminProfile },
    };
  } catch {
    return seed;
  }
}

function nextId(rows: Array<{ id: number }>): number {
  return rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
}

function log(text: string, type: AdminActivity["type"]): AdminActivity {
  return { id: Date.now() + Math.floor(Math.random() * 1000), type, text, time: "Just now" };
}

function withActivity(activities: AdminActivity[], item: AdminActivity): AdminActivity[] {
  return [item, ...activities].slice(0, 40);
}

export interface AdminDataValue {
  data: AdminData;
  addUser: (input: Omit<AdminUser, "id">) => AdminUser;
  updateUser: (id: number, patch: Partial<AdminUser>) => void;
  deleteUser: (id: number) => void;
  setUserStatus: (id: number, status: UserStatus) => void;
  addListing: (input: Omit<AdminListing, "id">) => AdminListing;
  updateListing: (id: number, patch: Partial<AdminListing>) => void;
  setListingStatus: (id: number, status: ListingStatus) => void;
  toggleFeatured: (id: number) => void;
  deleteListing: (id: number) => void;
  updateReport: (id: number, patch: Partial<Report>) => void;
  deleteReport: (id: number) => void;
  updateReview: (id: number, patch: Partial<AdminReview>) => void;
  deleteReview: (id: number) => void;
  markEnquiryRead: (id: number) => void;
  replyToEnquiry: (id: number, text: string) => void;
  deleteEnquiry: (id: number) => void;
  addLocation: (input: Omit<LocationEntry, "id">) => void;
  updateLocation: (id: number, patch: Partial<LocationEntry>) => void;
  deleteLocation: (id: number) => void;
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  updateSettings: (patch: Partial<PlatformSettings>) => void;
  updateAdminProfile: (patch: Partial<AdminProfile>) => void;
  resetDemoData: () => void;
  logActivity: (text: string, type?: AdminActivity["type"]) => void;
}

const AdminDataContext = createContext<AdminDataValue | null>(null);

/** Mock marketplace state shared by every admin page, persisted in localStorage. */
export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminData>(loadData);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage may be unavailable (private mode / quota) — the UI still works in memory.
    }
  }, [data]);

  const value: AdminDataValue = {
    data,

    addUser: (input) => {
      const created = { ...input, id: nextId(data.users) };
      setData((prev) => ({
        ...prev,
        users: [{ ...input, id: nextId(prev.users) }, ...prev.users],
        activities: withActivity(
          prev.activities,
          log(`New ${input.role} ${input.name} was added`, "user"),
        ),
      }));
      return created;
    },
    updateUser: (id, patch) =>
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        activities: withActivity(prev.activities, log(`User #${id} profile updated`, "user")),
      })),
    deleteUser: (id) =>
      setData((prev) => ({
        ...prev,
        users: prev.users.filter((u) => u.id !== id),
        activities: withActivity(prev.activities, log(`User #${id} was removed`, "user")),
      })),
    setUserStatus: (id, status) =>
      setData((prev) => ({
        ...prev,
        users: prev.users.map((u) => (u.id === id ? { ...u, status } : u)),
        activities: withActivity(
          prev.activities,
          log(`User #${id} account set to ${status}`, "user"),
        ),
      })),

    addListing: (input) => {
      const created = { ...input, id: nextId(data.listings) };
      setData((prev) => ({
        ...prev,
        listings: [{ ...input, id: nextId(prev.listings) }, ...prev.listings],
        activities: withActivity(prev.activities, log(`Listing "${input.title}" was created`, "listing")),
      }));
      return created;
    },
    updateListing: (id, patch) =>
      setData((prev) => ({
        ...prev,
        listings: prev.listings.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      })),
    setListingStatus: (id, status) =>
      setData((prev) => ({
        ...prev,
        listings: prev.listings.map((l) => (l.id === id ? { ...l, status, reports: status === "Active" || status === "Approved" ? 0 : l.reports } : l)),
        activities: withActivity(
          prev.activities,
          log(`Listing #${id} status changed to ${status}`, "listing"),
        ),
      })),
    toggleFeatured: (id) =>
      setData((prev) => ({
        ...prev,
        listings: prev.listings.map((l) =>
          l.id === id ? { ...l, featured: !l.featured } : l,
        ),
        activities: withActivity(prev.activities, log(`Listing #${id} featured flag toggled`, "listing")),
      })),
    deleteListing: (id) =>
      setData((prev) => ({
        ...prev,
        listings: prev.listings.filter((l) => l.id !== id),
        activities: withActivity(prev.activities, log(`Listing #${id} was deleted`, "listing")),
      })),

    updateReport: (id, patch) =>
      setData((prev) => ({
        ...prev,
        reports: prev.reports.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        activities: withActivity(prev.activities, log(`Complaint #${id} updated`, "report")),
      })),
    deleteReport: (id) =>
      setData((prev) => ({ ...prev, reports: prev.reports.filter((r) => r.id !== id) })),

    updateReview: (id, patch) =>
      setData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) => (r.id === id ? { ...r, ...patch } : r)),
        activities: withActivity(prev.activities, log(`Review #${id} moderated`, "review")),
      })),
    deleteReview: (id) =>
      setData((prev) => ({ ...prev, reviews: prev.reviews.filter((r) => r.id !== id) })),

    markEnquiryRead: (id) =>
      setData((prev) => ({
        ...prev,
        enquiries: prev.enquiries.map((e) => (e.id === id ? { ...e, unread: false } : e)),
      })),
    replyToEnquiry: (id, text) =>
      setData((prev) => ({
        ...prev,
        enquiries: prev.enquiries.map((e) =>
          e.id === id
            ? {
                ...e,
                unread: false,
                preview: text,
                messages: [
                  ...e.messages,
                  { from: "admin" as const, text, at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
                ],
              }
            : e,
        ),
        activities: withActivity(prev.activities, log(`Admin replied to enquiry #${id}`, "message")),
      })),
    deleteEnquiry: (id) =>
      setData((prev) => ({ ...prev, enquiries: prev.enquiries.filter((e) => e.id !== id) })),

    addLocation: (input) =>
      setData((prev) => ({
        ...prev,
        locations: [{ ...input, id: nextId(prev.locations) }, ...prev.locations],
        activities: withActivity(prev.activities, log(`Location ${input.town} added`, "system")),
      })),
    updateLocation: (id, patch) =>
      setData((prev) => ({
        ...prev,
        locations: prev.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
      })),
    deleteLocation: (id) =>
      setData((prev) => ({ ...prev, locations: prev.locations.filter((l) => l.id !== id) })),

    markNotificationRead: (id) =>
      setData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      })),
    markAllNotificationsRead: () =>
      setData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      })),

    updateSettings: (patch) =>
      setData((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
        activities: withActivity(prev.activities, log("Platform settings updated", "system")),
      })),
    updateAdminProfile: (patch) =>
      setData((prev) => ({ ...prev, adminProfile: { ...prev.adminProfile, ...patch } })),

    resetDemoData: () => setData(makeSeedData()),
    logActivity: (text, type = "system") =>
      setData((prev) => ({ ...prev, activities: withActivity(prev.activities, log(text, type)) })),
  };

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData(): AdminDataValue {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used inside AdminDataProvider");
  return ctx;
}
