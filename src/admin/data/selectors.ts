import type { AdminData } from "./types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function computeStats(data: AdminData) {
  const listings = data.listings;
  const count = (status: string) => listings.filter((l) => l.status === status).length;
  return {
    totalUsers: data.users.length,
    seekers: data.users.filter((u) => u.role === "seeker").length,
    owners: data.users.filter((u) => u.role === "owner").length,
    activeUsers: data.users.filter((u) => u.status === "Active").length,
    suspendedUsers: data.users.filter((u) => u.status === "Suspended").length,
    totalListings: listings.length,
    activeListings: count("Active"),
    approvedListings: count("Approved"),
    pendingListings: count("Pending"),
    rejectedListings: count("Rejected"),
    inactiveListings: count("Inactive"),
    reportedListings: count("Reported") + listings.filter((l) => l.reports > 0 && l.status !== "Reported").length,
    featuredListings: listings.filter((l) => l.featured).length,
    totalEnquiries: data.enquiries.length,
    unreadEnquiries: data.enquiries.filter((e) => e.unread).length,
    openReports: data.reports.filter((r) => r.status === "Open" || r.status === "In Review").length,
    resolvedReports: data.reports.filter((r) => r.status === "Resolved").length,
    reportedReviews: data.reviews.filter((r) => r.status === "Reported").length,
    totalViews: listings.reduce((sum, l) => sum + l.views, 0),
  };
}

function byMonth(dates: string[], year = 2026): number[] {
  const counts = Array.from({ length: 12 }, () => 0);
  dates.forEach((date) => {
    const [y, m] = date.split("-").map(Number);
    if (y === year && m >= 1 && m <= 12) counts[m - 1] += 1;
  });
  return counts;
}

export function registrationSeries(data: AdminData) {
  const seekerCounts = byMonth(data.users.filter((u) => u.role === "seeker").map((u) => u.joined));
  const ownerCounts = byMonth(data.users.filter((u) => u.role === "owner").map((u) => u.joined));
  return {
    labels: MONTHS,
    seekers: seekerCounts,
    owners: ownerCounts,
    total: seekerCounts.map((n, i) => n + ownerCounts[i]),
  };
}

export function listingSeries(data: AdminData) {
  const published = byMonth(data.listings.map((l) => l.submitted));
  return {
    labels: MONTHS,
    published,
    cumulative: published.reduce<number[]>((acc, n, i) => {
      acc.push((acc[i - 1] ?? 0) + n);
      return acc;
    }, []),
  };
}

export function districtCounts(data: AdminData) {
  const map = new Map<string, number>();
  data.listings.forEach((l) => map.set(l.district, (map.get(l.district) ?? 0) + 1));
  return Array.from(map, ([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
}

export function statusBreakdown(data: AdminData) {
  const statuses = ["Active", "Approved", "Pending", "Reported", "Inactive", "Rejected"] as const;
  const colors: Record<string, string> = {
    Active: "#1F9D57",
    Approved: "#4C30AC",
    Pending: "#F5A524",
    Reported: "#E5484D",
    Inactive: "#9C98AE",
    Rejected: "#E5484D",
  };
  return statuses.map((label) => ({
    label,
    value: data.listings.filter((l) => l.status === label).length,
    color: colors[label],
  }));
}
