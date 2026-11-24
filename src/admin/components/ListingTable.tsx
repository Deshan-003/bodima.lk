import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Check,
  Eye,
  Flag,
  ImageOff,
  MessageSquare,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { AdminListing, ListingStatus, Report } from "../data/types";
import {
  Badge,
  DataTable,
  EmptyState,
  ListingStatusBadge,
  Modal,
  Pagination,
  SelectField,
  cardClass,
  cx,
  iconBtn,
  secondaryBtn,
  type Column,
} from "./ui";

const STATUSES: ListingStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Active",
  "Inactive",
  "Reported",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Format an ISO date (YYYY-MM-DD) as a short, human-readable date. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

export function formatPrice(price: number): string {
  return `Rs. ${price.toLocaleString("en-LK")}`;
}

function reportsFor(listing: AdminListing, reports: Report[]): Report[] {
  return reports.filter((report) => report.type === "listing" && report.targetId === listing.id);
}

export interface ListingTableProps {
  listings: AdminListing[];
  reports?: Report[];
  showStatusColumn?: boolean;
  showReportsColumn?: boolean;
  compact?: boolean;
  page?: number;
  pageCount?: number;
  total?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onApprove?: (listing: AdminListing) => void;
  onReject?: (listing: AdminListing) => void;
  onFeature?: (listing: AdminListing) => void;
  onStatusChange?: (listing: AdminListing, status: ListingStatus) => void;
  onDelete?: (listing: AdminListing) => void;
  onView?: (listing: AdminListing) => void;
  extraActions?: (listing: AdminListing) => ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

/**
 * Shared listings grid used by the All / Pending / Reported admin pages.
 * Rendering, pagination and row actions are centralised here; each page owns
 * its own data filtering and the behaviour behind every callback.
 */
export default function ListingTable({
  listings,
  reports = [],
  showStatusColumn = true,
  showReportsColumn = true,
  compact = false,
  page = 1,
  pageCount,
  total,
  pageSize,
  onPageChange,
  onApprove,
  onReject,
  onFeature,
  onStatusChange,
  onDelete,
  onView,
  extraActions,
  emptyTitle = "No listings found",
  emptyDescription,
  emptyAction,
}: ListingTableProps) {
  const columns: Column<AdminListing>[] = [
    {
      key: "property",
      header: "Property",
      className: "min-w-[250px]",
      render: (listing) => (
        <div className="flex items-center gap-3">
          <img
            src={listing.img || listing.gallery?.[0] || ""}
            alt=""
            className="h-12 w-14 shrink-0 rounded-lg bg-lav object-cover"
          />
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onView?.(listing)}
              aria-label={`View details for ${listing.title}`}
              className="block max-w-[230px] truncate text-left text-[13.5px] font-extrabold text-night hover:text-primary-700 hover:underline"
            >
              {listing.title}
            </button>
            <p className="mt-0.5 truncate text-[12px] font-medium text-night/50">
              {listing.town || listing.location} · {listing.district}
            </p>
          </div>
          {listing.featured && (
            <Star size={14} fill="currentColor" className="shrink-0 text-accent" aria-label="Featured" />
          )}
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (listing) => (
        <Link
          to="/admin/users/owners"
          aria-label={`View owners — listing by ${listing.ownerName}`}
          className="text-[13px] font-bold text-night/75 hover:text-primary-700 hover:underline"
        >
          {listing.ownerName}
        </Link>
      ),
    },
    {
      key: "price",
      header: "Rent / month",
      render: (listing) => (
        <span className="whitespace-nowrap text-[13px] font-extrabold text-night">
          {formatPrice(listing.price)}
        </span>
      ),
    },
    ...(showStatusColumn
      ? [
          {
            key: "status",
            header: "Status",
            render: (listing: AdminListing) => <ListingStatusBadge status={listing.status} />,
          } satisfies Column<AdminListing>,
        ]
      : []),
    ...(showReportsColumn
      ? [
          {
            key: "reports",
            header: "Reports",
            render: (listing: AdminListing) => {
              const linked = reportsFor(listing, reports);
              const reasons = linked.map((report) => report.reason).join(", ");
              return (
                <div className="min-w-[110px]">
                  {listing.reports > 0 || linked.length > 0 ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[11px] font-extrabold text-red-600"
                      title={reasons || "Reported by users"}
                    >
                      <Flag size={12} /> {Math.max(listing.reports, linked.length)}
                    </span>
                  ) : (
                    <span className="text-[12px] font-medium text-night/35">—</span>
                  )}
                  {!compact && reasons && (
                    <p className="mt-1 max-w-[160px] truncate text-[11px] font-medium text-night/50" title={reasons}>
                      {reasons}
                    </p>
                  )}
                </div>
              );
            },
          } satisfies Column<AdminListing>,
        ]
      : []),
    {
      key: "performance",
      header: "Views / Enquiries",
      render: (listing) => (
        <div className="flex flex-col gap-1 text-[12px] font-semibold text-night/65">
          <span className="inline-flex items-center gap-1.5">
            <Eye size={13} className="text-night/40" /> {listing.views}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare size={13} className="text-night/40" /> {listing.enquiries}
          </span>
        </div>
      ),
    },
    ...(compact
      ? []
      : [
          {
            key: "submitted",
            header: "Submitted",
            render: (listing: AdminListing) => (
              <span className="whitespace-nowrap text-[12px] font-semibold text-night/60">
                {formatDate(listing.submitted)}
              </span>
            ),
          } satisfies Column<AdminListing>,
        ]),
    {
      key: "actions",
      header: "Actions",
      className: "min-w-[210px]",
      render: (listing) => (
        <div className="flex flex-wrap items-center gap-1.5">
          {onView && (
            <button
              type="button"
              onClick={() => onView(listing)}
              aria-label={`View details of ${listing.title}`}
              title="View details"
              className={iconBtn}
            >
              <Eye size={16} />
            </button>
          )}
          {onApprove && listing.status !== "Approved" && (
            <button
              type="button"
              onClick={() => onApprove(listing)}
              aria-label={`Approve listing ${listing.title}`}
              title="Approve listing"
              className={cx(iconBtn, "text-emerald-600 hover:bg-emerald-50")}
            >
              <Check size={16} />
            </button>
          )}
          {onReject && listing.status !== "Rejected" && (
            <button
              type="button"
              onClick={() => onReject(listing)}
              aria-label={`Reject listing ${listing.title}`}
              title="Reject listing"
              className={cx(iconBtn, "text-red-600 hover:bg-red-50")}
            >
              <X size={16} />
            </button>
          )}
          {onFeature && (
            <button
              type="button"
              onClick={() => onFeature(listing)}
              aria-label={`${listing.featured ? "Remove featured flag from" : "Feature"} listing ${listing.title}`}
              title={listing.featured ? "Unfeature listing" : "Feature listing"}
              className={cx(iconBtn, listing.featured ? "text-accent" : "hover:text-accent")}
            >
              <Star size={16} fill={listing.featured ? "currentColor" : "none"} />
            </button>
          )}
          {onStatusChange && (
            <SelectField
              value={listing.status}
              onChange={(value) => onStatusChange(listing, value as ListingStatus)}
              options={STATUSES.map((status) => ({ value: status, label: status }))}
              ariaLabel={`Change status for ${listing.title}`}
              className="h-9 w-[112px] px-2 text-[12px]"
            />
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(listing)}
              aria-label={`Delete listing ${listing.title}`}
              title="Delete listing"
              className={cx(iconBtn, "text-red-600 hover:bg-red-50")}
            >
              <Trash2 size={16} />
            </button>
          )}
          {extraActions?.(listing)}
        </div>
      ),
    },
  ];

  return (
    <div className={cardClass}>
      <DataTable
        columns={columns}
        rows={listings}
        empty={
          <EmptyState
            icon={Building2}
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
          />
        }
      />
      {onPageChange && (
        <Pagination
          page={page}
          pageCount={pageCount ?? 1}
          onPageChange={onPageChange}
          total={total}
          pageSize={pageSize}
        />
      )}
    </div>
  );
}

/** Read-only listing preview shared by the All / Pending / Reported pages. */
export function ListingDetailModal({
  listing,
  onClose,
  reports = [],
}: {
  listing: AdminListing | null;
  onClose: () => void;
  reports?: Report[];
}) {
  if (!listing) return null;
  const photo = listing.img || listing.gallery?.[0] || "";
  const linkedReports = reportsFor(listing, reports);

  const detail = (label: string, value: ReactNode) => (
    <div className="rounded-xl bg-page px-3.5 py-3">
      <dt className="text-[11px] font-extrabold uppercase tracking-wide text-night/45">{label}</dt>
      <dd className="mt-1 text-[13px] font-bold text-night">{value || "—"}</dd>
    </div>
  );

  return (
    <Modal
      open
      onClose={onClose}
      title={listing.title}
      subtitle={`${listing.town || listing.location}, ${listing.district} · Submitted ${formatDate(listing.submitted)}`}
      maxWidth="max-w-2xl"
      footer={
        <button type="button" className={secondaryBtn} onClick={onClose}>
          Close
        </button>
      }
    >
      {photo ? (
        <img
          src={photo}
          alt={listing.title}
          className="h-52 w-full rounded-xl bg-lav object-cover"
        />
      ) : (
        <div className="grid h-40 place-items-center rounded-xl bg-lav text-night/45">
          <ImageOff size={28} />
          <span className="mt-2 text-[13px] font-semibold">No photo available</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ListingStatusBadge status={listing.status} />
        {listing.featured && <Badge tone="amber"><Star size={12} fill="currentColor" /> Featured</Badge>}
        <Badge tone="violet">{formatPrice(listing.price)} / month</Badge>
        {listing.reports > 0 && (
          <Badge tone="red"><Flag size={12} /> {listing.reports} report{listing.reports === 1 ? "" : "s"}</Badge>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {detail("Owner", <Link to="/admin/users/owners" className="hover:underline">{listing.ownerName}</Link>)}
        {detail("Owner ID", `#${listing.ownerId}`)}
        {detail("Listing ID", `#${listing.id}`)}
        {detail("Type", listing.type)}
        {detail("Boarding", listing.boardingType || "—")}
        {detail("Occupancy", listing.occupancy || "—")}
        {detail("Views", listing.views)}
        {detail("Enquiries", listing.enquiries)}
        {detail("Submitted", formatDate(listing.submitted))}
      </dl>

      <div className="mt-5">
        <p className="text-[13px] font-extrabold text-night">Facilities</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {listing.facilities.length > 0 ? (
            listing.facilities.map((facility) => (
              <Badge key={facility} tone="violet">{facility}</Badge>
            ))
          ) : (
            <span className="text-[13px] font-medium text-night/50">No facilities listed</span>
          )}
        </div>
      </div>

      {listing.description && (
        <div className="mt-5">
          <p className="text-[13px] font-extrabold text-night">Description</p>
          <p className="mt-1.5 text-[13px] font-medium leading-relaxed text-night/65">
            {listing.description}
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-primary-100 pt-4">
        <p className="text-[13px] font-extrabold text-night">Reports & complaints</p>
        {linkedReports.length === 0 ? (
          <p className="mt-2 text-[13px] font-medium text-night/50">No reports filed against this listing.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {linkedReports.map((report) => (
              <li key={report.id} className="rounded-xl border border-primary-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[13px] font-extrabold text-night">{report.reason}</p>
                  <Badge
                    tone={
                      report.status === "Resolved"
                        ? "green"
                        : report.status === "Dismissed"
                          ? "gray"
                          : "red"
                    }
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="mt-1 text-[12px] font-medium text-night/60">{report.details}</p>
                <p className="mt-1 text-[11px] font-medium text-night/40">
                  Reported by {report.reportedBy} · {formatDate(report.created)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
