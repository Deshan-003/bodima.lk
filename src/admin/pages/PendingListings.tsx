import { useMemo, useState } from "react";
import { Check, Clock3, Coins, FileClock, RotateCcw, X } from "lucide-react";
import ListingTable, { ListingDetailModal, formatDate, formatPrice } from "../components/ListingTable";
import {
  ConfirmDialog,
  PageHeader,
  SearchInput,
  SectionCard,
  SelectField,
  StatCard,
  secondaryBtn,
  useToast,
} from "../components/ui";
import { useAdminData } from "../data/store";
import type { AdminListing } from "../data/types";
import { DISTRICTS } from "../../data/locations";

const PAGE_SIZE = 8;
const SORT_OPTIONS = [
  { value: "oldest", label: "Oldest first" },
  { value: "newest", label: "Newest first" },
  { value: "price-high", label: "Rent: high to low" },
  { value: "price-low", label: "Rent: low to high" },
];

export default function PendingListings() {
  const toast = useToast();
  const { data, setListingStatus } = useAdminData();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [sort, setSort] = useState("oldest");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminListing | null>(null);
  const [rejecting, setRejecting] = useState<AdminListing | null>(null);

  const pending = useMemo(
    () => data.listings.filter((listing) => listing.status === "Pending"),
    [data.listings],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = pending.filter((listing) => {
      if (district && listing.district !== district) return false;
      if (query && ![listing.title, listing.ownerName, listing.town].some((value) => value.toLowerCase().includes(query)))
        return false;
      return true;
    });
    const sorted = [...rows];
    if (sort === "newest") sorted.sort((a, b) => b.submitted.localeCompare(a.submitted));
    else if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    else sorted.sort((a, b) => a.submitted.localeCompare(b.submitted));
    return sorted;
  }, [pending, search, district, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const oldest = pending.reduce<string>(
    (min, listing) => (!min || listing.submitted < min ? listing.submitted : min),
    "",
  );
  const requestedValue = pending.reduce((sum, listing) => sum + listing.price, 0);

  const resetFilters = () => {
    setSearch("");
    setDistrict("");
    setSort("oldest");
    setPage(1);
  };

  const approve = (listing: AdminListing) => {
    setListingStatus(listing.id, "Approved");
    toast.success(`Approved "${listing.title}". It is now ready to go live.`);
  };

  const confirmReject = () => {
    if (!rejecting) return;
    setListingStatus(rejecting.id, "Rejected");
    toast.info(`Rejected "${rejecting.title}". The owner's submission was declined.`);
    setRejecting(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Listings"
        subtitle="Approve or reject new boarding submissions before they reach the marketplace."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Awaiting review" value={pending.length} hint="New submissions in the queue" icon={Clock3} tone="amber" />
        <StatCard label="Oldest submission" value={oldest ? formatDate(oldest) : "—"} hint="First in the queue" icon={FileClock} tone="violet" />
        <StatCard label="Requested rent value" value={formatPrice(requestedValue)} hint="Total monthly rent pending approval" icon={Coins} tone="green" />
      </div>

      <SectionCard
        title="Filter queue"
        action={
          <button type="button" className={secondaryBtn} onClick={resetFilters}>
            <RotateCcw size={15} /> Reset
          </button>
        }
      >
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search title, owner or town"
          />
          <SelectField
            value={district}
            onChange={(value) => {
              setDistrict(value);
              setPage(1);
            }}
            options={DISTRICTS.filter((name) => name !== "All Districts").map((name) => ({ value: name, label: name }))}
            placeholder="All districts"
            ariaLabel="Filter by district"
          />
          <SelectField
            value={sort}
            onChange={(value) => {
              setSort(value);
              setPage(1);
            }}
            options={SORT_OPTIONS}
            ariaLabel="Sort pending listings"
          />
        </div>
      </SectionCard>

      <ListingTable
        listings={pageRows}
        reports={data.reports}
        showStatusColumn={false}
        showReportsColumn={false}
        compact
        page={currentPage}
        pageCount={pageCount}
        total={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onView={setViewing}
        extraActions={(listing) => (
          <>
            <button
              type="button"
              onClick={() => approve(listing)}
              aria-label={`Approve listing ${listing.title}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <Check size={14} /> Approve
            </button>
            <button
              type="button"
              onClick={() => setRejecting(listing)}
              aria-label={`Reject listing ${listing.title}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-extrabold text-red-600 transition hover:bg-red-100"
            >
              <X size={14} /> Reject
            </button>
          </>
        )}
        emptyTitle={
          pending.length === 0
            ? "No pending listings — everything is reviewed."
            : "No pending listings match your filters"
        }
        emptyDescription={
          pending.length === 0
            ? "New submissions from property owners will appear here for moderation."
            : "Try another search or reset the filters."
        }
        emptyAction={
          pending.length > 0 ? (
            <button type="button" className={secondaryBtn} onClick={resetFilters}>
              Clear filters
            </button>
          ) : undefined
        }
      />

      <ListingDetailModal listing={viewing} onClose={() => setViewing(null)} reports={data.reports} />

      <ConfirmDialog
        open={Boolean(rejecting)}
        onClose={() => setRejecting(null)}
        title="Reject this listing?"
        message={`The submission "${rejecting?.title ?? ""}" will be marked as rejected and will not be published.`}
        confirmLabel="Reject listing"
        danger
        onConfirm={confirmReject}
      />
    </div>
  );
}
