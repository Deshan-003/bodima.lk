import { useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Flag,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { Report, ReportStatus } from "../data/types";
import { useToast } from "../components/ui";
import {
  Avatar,
  Badge,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Field,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  SectionCard,
  SelectField,
  StatCard,
  cardClass,
  cx,
  iconBtn,
  primaryBtn,
  secondaryBtn,
  type Column,
} from "../components/ui";

const PAGE_SIZE = 8;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const textareaClass =
  "min-h-[100px] w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none";

const statusOptions: Array<{ value: ReportStatus; label: string }> = [
  { value: "Open", label: "Open" },
  { value: "In Review", label: "In Review" },
  { value: "Resolved", label: "Resolved" },
  { value: "Dismissed", label: "Dismissed" },
];

function formatDate(value: string): string {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return value;
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

function statusTone(status: ReportStatus): "red" | "blue" | "green" | "gray" {
  if (status === "Open") return "red";
  if (status === "In Review") return "blue";
  if (status === "Resolved") return "green";
  return "gray";
}

function typeTone(type: Report["type"]): "violet" | "blue" | "amber" {
  if (type === "listing") return "violet";
  if (type === "user") return "blue";
  return "amber";
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">{label}</p>
      <div className="mt-1 text-[14px] font-semibold text-night">{children}</div>
    </div>
  );
}

export default function Reports() {
  const { data, updateReport, deleteReport, logActivity } = useAdminData();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | Report["type"]>("all");
  const [status, setStatus] = useState<"all" | ReportStatus>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [draftStatus, setDraftStatus] = useState<ReportStatus>("Open");
  const [draftNotes, setDraftNotes] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [dismissId, setDismissId] = useState<number | null>(null);

  const reports = data.reports;
  const counts = useMemo(
    () => ({
      open: reports.filter((r) => r.status === "Open").length,
      inReview: reports.filter((r) => r.status === "In Review").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
      dismissed: reports.filter((r) => r.status === "Dismissed").length,
    }),
    [reports],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = reports.filter((report) => {
      const matchesQuery =
        !needle ||
        [report.targetTitle, report.reportedBy, report.reason, report.details, String(report.id)]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return (
        matchesQuery &&
        (type === "all" || report.type === type) &&
        (status === "all" || report.status === status)
      );
    });
    return rows.sort((a, b) =>
      sort === "newest" ? b.created.localeCompare(a.created) : a.created.localeCompare(b.created),
    );
  }, [reports, query, type, status, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selected = reports.find((r) => r.id === selectedId);

  function openReview(report: Report) {
    setSelectedId(report.id);
    setDraftStatus(report.status);
    setDraftNotes(report.notes);
  }

  function saveReview() {
    if (!selected) return;
    updateReport(selected.id, { status: draftStatus, notes: draftNotes.trim() });
    toast.success(`Complaint #${selected.id} saved (${draftStatus.toLowerCase()}).`);
    logActivity(`Complaint #${selected.id} reviewed — ${draftStatus}`, "report");
    setSelectedId(null);
  }

  function quickStatus(report: Report, next: ReportStatus, needsConfirm = false) {
    if (needsConfirm) {
      setDismissId(report.id);
      return;
    }
    updateReport(report.id, { status: next });
    toast.success(`Complaint #${report.id} marked ${next.toLowerCase()}.`);
    logActivity(`Complaint #${report.id} marked ${next.toLowerCase()}`, "report");
    if (selectedId === report.id) setSelectedId(null);
  }

  function confirmDismiss() {
    if (dismissId === null) return;
    updateReport(dismissId, { status: "Dismissed" });
    toast.success(`Complaint #${dismissId} dismissed.`);
    logActivity(`Complaint #${dismissId} dismissed`, "report");
    if (selectedId === dismissId) setSelectedId(null);
  }

  function confirmDelete() {
    if (deleteId === null) return;
    deleteReport(deleteId);
    toast.success(`Complaint #${deleteId} deleted.`);
    if (selectedId === deleteId) setSelectedId(null);
  }

  function resetFilters() {
    setQuery("");
    setType("all");
    setStatus("all");
    setSort("newest");
    setPage(1);
  }

  const columns: Column<Report>[] = [
    {
      key: "complaint",
      header: "Complaint",
      render: (report) => (
        <div className="max-w-[260px]">
          <p className="text-[14px] font-bold text-night">{report.reason}</p>
          <p className="mt-0.5 text-[12px] font-medium text-night/45">#{report.id}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (report) => (
        <Badge tone={typeTone(report.type)} className="capitalize">
          {report.type}
        </Badge>
      ),
    },
    {
      key: "target",
      header: "Target",
      render: (report) => (
        <div className="max-w-[220px]">
          <p className="line-clamp-2 text-[13px] font-semibold text-night">{report.targetTitle}</p>
          <p className="mt-0.5 text-[11px] font-medium text-night/45">ID #{report.targetId}</p>
        </div>
      ),
    },
    {
      key: "reporter",
      header: "Reported by",
      render: (report) => (
        <div className="flex items-center gap-2">
          <Avatar name={report.reportedBy} size="sm" />
          <span className="whitespace-nowrap text-[13px] font-semibold text-night">{report.reportedBy}</span>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (report) => <span className="whitespace-nowrap text-[13px] text-night/65">{formatDate(report.created)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (report) => <Badge tone={statusTone(report.status)}>{report.status}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (report) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={iconBtn}
            aria-label={`Review complaint #${report.id}`}
            title="Review complaint"
            onClick={() => openReview(report)}
          >
            <Eye size={16} />
          </button>
          <button
            type="button"
            className={cx(iconBtn, "hover:bg-red-50 hover:text-red-600")}
            aria-label={`Delete complaint #${report.id}`}
            title="Delete complaint"
            onClick={() => setDeleteId(report.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const hasFilters = query.trim() !== "" || type !== "all" || status !== "all";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Complaints"
        subtitle="Review community complaints and record moderation decisions."
        actions={
          <Badge tone="red">
            <Flag size={13} /> {counts.open + counts.inReview} need attention
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Open" value={counts.open} hint="Awaiting first review" icon={AlertTriangle} tone="red" />
        <StatCard label="In review" value={counts.inReview} hint="Being investigated" icon={Clock3} tone="blue" />
        <StatCard label="Resolved" value={counts.resolved} hint="Action taken" icon={CheckCircle2} tone="green" />
        <StatCard label="Total complaints" value={reports.length} hint={`${counts.dismissed} dismissed`} icon={FileText} tone="violet" />
      </div>

      <SectionCard
        title="Complaint queue"
        subtitle={`${filtered.length} of ${reports.length} complaints`}
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
            placeholder="Search target, reporter, reason…"
            className="sm:col-span-2"
          />
          <SelectField
            value={type}
            onChange={(value) => {
              setType(value as "all" | Report["type"]);
              setPage(1);
            }}
            ariaLabel="Filter by type"
            options={[
              { value: "all", label: "All types" },
              { value: "listing", label: "Listings" },
              { value: "user", label: "Users" },
              { value: "review", label: "Reviews" },
            ]}
          />
          <SelectField
            value={status}
            onChange={(value) => {
              setStatus(value as "all" | ReportStatus);
              setPage(1);
            }}
            ariaLabel="Filter by status"
            options={[
              { value: "all", label: "All statuses" },
              ...statusOptions.map((option) => ({ value: option.value, label: option.label })),
            ]}
          />
          <SelectField
            value={sort}
            onChange={(value) => {
              setSort(value as "newest" | "oldest");
              setPage(1);
            }}
            ariaLabel="Sort complaints"
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
            ]}
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Flag}
            title="No complaints found"
            description="Try a different search term or clear the filters to see all complaints."
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
        title={selected ? `Complaint #${selected.id}` : "Review complaint"}
        subtitle={selected?.reason}
        maxWidth="max-w-2xl"
        footer={
          <>
            {selected && selected.status !== "Resolved" && (
              <button type="button" className={secondaryBtn} onClick={() => quickStatus(selected, "Resolved")}>
                <CheckCircle2 size={16} /> Mark resolved
              </button>
            )}
            {selected && selected.status !== "Dismissed" && (
              <button type="button" className={secondaryBtn} onClick={() => quickStatus(selected, "Dismissed", true)}>
                <XCircle size={16} /> Dismiss
              </button>
            )}
            <button type="button" className={primaryBtn} onClick={saveReview} disabled={!selected}>
              <Save size={16} /> Save changes
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-4 rounded-xl bg-lav/60 p-4 sm:grid-cols-2">
              <Detail label="Complaint ID">#{selected.id}</Detail>
              <Detail label="Type">
                <Badge tone={typeTone(selected.type)} className="capitalize">
                  {selected.type}
                </Badge>
              </Detail>
              <Detail label="Target">{selected.targetTitle} (ID #{selected.targetId})</Detail>
              <Detail label="Reported by">{selected.reportedBy}</Detail>
              <Detail label="Created">{formatDate(selected.created)}</Detail>
              <Detail label="Current status">
                <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
              </Detail>
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">Reason</p>
              <p className="mt-1 text-[15px] font-extrabold text-night">{selected.reason}</p>
            </div>

            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">Complaint details</p>
              <p className={cx(cardClass, "mt-1.5 p-4 text-[14px] font-medium leading-relaxed text-night/75")}>
                {selected.details}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <SelectField
                  value={draftStatus}
                  onChange={(value) => setDraftStatus(value as ReportStatus)}
                  options={statusOptions.map((option) => ({ value: option.value, label: option.label }))}
                  className="w-full"
                  ariaLabel="Set complaint status"
                />
              </Field>
              <div className="flex items-end">
                <p className="pb-2.5 text-[12px] font-medium text-night/50">
                  Administrative notes are internal and are not shown to reporters.
                </p>
              </div>
            </div>

            <Field label="Administrative notes" htmlFor="report-notes" hint="Record investigation steps or the decision taken.">
              <textarea
                id="report-notes"
                value={draftNotes}
                onChange={(event) => setDraftNotes(event.target.value)}
                placeholder="Add internal notes…"
                className={textareaClass}
              />
            </Field>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={dismissId !== null}
        onClose={() => setDismissId(null)}
        title="Dismiss complaint?"
        message="This will mark the complaint as dismissed. You can still change the status later from the review dialog."
        confirmLabel="Dismiss complaint"
        onConfirm={confirmDismiss}
      />

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete complaint?"
        message="This permanently removes the complaint from the admin console. This action cannot be undone."
        confirmLabel="Delete complaint"
        danger
        onConfirm={confirmDelete}
      />
    </div>
  );
}
