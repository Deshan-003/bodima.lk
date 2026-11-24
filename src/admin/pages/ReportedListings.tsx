import { useMemo, useState } from "react";
import {
  CheckCircle2,
  CircleCheck,
  Flag,
  ShieldOff,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import ListingTable, { ListingDetailModal } from "../components/ListingTable";
import {
  ConfirmDialog,
  PageHeader,
  SearchInput,
  SectionCard,
  StatCard,
  useToast,
} from "../components/ui";
import { useAdminData } from "../data/store";
import type { AdminListing } from "../data/types";

const PAGE_SIZE = 8;

export default function ReportedListings() {
  const toast = useToast();
  const { data, setListingStatus, deleteListing, updateReport, setUserStatus } = useAdminData();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState<AdminListing | null>(null);
  const [removing, setRemoving] = useState<AdminListing | null>(null);
  const [suspending, setSuspending] = useState<AdminListing | null>(null);

  const listingReports = useMemo(
    () => data.reports.filter((report) => report.type === "listing"),
    [data.reports],
  );

  const reported = useMemo(
    () =>
      data.listings.filter(
        (listing) => listing.status === "Reported" || listing.reports > 0,
      ),
    [data.listings],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reported;
    return reported.filter((listing) => {
      const reasons = listingReports
        .filter((report) => report.targetId === listing.id)
        .map((report) => report.reason)
        .join(" ");
      return [listing.title, listing.ownerName, listing.town, reasons]
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [reported, search, listingReports]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = {
    listings: reported.length,
    totalReports: listingReports.length,
    open: listingReports.filter((report) => report.status === "Open" || report.status === "In Review").length,
    resolved: listingReports.filter((report) => report.status === "Resolved" || report.status === "Dismissed").length,
  };

  const reportsFor = (listing: AdminListing) =>
    listingReports.filter((report) => report.targetId === listing.id);

  const keepLive = (listing: AdminListing) => {
    setListingStatus(listing.id, "Active");
    reportsFor(listing)
      .filter((report) => report.status === "Open" || report.status === "In Review")
      .forEach((report) =>
        updateReport(report.id, {
          status: "Resolved",
          notes: "Listing reviewed and kept live.",
        }),
      );
    toast.success(`Kept "${listing.title}" live and resolved its open complaints.`);
  };

  const confirmRemove = () => {
    if (!removing) return;
    deleteListing(removing.id);
    reportsFor(removing).forEach((report) =>
      updateReport(report.id, {
        status: "Dismissed",
        notes: "Listing removed from the marketplace by an administrator.",
      }),
    );
    toast.success(`Removed "${removing.title}" and dismissed its complaints.`);
    if (viewing?.id === removing.id) setViewing(null);
    setRemoving(null);
  };

  const confirmSuspend = () => {
    if (!suspending) return;
    setUserStatus(suspending.ownerId, "Suspended");
    toast.success(`Owner ${suspending.ownerName} was suspended.`);
    setSuspending(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reported Listings"
        subtitle="Investigate community complaints and decide what stays on the marketplace."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reported listings" value={stats.listings} hint="Listings flagged by the community" icon={Flag} tone="red" />
        <StatCard label="Total reports" value={stats.totalReports} hint="Complaints against listings" icon={TriangleAlert} tone="amber" />
        <StatCard label="Open complaints" value={stats.open} hint="Awaiting a moderation decision" icon={CircleCheck} tone="violet" />
        <StatCard label="Resolved complaints" value={stats.resolved} hint="Reviewed and closed" icon={CheckCircle2} tone="green" />
      </div>

      <SectionCard title="Search complaints">
        <div className="p-5">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search listing, owner or report reason"
            className="max-w-md"
          />
        </div>
      </SectionCard>

      <ListingTable
        listings={pageRows}
        reports={data.reports}
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
              onClick={() => keepLive(listing)}
              aria-label={`Keep listing ${listing.title} live`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-[12px] font-extrabold text-emerald-700 transition hover:bg-emerald-100"
            >
              <CheckCircle2 size={14} /> Keep live
            </button>
            <button
              type="button"
              onClick={() => setRemoving(listing)}
              aria-label={`Remove listing ${listing.title}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-extrabold text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={14} /> Remove
            </button>
            <button
              type="button"
              onClick={() => setSuspending(listing)}
              aria-label={`Suspend owner ${listing.ownerName}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-[12px] font-extrabold text-red-600 transition hover:bg-red-100"
            >
              <ShieldOff size={14} /> Suspend owner
            </button>
          </>
        )}
        emptyTitle="No reported listings — the marketplace is clean."
        emptyDescription="Community complaints about boardings will appear here for review."
      />

      <ListingDetailModal listing={viewing} onClose={() => setViewing(null)} reports={data.reports} />

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title="Remove this listing?"
        message={`"${removing?.title ?? ""}" will be deleted from the marketplace and its complaints will be dismissed.`}
        confirmLabel="Remove listing"
        danger
        onConfirm={confirmRemove}
      />

      <ConfirmDialog
        open={Boolean(suspending)}
        onClose={() => setSuspending(null)}
        title="Suspend this owner?"
        message={`The account of ${suspending?.ownerName ?? "this owner"} will be suspended. They will no longer be able to post or manage listings until reinstated.`}
        confirmLabel="Suspend owner"
        danger
        onConfirm={confirmSuspend}
      />
    </div>
  );
}
