import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ban,
  Building2,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  Flag,
  MapPin,
  Store,
  Users as UsersIcon,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { AdminUser } from "../data/types";
import {
  Avatar,
  DataTable,
  EmptyState,
  ListingStatusBadge,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  SectionCard,
  SelectField,
  StatCard,
  UserStatusBadge,
  secondaryBtn,
  type Column,
} from "../components/ui";
import {
  DISTRICT_OPTIONS,
  PAGE_SIZE,
  ResetButton,
  SORT_OPTIONS,
  STATUS_OPTIONS,
  UserProfileDetails,
  UserRowActions,
  formatDate,
  matchesSearch,
  sortUsers,
  useUserModals,
} from "./Users";

export default function Owners() {
  const { data } = useAdminData();
  const { requestStatus, requestDelete, dialogs } = useUserModals();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const owners = useMemo(() => data.users.filter((user) => user.role === "owner"), [data.users]);
  const activeCount = owners.filter((user) => user.status === "Active").length;
  const suspendedCount = owners.filter((user) => user.status === "Suspended").length;
  const listingsFor = (user: AdminUser) =>
    data.listings.filter(
      (listing) => listing.ownerId === user.id || listing.ownerName === user.name,
    );
  const totalOwnerListings = owners.reduce((sum, owner) => sum + listingsFor(owner).length, 0);

  const filtered = useMemo(() => {
    const rows = owners.filter(
      (user) =>
        matchesSearch(user, search) &&
        (status === "All" || user.status === status) &&
        (district === "All Districts" || user.district === district),
    );
    return sortUsers(rows, sort);
  }, [owners, search, status, district, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const viewing = owners.find((user) => user.id === viewingId) ?? null;
  const published = viewing ? listingsFor(viewing) : [];
  const pendingCount = published.filter((listing) => listing.status === "Pending").length;
  const reportedCount = published.filter(
    (listing) => listing.status === "Reported" || listing.reports > 0,
  ).length;

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setDistrict("All Districts");
    setSort("newest");
    setPage(1);
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "owner",
      header: "Owner",
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-extrabold text-night">{user.name}</p>
            <p className="truncate text-[12px] font-medium text-night/55">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "properties",
      header: "Properties",
      render: (user) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-night/75">
          <Building2 size={14} className="text-primary-700" /> {listingsFor(user).length}
        </span>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (user) => (
        <div>
          <p className="text-[13px] font-bold text-night">{user.town}</p>
          <p className="text-[12px] font-medium text-night/50">{user.district}</p>
        </div>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (user) => (
        <span className="text-[13px] font-medium text-night/70">{formatDate(user.joined)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: "activity",
      header: "Activity",
      render: (user) => {
        const listings = listingsFor(user);
        const views = listings.reduce((sum, listing) => sum + listing.views, 0);
        const enquiries = listings.reduce((sum, listing) => sum + listing.enquiries, 0);
        return (
          <div>
            <p className="text-[12px] font-bold text-night/75">
              {views.toLocaleString()} total views
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-night/50">
              {enquiries} enquiries across {listings.length} properties
            </p>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <UserRowActions
          user={user}
          onView={(row) => setViewingId(row.id)}
          onStatus={requestStatus}
          onDelete={requestDelete}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Owners"
        subtitle="Property advertisers — their listings, performance and account standing."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total owners" value={owners.length} icon={UsersIcon} tone="violet" hint="Registered accounts" />
        <StatCard label="Active" value={activeCount} icon={CheckCircle2} tone="green" hint="Can publish ads" />
        <StatCard label="Suspended" value={suspendedCount} icon={Ban} tone="red" hint="Access restricted" />
        <StatCard label="Owner listings" value={totalOwnerListings} icon={Building2} tone="blue" hint="Across all owner accounts" />
      </div>

      <SectionCard
        title="Owner directory"
        subtitle={`${filtered.length} of ${owners.length} owners`}
        action={<ResetButton onClick={resetFilters} />}
      >
        <div className="grid gap-3 border-b border-primary-100 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search name, email or phone"
          />
          <SelectField
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={STATUS_OPTIONS}
            ariaLabel="Filter by status"
          />
          <SelectField
            value={district}
            onChange={(value) => {
              setDistrict(value);
              setPage(1);
            }}
            options={DISTRICT_OPTIONS}
            ariaLabel="Filter by district"
          />
          <SelectField value={sort} onChange={setSort} options={SORT_OPTIONS} ariaLabel="Sort owners" />
        </div>

        <DataTable
          columns={columns}
          rows={pageRows}
          emptyIcon={Store}
          emptyTitle="No owners found"
          emptyDescription="Try a different search term or reset the filters."
          empty={
            <EmptyState
              icon={Store}
              title="No owners found"
              description="Try a different search term or reset the filters."
              action={<ResetButton onClick={resetFilters} />}
            />
          }
        />
        <Pagination
          page={safePage}
          pageCount={pageCount}
          onPageChange={setPage}
          total={filtered.length}
          pageSize={PAGE_SIZE}
        />
      </SectionCard>

      <Modal
        open={viewing !== null}
        onClose={() => setViewingId(null)}
        title="Owner profile"
        subtitle={viewing ? `${viewing.email} · Account #${viewing.id}` : undefined}
        maxWidth="max-w-2xl"
        footer={
          <>
            {viewing && (
              <Link
                to={`/admin/listings?owner=${viewing.id}`}
                className={secondaryBtn}
                onClick={() => setViewingId(null)}
              >
                <ExternalLink size={15} /> Manage all listings
              </Link>
            )}
            <button type="button" className={secondaryBtn} onClick={() => setViewingId(null)}>
              Close
            </button>
          </>
        }
      >
        {viewing && (
          <UserProfileDetails user={viewing}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-amber-50 px-4 py-3">
                <p className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wide text-amber-700">
                  <Clock3 size={14} /> Pending ads
                </p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-night">{pendingCount}</p>
              </div>
              <div className="rounded-xl bg-red-50 px-4 py-3">
                <p className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-wide text-red-600">
                  <Flag size={14} /> Reported properties
                </p>
                <p className="mt-1 text-[22px] font-extrabold leading-none text-night">{reportedCount}</p>
              </div>
            </div>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="flex items-center gap-2 text-[15px] font-extrabold text-night">
                  <Building2 size={16} className="text-primary-700" /> Published properties
                  <span className="rounded-full bg-lav px-2.5 py-0.5 text-[12px] font-extrabold text-primary-700">
                    {published.length}
                  </span>
                </h4>
                <span className="text-[12px] font-medium text-night/50">
                  <MapPin size={12} className="mr-1 inline" />
                  {viewing.town}, {viewing.district}
                </span>
              </div>

              {published.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {published.map((listing) => (
                    <li
                      key={listing.id}
                      className="flex items-center gap-3 rounded-xl border border-primary-100 p-2.5"
                    >
                      <img
                        src={listing.img}
                        alt=""
                        loading="lazy"
                        className="h-14 w-20 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-extrabold text-night">
                          {listing.title}
                        </p>
                        <p className="mt-0.5 text-[12px] font-bold text-primary-700">
                          Rs. {listing.price.toLocaleString()}
                          <span className="ml-2 font-medium text-night/50">/ month</span>
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <ListingStatusBadge status={listing.status} />
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-night/55">
                            <Eye size={12} /> {listing.views.toLocaleString()} views
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={Building2}
                  title="No properties yet"
                  description="This owner has not submitted any boarding listings."
                />
              )}
            </section>
          </UserProfileDetails>
        )}
      </Modal>

      {dialogs}
    </div>
  );
}
