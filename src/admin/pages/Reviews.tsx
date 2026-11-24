import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  Eye,
  Flag,
  MessageSquare,
  Star,
  Trash2,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { AdminReview, ReviewStatus } from "../data/types";
import { useToast } from "../components/ui";
import {
  Avatar,
  Badge,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Modal,
  PageHeader,
  Pagination,
  Rating,
  SearchInput,
  SectionCard,
  SelectField,
  StatCard,
  cardClass,
  cx,
  dangerBtn,
  iconBtn,
  primaryBtn,
  secondaryBtn,
  type Column,
} from "../components/ui";

const PAGE_SIZE = 8;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(value: string): string {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return value;
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

function statusTone(status: ReviewStatus): "green" | "amber" | "red" {
  if (status === "Published") return "green";
  if (status === "Pending") return "amber";
  return "red";
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">{label}</p>
      <div className="mt-1 text-[14px] font-semibold text-night">{children}</div>
    </div>
  );
}

export default function Reviews() {
  const { data, updateReview, deleteReview, logActivity } = useAdminData();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ReviewStatus>("all");
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const reviews = data.reviews;
  const stats = useMemo(() => {
    const published = reviews.filter((r) => r.status === "Published").length;
    const pending = reviews.filter((r) => r.status === "Pending").length;
    const reported = reviews.filter((r) => r.status === "Reported").length;
    const average = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";
    return { published, pending, reported, average };
  }, [reviews]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = reviews.filter((review) => {
      const matchesQuery =
        !needle ||
        [review.author, review.listingTitle, review.text, String(review.id)]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return (
        matchesQuery &&
        (status === "all" || review.status === status) &&
        (rating === "all" || review.rating === Number(rating))
      );
    });
    return rows.sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating || b.date.localeCompare(a.date);
      if (sort === "lowest") return a.rating - b.rating || b.date.localeCompare(a.date);
      if (sort === "oldest") return a.date.localeCompare(b.date);
      return b.date.localeCompare(a.date);
    });
  }, [reviews, query, status, rating, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selected = reviews.find((review) => review.id === selectedId);

  function moderate(review: AdminReview, next: ReviewStatus, clearReports = false) {
    updateReview(review.id, clearReports ? { status: next, reports: 0 } : { status: next });
    toast.success(`Review #${review.id} moved to ${next.toLowerCase()}.`);
    logActivity(`Review #${review.id} moved to ${next.toLowerCase()}`, "review");
  }

  function confirmDelete() {
    if (deleteId === null) return;
    deleteReview(deleteId);
    toast.success(`Review #${deleteId} deleted.`);
    if (selectedId === deleteId) setSelectedId(null);
  }

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setRating("all");
    setSort("newest");
    setPage(1);
  }

  const hasFilters = query.trim() !== "" || status !== "all" || rating !== "all";

  const columns: Column<AdminReview>[] = [
    {
      key: "review",
      header: "Review",
      render: (review) => (
        <div className="max-w-[280px]">
          <p className="line-clamp-2 text-[13px] font-semibold text-night">“{review.text}”</p>
          <p className="mt-0.5 text-[11px] font-medium text-night/45">#{review.id}</p>
        </div>
      ),
    },
    {
      key: "listing",
      header: "Listing",
      render: (review) => (
        <Link
          to="/admin/listings"
          className="line-clamp-2 max-w-[200px] text-[13px] font-bold text-primary-700 hover:underline"
          title="View listings"
        >
          {review.listingTitle}
        </Link>
      ),
    },
    {
      key: "author",
      header: "Author",
      render: (review) => (
        <div className="flex items-center gap-2">
          <Avatar name={review.author} size="sm" />
          <span className="whitespace-nowrap text-[13px] font-semibold text-night">{review.author}</span>
        </div>
      ),
    },
    {
      key: "rating",
      header: "Rating",
      render: (review) => <Rating value={review.rating} />,
    },
    {
      key: "date",
      header: "Date",
      render: (review) => <span className="whitespace-nowrap text-[13px] text-night/65">{formatDate(review.date)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (review) => <Badge tone={statusTone(review.status)}>{review.status}</Badge>,
    },
    {
      key: "reports",
      header: "Reports",
      render: (review) =>
        review.reports > 0 ? (
          <Badge tone="red">
            <Flag size={12} /> {review.reports}
          </Badge>
        ) : (
          <span className="text-[13px] text-night/40">—</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (review) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={iconBtn}
            aria-label={`View review #${review.id}`}
            title="View review"
            onClick={() => setSelectedId(review.id)}
          >
            <Eye size={16} />
          </button>
          {review.status !== "Published" && (
            <button
              type="button"
              onClick={() => moderate(review, "Published", true)}
              className="rounded-lg bg-[#DFF2E4] px-2.5 py-1.5 text-[12px] font-bold text-[#1F7A3D] transition hover:bg-[#c9e8d2]"
              title="Publish review and clear reports"
            >
              Publish
            </button>
          )}
          {review.status !== "Reported" && (
            <button
              type="button"
              onClick={() => moderate(review, "Reported")}
              className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-[12px] font-bold text-[#97650B] transition hover:bg-amber-100"
              title="Mark as reported"
            >
              Report
            </button>
          )}
          <button
            type="button"
            className={cx(iconBtn, "hover:bg-red-50 hover:text-red-600")}
            aria-label={`Delete review #${review.id}`}
            title="Delete review"
            onClick={() => setDeleteId(review.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reviews"
        subtitle="Moderate boarding reviews posted by seekers."
        actions={
          <Badge tone="amber">
            <Clock3 size={13} /> {stats.pending} pending
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Published" value={stats.published} hint="Visible on listings" icon={CheckCircle2} tone="green" />
        <StatCard label="Pending" value={stats.pending} hint="Awaiting moderation" icon={Clock3} tone="amber" />
        <StatCard label="Reported" value={stats.reported} hint="Flagged by users" icon={Flag} tone="red" />
        <StatCard label="Average rating" value={stats.average} hint="Across all reviews" icon={Star} tone="violet" />
      </div>

      <SectionCard
        title="Review moderation"
        subtitle={`${filtered.length} of ${reviews.length} reviews`}
        action={
          hasFilters ? (
            <button type="button" className="text-[13px] font-bold text-primary-700 hover:underline" onClick={resetFilters}>
              Clear filters
            </button>
          ) : undefined
        }
      >
        <div className="grid gap-3 border-b border-primary-100 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search author, listing, text…"
            className="sm:col-span-2"
          />
          <SelectField
            value={status}
            onChange={(value) => {
              setStatus(value as "all" | ReviewStatus);
              setPage(1);
            }}
            ariaLabel="Filter by status"
            options={[
              { value: "all", label: "All statuses" },
              { value: "Published", label: "Published" },
              { value: "Pending", label: "Pending" },
              { value: "Reported", label: "Reported" },
            ]}
          />
          <SelectField
            value={rating}
            onChange={(value) => {
              setRating(value);
              setPage(1);
            }}
            ariaLabel="Filter by rating"
            options={[
              { value: "all", label: "All ratings" },
              ...[1, 2, 3, 4, 5].map((value) => ({ value: String(value), label: `${value} star${value > 1 ? "s" : ""}` })),
            ]}
          />
          <SelectField
            value={sort}
            onChange={(value) => {
              setSort(value as "newest" | "oldest" | "highest" | "lowest");
              setPage(1);
            }}
            ariaLabel="Sort reviews"
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "highest", label: "Highest rating" },
              { value: "lowest", label: "Lowest rating" },
            ]}
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews found"
            description="No reviews match your search or filters. Try clearing them to see all reviews."
            action={
              hasFilters ? (
                <button type="button" className={secondaryBtn} onClick={resetFilters}>
                  Clear filters
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            <DataTable columns={columns} rows={rows} />
            <Pagination
              page={safePage}
              pageCount={pageCount}
              onPageChange={setPage}
              total={filtered.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </SectionCard>

      <Modal
        open={selected !== undefined}
        onClose={() => setSelectedId(null)}
        title={selected ? `Review #${selected.id}` : "Review details"}
        subtitle={selected?.listingTitle}
        maxWidth="max-w-2xl"
        footer={
          <>
            {selected && selected.status !== "Published" && (
              <button type="button" className={primaryBtn} onClick={() => moderate(selected, "Published", true)}>
                <CheckCircle2 size={16} /> Publish
              </button>
            )}
            {selected && selected.status !== "Reported" && (
              <button type="button" className={secondaryBtn} onClick={() => moderate(selected, "Reported")}>
                <Flag size={16} /> Mark as reported
              </button>
            )}
            {selected && selected.status !== "Pending" && (
              <button type="button" className={secondaryBtn} onClick={() => moderate(selected, "Pending")}>
                <Clock3 size={16} /> Move to pending
              </button>
            )}
            {selected && (
              <button type="button" className={dangerBtn} onClick={() => setDeleteId(selected.id)}>
                <Trash2 size={16} /> Delete
              </button>
            )}
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-4 rounded-xl bg-lav/60 p-4 sm:grid-cols-2">
              <Detail label="Review ID">#{selected.id}</Detail>
              <Detail label="Rating">
                <span className="flex items-center gap-2">
                  <Rating value={selected.rating} />
                  <span className="text-night/55">{selected.rating}/5</span>
                </span>
              </Detail>
              <Detail label="Listing">
                <Link to="/admin/listings" className="text-primary-700 hover:underline">
                  {selected.listingTitle}
                </Link>
              </Detail>
              <Detail label="Author">
                <span className="flex items-center gap-2">
                  <Avatar name={selected.author} size="sm" /> {selected.author}
                </span>
              </Detail>
              <Detail label="Date">{formatDate(selected.date)}</Detail>
              <Detail label="Status">
                <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
              </Detail>
              <Detail label="Reports">
                {selected.reports > 0 ? (
                  <Badge tone="red">
                    <Flag size={12} /> {selected.reports}
                  </Badge>
                ) : (
                  "None"
                )}
              </Detail>
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">Review text</p>
              <p className={cx(cardClass, "mt-1.5 p-4 text-[14px] font-medium leading-relaxed text-night/75")}>
                “{selected.text}”
              </p>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete review?"
        message="This permanently removes the review from the admin console. This action cannot be undone."
        confirmLabel="Delete review"
        danger
        onConfirm={confirmDelete}
      />
    </div>
  );
}
