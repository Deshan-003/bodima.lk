import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock3,
  Flag,
  LayoutDashboard,
  MapPin,
  MessageSquare,
  RotateCcw,
  Settings,
  Star,
  Store,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BarChart, ChartCard, DonutChart, LineChart } from "../components/charts";
import {
  Avatar,
  Badge,
  ConfirmDialog,
  EmptyState,
  ListingStatusBadge,
  PageHeader,
  SectionCard,
  StatCard,
  UserStatusBadge,
  cx,
  primaryBtn,
  secondaryBtn,
  useToast,
} from "../components/ui";
import {
  computeStats,
  listingSeries,
  registrationSeries,
  statusBreakdown,
} from "../data/selectors";
import { useAdminData } from "../data/store";
import type { AdminActivity } from "../data/types";

const ACTIVITY_ICONS: Record<AdminActivity["type"], LucideIcon> = {
  user: Users,
  listing: Building2,
  report: Flag,
  review: Star,
  message: MessageSquare,
  system: Settings,
};

const ACTIVITY_TONES: Record<AdminActivity["type"], string> = {
  user: "bg-lav text-primary-700",
  listing: "bg-[#DFF2E4] text-[#1F7A3D]",
  report: "bg-red-50 text-red-600",
  review: "bg-[#FFF3D6] text-[#97650B]",
  message: "bg-blue-50 text-blue-700",
  system: "bg-[#F0EFF5] text-night/60",
};

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-night/60">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export default function Dashboard() {
  const { data, resetDemoData } = useAdminData();
  const toast = useToast();
  const [resetOpen, setResetOpen] = useState(false);

  const stats = computeStats(data);
  const registration = registrationSeries(data);
  const listings = listingSeries(data);
  const breakdown = statusBreakdown(data);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const recentActivities = data.activities.slice(0, 6);
  const recentUsers = [...data.users]
    .sort((a, b) => b.joined.localeCompare(a.joined))
    .slice(0, 5);
  const recentListings = [...data.listings]
    .sort((a, b) => b.submitted.localeCompare(a.submitted))
    .slice(0, 5);

  const viewAllLink = (to: string) => (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary-700 transition hover:text-primary-900"
    >
      View all <ArrowRight size={15} strokeWidth={2.4} />
    </Link>
  );

  const quickLinkClass =
    "flex items-center gap-3 rounded-xl border border-primary-100 px-3.5 py-3 text-[13px] font-bold text-night transition hover:border-primary-700 hover:bg-lav";

  return (
    <div className="space-y-5">
      <PageHeader
        title={`${greeting}, Admin`}
        subtitle={today}
        actions={
          <>
            <Link to="/admin/listings/pending" className={primaryBtn}>
              <Clock3 size={16} strokeWidth={2.3} /> Review pending
            </Link>
            <Link to="/admin/reports" className={secondaryBtn}>
              <Flag size={16} strokeWidth={2.3} /> View reports
            </Link>
            <Link to="/admin/analytics" className={secondaryBtn}>
              <BarChart3 size={16} strokeWidth={2.3} /> Analytics
            </Link>
          </>
        }
      />

      {stats.pendingListings > 0 && (
        <Link
          to="/admin/listings/pending"
          className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#F5A524]/35 bg-[#FFF3D6] px-5 py-4 transition hover:border-[#F5A524]"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#97650B]">
            <AlertTriangle size={20} strokeWidth={2.3} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-extrabold text-[#7A5206]">
              {stats.pendingListings} {stats.pendingListings === 1 ? "listing" : "listings"} awaiting approval
            </span>
            <span className="mt-0.5 block text-[12px] font-medium text-[#97650B]/80">
              Review new boarding submissions to keep the marketplace accurate.
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-[#7A5206]">
            Review now <ArrowRight size={16} strokeWidth={2.4} />
          </span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          tone="violet"
          hint={`${stats.activeUsers} active · ${stats.suspendedUsers} suspended`}
        />
        <StatCard
          label="Seekers"
          value={stats.seekers}
          icon={UserRound}
          tone="blue"
          hint={stats.totalUsers ? `${Math.round((stats.seekers / stats.totalUsers) * 100)}% of all accounts` : "No accounts yet"}
        />
        <StatCard
          label="Owners"
          value={stats.owners}
          icon={Store}
          tone="green"
          hint="Property advertisers on the platform"
        />
        <StatCard
          label="Total Listings"
          value={stats.totalListings}
          icon={Building2}
          tone="violet"
          hint={`${stats.featuredListings} marked as featured`}
        />
        <StatCard
          label="Active Listings"
          value={stats.activeListings}
          icon={CheckCircle2}
          tone="green"
          hint={`${stats.approvedListings} approved · ${stats.inactiveListings} inactive`}
        />
        <StatCard
          label="Pending Listings"
          value={stats.pendingListings}
          icon={Clock3}
          tone="amber"
          hint="Waiting for your review"
        />
        <StatCard
          label="Reported Listings"
          value={stats.reportedListings}
          icon={Flag}
          tone="red"
          hint={`${stats.openReports} open complaints`}
        />
        <StatCard
          label="Total Enquiries"
          value={stats.totalEnquiries}
          icon={MessageSquare}
          tone="blue"
          hint={`${stats.unreadEnquiries} unread messages`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="User registrations"
            subtitle="New seekers and owners per month"
            legend={
              <div className="flex flex-wrap items-center gap-3">
                <LegendDot color="#6544E8" label="Seekers" />
                <LegendDot color="#F5A524" label="Owners" />
              </div>
            }
          >
            <LineChart
              labels={registration.labels}
              series={[
                { label: "Seekers", color: "#6544E8", values: registration.seekers },
                { label: "Owners", color: "#F5A524", values: registration.owners },
              ]}
              height={250}
            />
          </ChartCard>
        </div>

        <ChartCard title="Listing status" subtitle="Distribution across all listings">
          <DonutChart
            segments={breakdown}
            centerLabel="Listings"
            centerValue={stats.totalListings}
          />
        </ChartCard>

        <div className="lg:col-span-3">
          <ChartCard
            title="Monthly published listings"
            subtitle="Boarding advertisements submitted this year"
            legend={<LegendDot color="#6544E8" label="Published" />}
          >
            <BarChart
              data={listings.published.map((value, i) => ({
                label: listings.labels[i],
                value,
              }))}
              color="#6544E8"
              height={230}
            />
          </ChartCard>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Recent Activity" subtitle="Latest changes across the platform">
          {recentActivities.length ? (
            <ul className="divide-y divide-primary-50">
              {recentActivities.map((activity) => {
                const Icon = ACTIVITY_ICONS[activity.type];
                return (
                  <li key={activity.id} className="flex items-start gap-3 px-5 py-3.5 sm:px-6">
                    <span
                      className={cx(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                        ACTIVITY_TONES[activity.type],
                      )}
                    >
                      <Icon size={17} strokeWidth={2.2} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold leading-snug text-night">{activity.text}</p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-night/40">
                        {activity.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={LayoutDashboard}
              title="No activity yet"
              description="Platform changes will show up here as they happen."
            />
          )}
        </SectionCard>

        <SectionCard
          title="Recently Registered Users"
          subtitle="Five newest accounts"
          action={viewAllLink("/admin/users")}
        >
          {recentUsers.length ? (
            <ul className="divide-y divide-primary-50">
              {recentUsers.map((user) => (
                <li key={user.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6">
                  <Avatar name={user.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-night">{user.name}</p>
                    <p className="truncate text-[12px] font-medium text-night/50">{user.email}</p>
                  </div>
                  <div className="flex w-full flex-wrap items-center gap-1.5 sm:w-auto">
                    <Badge tone={user.role === "owner" ? "blue" : "violet"}>
                      {user.role === "owner" ? "Owner" : "Seeker"}
                    </Badge>
                    <UserStatusBadge status={user.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Users}
              title="No users yet"
              description="New registrations will appear here."
            />
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Recently Published Listings"
          subtitle="Five newest submissions"
          action={viewAllLink("/admin/listings")}
        >
          {recentListings.length ? (
            <ul className="divide-y divide-primary-50">
              {recentListings.map((listing) => (
                <li key={listing.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5 sm:px-6">
                  <img
                    src={listing.img}
                    alt=""
                    className="h-12 w-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-bold text-night">{listing.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[12px] font-medium text-night/50">
                      <MapPin size={12} className="shrink-0" /> {listing.district} · {listing.ownerName}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <ListingStatusBadge status={listing.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Building2}
              title="No listings yet"
              description="New boarding submissions will appear here."
            />
          )}
        </SectionCard>

        <SectionCard title="Quick Actions" subtitle="Jump to a common admin task">
          <div className="grid gap-2 p-5 sm:grid-cols-2 sm:p-6">
            <Link to="/admin/listings/pending" className={quickLinkClass}>
              <Clock3 size={17} className="shrink-0 text-[#97650B]" /> Review pending listings
            </Link>
            <Link to="/admin/reports" className={quickLinkClass}>
              <Flag size={17} className="shrink-0 text-red-500" /> Moderate reports
            </Link>
            <Link to="/admin/users" className={quickLinkClass}>
              <Users size={17} className="shrink-0 text-primary-700" /> Manage users
            </Link>
            <Link to="/admin/messages" className={quickLinkClass}>
              <MessageSquare size={17} className="shrink-0 text-blue-600" /> View enquiries
            </Link>
            <Link to="/admin/listings" className={quickLinkClass}>
              <Building2 size={17} className="shrink-0 text-[#1F7A3D]" /> All listings
            </Link>
            <Link to="/admin/analytics" className={quickLinkClass}>
              <BarChart3 size={17} className="shrink-0 text-primary-700" /> Full analytics
            </Link>
          </div>
          <div className="border-t border-primary-100 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => setResetOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-[13px] font-extrabold text-night/70 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw size={16} strokeWidth={2.3} /> Reset demo data
            </button>
            <p className="mt-2 text-[12px] font-medium text-night/50">
              Restores users, listings, reports and activity to the original demo dataset.
            </p>
          </div>
        </SectionCard>
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset demo data?"
        message="This replaces all current admin data with the original demo dataset. Any changes you have made will be lost."
        confirmLabel="Reset data"
        danger
        onConfirm={() => {
          resetDemoData();
          toast.success("Demo data has been reset to its original state.");
        }}
      />
    </div>
  );
}
