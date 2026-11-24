import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Eye,
  Inbox,
  MailOpen,
  MessageSquare,
  Send,
  Trash2,
} from "lucide-react";
import { useAdminData } from "../data/store";
import type { Enquiry, EnquiryMessage } from "../data/types";
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
  SearchInput,
  SectionCard,
  SelectField,
  StatCard,
  cx,
  dangerBtn,
  iconBtn,
  primaryBtn,
  secondaryBtn,
  type Column,
} from "../components/ui";

const PAGE_SIZE = 8;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const textareaClass =
  "min-h-[92px] w-full rounded-xl border border-primary-100 bg-white px-4 py-2.5 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none";

function formatDate(value: string): string {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return value;
  return `${String(day).padStart(2, "0")} ${MONTHS[month - 1] ?? ""} ${year}`.trim();
}

function bubbleClass(from: EnquiryMessage["from"]): string {
  if (from === "seeker") return "rounded-tl-sm bg-lav text-night";
  if (from === "owner") return "rounded-tr-sm bg-primary-700 text-white";
  return "rounded-tr-sm bg-[#FFF3D6] text-[#97650B]";
}

function senderLabel(from: EnquiryMessage["from"]): string {
  if (from === "seeker") return "Seeker";
  if (from === "owner") return "Owner";
  return "Admin (you)";
}

export default function Messages() {
  const { data, markEnquiryRead, replyToEnquiry, deleteEnquiry } = useAdminData();
  const toast = useToast();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [reply, setReply] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const enquiries = data.enquiries;
  const stats = useMemo(
    () => ({
      total: enquiries.length,
      unread: enquiries.filter((e) => e.unread).length,
      listings: new Set(enquiries.map((e) => e.listingId)).size,
      replies: enquiries.reduce(
        (sum, e) => sum + e.messages.filter((message) => message.from === "admin").length,
        0,
      ),
    }),
    [enquiries],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = enquiries.filter((enquiry) => {
      const matchesQuery =
        !needle ||
        [enquiry.seeker, enquiry.owner, enquiry.listingTitle, enquiry.preview, String(enquiry.id)]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      return matchesQuery && (filter === "all" || enquiry.unread);
    });
    return rows.sort((a, b) =>
      sort === "newest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date),
    );
  }, [enquiries, query, filter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const selected = enquiries.find((enquiry) => enquiry.id === selectedId);
  const hasFilters = query.trim() !== "" || filter !== "all";

  function openThread(enquiry: Enquiry) {
    setSelectedId(enquiry.id);
    setReply("");
    if (enquiry.unread) {
      markEnquiryRead(enquiry.id);
      toast.info(`Enquiry #${enquiry.id} marked as read.`);
    }
  }

  function markRead(enquiry: Enquiry) {
    markEnquiryRead(enquiry.id);
    toast.success(`Enquiry #${enquiry.id} marked as read.`);
  }

  function sendReply() {
    if (!selected) return;
    const text = reply.trim();
    if (!text) {
      toast.error("Type a reply before sending.");
      return;
    }
    replyToEnquiry(selected.id, text);
    toast.success(`Reply sent to ${selected.seeker}.`);
    setReply("");
  }

  function confirmDelete() {
    if (deleteId === null) return;
    deleteEnquiry(deleteId);
    toast.success(`Enquiry #${deleteId} deleted.`);
    if (selectedId === deleteId) setSelectedId(null);
  }

  function resetFilters() {
    setQuery("");
    setFilter("all");
    setSort("newest");
    setPage(1);
  }

  const columns: Column<Enquiry>[] = [
    {
      key: "enquiry",
      header: "Enquiry",
      render: (enquiry) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={enquiry.seeker} size="sm" />
          <div className="min-w-0">
            <p className="whitespace-nowrap text-[13px] font-bold text-night">{enquiry.seeker}</p>
            <Link
              to="/admin/listings"
              className="line-clamp-1 max-w-[220px] text-[12px] font-medium text-primary-700 hover:underline"
              title={enquiry.listingTitle}
            >
              {enquiry.listingTitle}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Owner",
      render: (enquiry) => <span className="whitespace-nowrap text-[13px] font-semibold text-night/70">{enquiry.owner}</span>,
    },
    {
      key: "date",
      header: "Date",
      render: (enquiry) => <span className="whitespace-nowrap text-[13px] text-night/65">{formatDate(enquiry.date)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (enquiry) =>
        enquiry.unread ? (
          <Badge tone="red">
            <span className="h-1.5 w-1.5 rounded-full bg-red-600" /> Unread
          </Badge>
        ) : (
          <Badge tone="gray">Read</Badge>
        ),
    },
    {
      key: "preview",
      header: "Preview",
      render: (enquiry) => (
        <p className="line-clamp-2 max-w-[260px] text-[13px] font-medium text-night/60">{enquiry.preview}</p>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (enquiry) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={iconBtn}
            aria-label={`Open thread #${enquiry.id}`}
            title="Open thread"
            onClick={() => openThread(enquiry)}
          >
            <Eye size={16} />
          </button>
          {enquiry.unread && (
            <button
              type="button"
              className={cx(iconBtn, "hover:bg-[#DFF2E4] hover:text-[#1F7A3D]")}
              aria-label={`Mark enquiry #${enquiry.id} as read`}
              title="Mark as read"
              onClick={() => markRead(enquiry)}
            >
              <Check size={16} />
            </button>
          )}
          <button
            type="button"
            className={cx(iconBtn, "hover:bg-red-50 hover:text-red-600")}
            aria-label={`Delete enquiry #${enquiry.id}`}
            title="Delete enquiry"
            onClick={() => setDeleteId(enquiry.id)}
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
        title="Messages"
        subtitle="Enquiries between seekers and property owners, with admin replies."
        actions={
          <Badge tone="red">
            <MailOpen size={13} /> {stats.unread} unread
          </Badge>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total enquiries" value={stats.total} hint="All conversations" icon={MessageSquare} tone="violet" />
        <StatCard label="Unread" value={stats.unread} hint="Need attention" icon={MailOpen} tone="red" />
        <StatCard label="Listings with enquiries" value={stats.listings} hint="Distinct listings" icon={Inbox} tone="blue" />
        <StatCard label="Replies sent" value={stats.replies} hint="By admin" icon={Send} tone="green" />
      </div>

      <SectionCard
        title="Enquiry inbox"
        subtitle={`${filtered.length} of ${enquiries.length} conversations`}
        action={
          hasFilters ? (
            <button type="button" className="text-[13px] font-bold text-primary-700 hover:underline" onClick={resetFilters}>
              Clear filters
            </button>
          ) : undefined
        }
      >
        <div className="grid gap-3 border-b border-primary-100 p-5 sm:grid-cols-2 lg:grid-cols-3">
          <SearchInput
            value={query}
            onChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
            placeholder="Search seeker, owner, listing…"
            className="sm:col-span-2"
          />
          <SelectField
            value={filter}
            onChange={(value) => {
              setFilter(value as "all" | "unread");
              setPage(1);
            }}
            ariaLabel="Filter enquiries"
            options={[
              { value: "all", label: "All enquiries" },
              { value: "unread", label: "Unread only" },
            ]}
          />
          <SelectField
            value={sort}
            onChange={(value) => {
              setSort(value as "newest" | "oldest");
              setPage(1);
            }}
            ariaLabel="Sort enquiries"
            options={[
              { value: "newest", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No enquiries found"
            description="No conversations match your search or filters."
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
        title={selected ? `Enquiry #${selected.id}` : "Conversation"}
        subtitle={selected ? `${selected.seeker} · ${selected.listingTitle}` : undefined}
        maxWidth="max-w-2xl"
        footer={
          <>
            {selected && (
              <button type="button" className={dangerBtn} onClick={() => setDeleteId(selected.id)}>
                <Trash2 size={16} /> Delete thread
              </button>
            )}
            <button type="button" className={secondaryBtn} onClick={() => setSelectedId(null)}>
              Close
            </button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-xl bg-lav/60 p-4 sm:grid-cols-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">Listing</p>
                <Link to="/admin/listings" className="mt-1 block text-[13px] font-bold text-primary-700 hover:underline">
                  {selected.listingTitle}
                </Link>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">Seeker</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-night">
                  <Avatar name={selected.seeker} size="sm" /> {selected.seeker}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/45">Owner</p>
                <p className="mt-1 flex items-center gap-2 text-[13px] font-semibold text-night">
                  <Avatar name={selected.owner} size="sm" /> {selected.owner}
                </p>
              </div>
              <p className="text-[12px] font-medium text-night/50 sm:col-span-3">Started {formatDate(selected.date)}</p>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-extrabold uppercase tracking-wider text-night/45">Conversation</p>
              <div className="space-y-3">
                {selected.messages.map((message, index) => (
                  <div
                    key={`${message.at}-${index}`}
                    className={cx("flex", message.from === "seeker" ? "justify-start" : "justify-end")}
                  >
                    <div className={cx("max-w-[80%] rounded-2xl px-4 py-2.5", bubbleClass(message.from))}>
                      <p className="mb-1 text-[11px] font-extrabold opacity-70">
                        {senderLabel(message.from)} · {message.at}
                      </p>
                      <p className="whitespace-pre-wrap text-[13px] font-medium leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-primary-100 pt-4">
              <label htmlFor="admin-reply" className="block text-[13px] font-bold text-night">
                Reply as admin
              </label>
              <textarea
                id="admin-reply"
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                placeholder="Write a reply to this conversation…"
                className={cx(textareaClass, "mt-1.5")}
              />
              <div className="mt-3 flex justify-end">
                <button type="button" className={primaryBtn} onClick={sendReply}>
                  <Send size={16} /> Send reply
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete enquiry?"
        message="This permanently deletes the conversation and all of its messages. This action cannot be undone."
        confirmLabel="Delete enquiry"
        danger
        onConfirm={confirmDelete}
      />
    </div>
  );
}
