import { useMemo, useState } from "react";
import {
  Ban,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { AdminUser } from "../data/types";
import {
  Avatar,
  DataTable,
  EmptyState,
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

export default function Seekers() {
  const { data } = useAdminData();
  const { requestStatus, requestDelete, dialogs } = useUserModals();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [viewingId, setViewingId] = useState<number | null>(null);

  const seekers = useMemo(() => data.users.filter((user) => user.role === "seeker"), [data.users]);
  const activeCount = seekers.filter((user) => user.status === "Active").length;
  const suspendedCount = seekers.filter((user) => user.status === "Suspended").length;
  const pendingCount = seekers.filter((user) => user.status === "Pending").length;

  const filtered = useMemo(() => {
    const rows = seekers.filter(
      (user) =>
        matchesSearch(user, search) &&
        (status === "All" || user.status === status) &&
        (district === "All Districts" || user.district === district),
    );
    return sortUsers(rows, sort);
  }, [seekers, search, status, district, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const viewing = seekers.find((user) => user.id === viewingId) ?? null;
  const enquiryHistory = viewing
    ? data.enquiries.filter((enquiry) => enquiry.seeker === viewing.name)
    : [];
  const suggestions = viewing
    ? data.listings
        .filter(
          (listing) =>
            listing.town === viewing.town || listing.district === viewing.district,
        )
        .slice(0, 3)
    : [];

  const resetFilters = () => {
    setSearch("");
    setStatus("All");
    setDistrict("All Districts");
    setSort("newest");
    setPage(1);
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "seeker",
      header: "Seeker",
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
      key: "saved",
      header: "Saved",
      render: (user) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-night/75">
          <Bookmark size={14} className="text-primary-700" /> {user.saved}
        </span>
      ),
    },
    {
      key: "enquiries",
      header: "Enquiries",
      render: (user) => (
        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-night/75">
          <MessageSquare size={14} className="text-primary-700" /> {user.enquiries}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (user) => <UserStatusBadge status={user.status} />,
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
        title="Seekers"
        subtitle="People looking for boarding places — profiles, saved searches and enquiry history."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total seekers" value={seekers.length} icon={UserRound} tone="violet" hint="Registered accounts" />
        <StatCard label="Active" value={activeCount} icon={CheckCircle2} tone="green" hint="Can use the platform" />
        <StatCard label="Suspended" value={suspendedCount} icon={Ban} tone="red" hint="Access restricted" />
        <StatCard label="Pending" value={pendingCount} icon={Clock3} tone="amber" hint="Awaiting activation" />
      </div>

      <SectionCard
        title="Seeker directory"
        subtitle={`${filtered.length} of ${seekers.length} seekers`}
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
            className="lg:col-span-1"
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
          <SelectField value={sort} onChange={setSort} options={SORT_OPTIONS} ariaLabel="Sort seekers" />
        </div>

        <DataTable
          columns={columns}
          rows={pageRows}
          emptyIcon={UserRound}
          emptyTitle="No seekers found"
          emptyDescription="Try a different search term or reset the filters."
          empty={
            <EmptyState
              icon={UserRound}
              title="No seekers found"
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
        title="Seeker profile"
        subtitle={viewing ? `${viewing.email} · Account #${viewing.id}` : undefined}
        maxWidth="max-w-2xl"
        footer={
          <button type="button" className={secondaryBtn} onClick={() => setViewingId(null)}>
            Close
          </button>
        }
      >
        {viewing && (
          <UserProfileDetails user={viewing}>
            <section>
              <div className="flex items-center justify-between gap-3">
                <h4 className="flex items-center gap-2 text-[15px] font-extrabold text-night">
                  <Bookmark size={16} className="text-primary-700" /> Saved properties
                </h4>
                <span className="rounded-full bg-lav px-3 py-1 text-[12px] font-extrabold text-primary-700">
                  {viewing.saved} recorded
                </span>
              </div>
              <p className="mt-1 text-[12px] font-medium text-night/55">
                Number of saved properties recorded for this seeker.
              </p>
              <p className="mt-4 flex items-center gap-2 text-[13px] font-extrabold text-night">
                <MapPin size={15} className="text-primary-700" /> Suggested in your area
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-night/50">
                Based on the seeker&apos;s town or district — not saved items.
              </p>
              {suggestions.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {suggestions.map((listing) => (
                    <li
                      key={listing.id}
                      className="flex items-center gap-3 rounded-xl border border-primary-100 p-2.5"
                    >
                      <img
                        src={listing.img}
                        alt=""
                        loading="lazy"
                        className="h-12 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-night">{listing.title}</p>
                        <p className="mt-0.5 text-[12px] font-medium text-night/55">
                          {listing.town}, {listing.district}
                        </p>
                      </div>
                      <span className="shrink-0 text-[12px] font-extrabold text-primary-700">
                        Rs. {listing.price.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl bg-page px-4 py-3 text-[13px] font-medium text-night/55">
                  No listings match this seeker&apos;s area yet.
                </p>
              )}
            </section>

            <section>
              <h4 className="flex items-center gap-2 text-[15px] font-extrabold text-night">
                <MessageSquare size={16} className="text-primary-700" /> Enquiry history
                <span className="rounded-full bg-lav px-2.5 py-0.5 text-[12px] font-extrabold text-primary-700">
                  {enquiryHistory.length}
                </span>
              </h4>
              {enquiryHistory.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {enquiryHistory.map((enquiry) => (
                    <li key={enquiry.id} className="rounded-xl border border-primary-100 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[13px] font-extrabold text-night">{enquiry.listingTitle}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-night/50">
                          <CalendarDays size={12} /> {formatDate(enquiry.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-[12px] font-medium leading-relaxed text-night/65">
                        &ldquo;{enquiry.preview}&rdquo;
                      </p>
                      {enquiry.unread && (
                        <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-extrabold text-amber-700">
                          Unread
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState
                  icon={Eye}
                  title="No enquiries yet"
                  description="This seeker has not sent any enquiries recorded in the admin console."
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
