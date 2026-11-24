import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  Eye,
  Flag,
  MapPin,
  Star,
  UserRound,
  UserX,
  Users,
  type LucideIcon,
} from "lucide-react";
import { BarChart, ChartCard, DonutChart, LineChart, ProgressBar } from "../components/charts";
import {
  DataTable,
  PageHeader,
  StatCard,
  cardClass,
  cx,
  type Column,
} from "../components/ui";
import {
  computeStats,
  districtCounts,
  listingSeries,
  registrationSeries,
  statusBreakdown,
} from "../data/selectors";
import { useAdminData } from "../data/store";

const RANGES = [
  { key: "12", label: "All 12 months" },
  { key: "6", label: "Last 6 months" },
] as const;

type RangeKey = (typeof RANGES)[number]["key"];

type LocationRow = {
  id: string;
  district: string;
  listings: number;
  views: number;
  enquiries: number;
};

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-night/60">
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

export default function Analytics() {
  const { data } = useAdminData();
  const [range, setRange] = useState<RangeKey>("12");

  const stats = computeStats(data);
  const registration = registrationSeries(data);
  const listings = listingSeries(data);
  const breakdown = statusBreakdown(data);
  const districtRows = districtCounts(data);

  const start = range === "6" ? 6 : 0;
  const labels = registration.labels.slice(start);
  const seekers = registration.seekers.slice(start);
  const owners = registration.owners.slice(start);
  const totals = registration.total.slice(start);
  const published = listings.published.slice(start);
  const cumulative = listings.cumulative.slice(start);
  const period = `${labels[0]} – ${labels[labels.length - 1]}`;

  // The most recent month that actually contains data, rather than an empty future month.
  const latestMonthIndex = registration.total.reduce(
    (last, count, i) => (count > 0 ? i : last),
    0,
  );
  const monthLabel = registration.labels[latestMonthIndex];
  const newUsersThisMonth = registration.total[latestMonthIndex] ?? 0;
  const publishedThisMonth = listings.published[latestMonthIndex] ?? 0;

  const locationRows: LocationRow[] = Array.from(
    data.listings.reduce((map, listing) => {
      const row = map.get(listing.district) ?? {
        id: listing.district,
        district: listing.district,
        listings: 0,
        views: 0,
        enquiries: 0,
      };
      row.listings += 1;
      row.views += listing.views;
      row.enquiries += listing.enquiries;
      map.set(listing.district, row);
      return map;
    }, new Map<string, LocationRow>()),
  )
    .map(([, row]) => row)
    .sort((a, b) => b.listings - a.listings);

  const locationColumns: Column<LocationRow>[] = [
    {
      key: "district",
      header: "District",
      render: (row) => <span className="text-[13px] font-extrabold text-night">{row.district}</span>,
    },
    {
      key: "listings",
      header: "Listings",
      render: (row) => <span className="text-[13px] font-bold text-night">{row.listings}</span>,
    },
    {
      key: "views",
      header: "Total views",
      render: (row) => (
        <span className="text-[13px] font-bold text-night">{row.views.toLocaleString()}</span>
      ),
    },
    {
      key: "enquiries",
      header: "Enquiries",
      render: (row) => <span className="text-[13px] font-bold text-night">{row.enquiries}</span>,
    },
    {
      key: "share",
      header: "Share of listings",
      render: (row) => {
        const share = stats.totalListings
          ? Math.round((row.listings / stats.totalListings) * 100)
          : 0;
        return (
          <div className="flex items-center gap-3">
            <ProgressBar
              value={row.listings}
              total={stats.totalListings}
              className="min-w-[80px] flex-1"
            />
            <span className="w-10 shrink-0 text-right text-[12px] font-extrabold text-night/60">
              {share}%
            </span>
          </div>
        );
      },
    },
  ];

  const moderation: Array<{
    label: string;
    value: number;
    total: number;
    caption: string;
    color: string;
    icon: LucideIcon;
    to: string;
  }> = [
    {
      label: "Open reports",
      value: stats.openReports,
      total: data.reports.length,
      caption: "complaints",
      color: "#E5484D",
      icon: Flag,
      to: "/admin/reports",
    },
    {
      label: "Reported listings",
      value: stats.reportedListings,
      total: stats.totalListings,
      caption: "listings",
      color: "#F5A524",
      icon: Building2,
      to: "/admin/listings/reported",
    },
    {
      label: "Reported reviews",
      value: stats.reportedReviews,
      total: data.reviews.length,
      caption: "reviews",
      color: "#6544E8",
      icon: Star,
      to: "/admin/reviews",
    },
    {
      label: "Suspended users",
      value: stats.suspendedUsers,
      total: stats.totalUsers,
      caption: "accounts",
      color: "#9C98AE",
      icon: UserX,
      to: "/admin/users",
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Analytics"
        subtitle="Live marketplace metrics derived from the current admin data"
        actions={
          <div
            className="inline-flex rounded-xl border border-primary-100 bg-white p-1"
            role="group"
            aria-label="Chart time range"
          >
            {RANGES.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-pressed={range === item.key}
                onClick={() => setRange(item.key)}
                className={cx(
                  "rounded-lg px-3 py-2 text-[13px] font-bold transition",
                  range === item.key
                    ? "bg-primary-700 text-white shadow-cta"
                    : "text-night/55 hover:bg-lav hover:text-night",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          tone="violet"
          hint={`${stats.seekers} seekers · ${stats.owners} owners`}
        />
        <StatCard
          label="New Users This Month"
          value={newUsersThisMonth}
          icon={UserRound}
          tone="blue"
          hint={`Signed up in ${monthLabel}`}
        />
        <StatCard
          label="Total Listings"
          value={stats.totalListings}
          icon={Building2}
          tone="violet"
          hint={`${stats.featuredListings} featured`}
        />
        <StatCard
          label="Published This Month"
          value={publishedThisMonth}
          icon={CheckCircle2}
          tone="green"
          hint={`Submitted in ${monthLabel}`}
        />
        <StatCard
          label="Total Views"
          value={stats.totalViews.toLocaleString()}
          icon={Eye}
          tone="amber"
          hint="Across all listings"
        />
        <StatCard
          label="Open Reports"
          value={stats.openReports}
          icon={Flag}
          tone="red"
          hint={`${stats.reportedReviews} reported reviews`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <ChartCard
            title="User registration trend"
            subtitle={`Seekers, owners and combined sign-ups · ${period}`}
            legend={
              <div className="flex flex-wrap items-center gap-3">
                <LegendDot color="#6544E8" label="Seekers" />
                <LegendDot color="#F5A524" label="Owners" />
                <LegendDot color="#1F9D57" label="Total" />
              </div>
            }
          >
            <LineChart
              labels={labels}
              series={[
                { label: "Seekers", color: "#6544E8", values: seekers },
                { label: "Owners", color: "#F5A524", values: owners },
                { label: "Total", color: "#1F9D57", values: totals },
              ]}
              height={300}
            />
          </ChartCard>
        </div>

        <ChartCard
          title="Listings by district"
          subtitle="Where marketplace supply is concentrated"
          legend={<LegendDot color="#6544E8" label="Listings" />}
        >
          <BarChart data={districtRows} color="#6544E8" height={270} />
        </ChartCard>

        <ChartCard
          title="Cumulative listings"
          subtitle={`Total listings submitted · ${period}`}
          legend={<LegendDot color="#271B63" label="Cumulative" />}
        >
          <LineChart
            labels={labels}
            series={[{ label: "Cumulative", color: "#271B63", values: cumulative }]}
            height={270}
          />
        </ChartCard>

        <ChartCard title="Listing status breakdown" subtitle="Current review and publishing state">
          <DonutChart
            segments={breakdown}
            centerLabel="Listings"
            centerValue={stats.totalListings}
          />
        </ChartCard>

        <ChartCard
          title="Monthly published listings"
          subtitle={`New submissions · ${period}`}
          legend={<LegendDot color="#F0B429" label="Published" />}
        >
          <BarChart
            data={published.map((value, i) => ({ label: labels[i], value }))}
            color="#F0B429"
            height={270}
          />
        </ChartCard>
      </div>

      <section className="overflow-hidden rounded-2xl bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-[17px] font-extrabold text-night">Location performance</h2>
            <p className="mt-1 text-[13px] font-medium text-night/55">
              Views and enquiries grouped by district
            </p>
          </div>
          <Link
            to="/admin/locations"
            className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary-700 transition hover:text-primary-900"
          >
            Manage locations <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </div>
        <DataTable
          columns={locationColumns}
          rows={locationRows}
          emptyIcon={MapPin}
          emptyTitle="No listings yet"
          emptyDescription="Location performance will appear once listings are added."
        />
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-extrabold text-night">Moderation overview</h2>
            <p className="mt-1 text-[13px] font-medium text-night/55">
              Items that need attention across the marketplace
            </p>
          </div>
          <Link
            to="/admin/reports"
            className="inline-flex items-center gap-1 text-[13px] font-extrabold text-primary-700 transition hover:text-primary-900"
          >
            Manage reports <ArrowRight size={15} strokeWidth={2.4} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {moderation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cx(cardClass, "block p-5 transition hover:shadow-bar")}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-night/55">{item.label}</p>
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  >
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                </div>
                <p className="mt-3 text-[26px] font-extrabold leading-none text-night">{item.value}</p>
                <ProgressBar value={item.value} total={item.total} color={item.color} className="mt-3" />
                <p className="mt-2 text-[12px] font-medium text-night/50">
                  {item.value} of {item.total} {item.caption}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="flex items-center gap-1.5 text-[12px] font-medium text-night/45">
        <BarChart3 size={14} /> Figures update automatically as admin data changes.
      </p>
    </div>
  );
}
