import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ListingStatus, UserStatus } from "../data/types";

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* Shared class strings — mirror the public site's rounded-xl / rounded-2xl language. */
export const cardClass = "rounded-2xl bg-white shadow-card";
export const inputClass =
  "h-11 w-full rounded-xl border border-primary-100 bg-white px-4 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none";
export const primaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 py-2.5 text-[14px] font-extrabold text-white shadow-cta transition hover:bg-primary-800 disabled:opacity-40";
export const secondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-5 py-2.5 text-[14px] font-bold text-primary-700 transition hover:border-primary-700 disabled:opacity-40";
export const dangerBtn =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-5 py-2.5 text-[14px] font-bold text-red-600 transition hover:bg-red-100";
export const iconBtn =
  "grid h-9 w-9 place-items-center rounded-lg bg-lav text-primary-700 transition hover:bg-primary-100";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-night sm:text-[30px]">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-[14px] font-medium text-night/60">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx(cardClass, className)}>
      {(title || action) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-100 px-5 py-4 sm:px-6">
          <div>
            {title && <h2 className="text-[17px] font-extrabold text-night">{title}</h2>}
            {subtitle && <p className="mt-1 text-[13px] font-medium text-night/55">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

type Tone = "green" | "amber" | "red" | "violet" | "gray" | "blue";
const toneClasses: Record<Tone, string> = {
  green: "bg-[#DFF2E4] text-[#1F7A3D]",
  amber: "bg-[#FFF3D6] text-[#97650B]",
  red: "bg-red-50 text-red-600",
  violet: "bg-lav text-primary-700",
  gray: "bg-[#F0EFF5] text-night/60",
  blue: "bg-blue-50 text-blue-700",
};

export function Badge({
  children,
  tone = "violet",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const listingTones: Record<ListingStatus, Tone> = {
  Pending: "amber",
  Approved: "blue",
  Rejected: "red",
  Active: "green",
  Inactive: "gray",
  Reported: "red",
};

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return <Badge tone={listingTones[status]}>{status}</Badge>;
}

const userTones: Record<UserStatus, Tone> = {
  Active: "green",
  Suspended: "red",
  Pending: "amber",
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  return <Badge tone={userTones[status]}>{status}</Badge>;
}

export function Rating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={cx("text-[15px] leading-none", i < value ? "text-accent" : "text-primary-100")}>
          ★
        </span>
      ))}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "violet",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: Tone;
}) {
  return (
    <div className={cx(cardClass, "p-5")}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-bold text-night/55">{label}</p>
        <span className={cx("grid h-9 w-9 shrink-0 place-items-center rounded-lg", toneClasses[tone])}>
          <Icon size={18} strokeWidth={2.3} />
        </span>
      </div>
      <p className="mt-3 text-[26px] font-extrabold leading-none tracking-tight text-night">
        {value}
      </p>
      {hint && <p className="mt-2 text-[12px] font-medium text-night/50">{hint}</p>}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cx("relative", className)}>
      <Search
        size={17}
        strokeWidth={2.3}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-night/40"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={cx(inputClass, "pl-10")}
      />
    </div>
  );
}

export type SelectOption = { value: string; label: string };

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  className,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel ?? placeholder}
      className={cx(inputClass, className)}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[13px] font-bold text-night">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="mt-1 text-[12px] font-medium text-night/50">{hint}</p>}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <p className="text-[14px] font-bold text-night">{label}</p>
        {description && <p className="mt-0.5 text-[12px] font-medium text-night/55">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative h-6 w-11 shrink-0 rounded-full transition",
          checked ? "bg-primary-700" : "bg-primary-200",
        )}
      >
        <span
          className={cx(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const dimension = size === "sm" ? "h-8 w-8 text-[12px]" : size === "lg" ? "h-12 w-12 text-[18px]" : "h-10 w-10 text-[15px]";
  return (
    <span
      className={cx(
        "grid shrink-0 place-items-center rounded-full bg-primary-700 font-extrabold text-white",
        dimension,
      )}
    >
      {name.trim().slice(0, 1).toUpperCase() || "?"}
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-lav text-primary-700">
        <Icon size={22} strokeWidth={2.2} />
      </span>
      <p className="mt-4 text-[15px] font-extrabold text-night">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-[13px] font-medium text-night/55">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  total,
  pageSize,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  total?: number;
  pageSize?: number;
}) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const start = total !== undefined && pageSize ? (page - 1) * pageSize + 1 : undefined;
  const end = total !== undefined && pageSize ? Math.min(page * pageSize, total) : undefined;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary-100 px-5 py-4">
      <p className="text-[12px] font-medium text-night/55">
        {start !== undefined && end !== undefined ? `Showing ${start}–${end} of ${total}` : `Page ${page} of ${pageCount}`}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-primary-100 bg-white text-night/60 transition hover:border-primary-700 hover:text-primary-700 disabled:opacity-35"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={cx(
              "grid h-8 min-w-8 place-items-center rounded-lg px-1.5 text-[13px] font-bold transition",
              n === page
                ? "bg-primary-700 text-white"
                : "border border-primary-100 bg-white text-night/60 hover:border-primary-700 hover:text-primary-700",
            )}
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          aria-label="Next page"
          disabled={page === pageCount}
          onClick={() => onPageChange(page + 1)}
          className="grid h-8 w-8 place-items-center rounded-lg border border-primary-100 bg-white text-night/60 transition hover:border-primary-700 hover:text-primary-700 disabled:opacity-35"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T extends { id: number | string }>({
  columns,
  rows,
  empty,
  emptyTitle = "No records found",
  emptyDescription,
  emptyIcon,
}: {
  columns: Column<T>[];
  rows: T[];
  empty?: ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: LucideIcon;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="border-b border-primary-100 text-[11px] font-extrabold uppercase tracking-wider text-night/45">
            {columns.map((column) => (
              <th key={column.key} className={cx("px-5 py-3.5", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                {empty ?? (
                  <EmptyState
                    icon={emptyIcon ?? Search}
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                )}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-t border-primary-50 transition hover:bg-lav/40">
                {columns.map((column) => (
                  <td key={column.key} className={cx("px-5 py-3.5", column.className)}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx("my-auto w-full rounded-2xl bg-white shadow-bar", maxWidth)}
      >
        <div className="flex items-start justify-between gap-4 border-b border-primary-100 px-6 py-5">
          <div>
            <h2 className="text-[19px] font-extrabold text-night">{title}</h2>
            {subtitle && <p className="mt-1 text-[13px] font-medium text-night/55">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-night/50 transition hover:bg-lav hover:text-night"
          >
            <X size={19} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2.5 border-t border-primary-100 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = "Confirm",
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button type="button" className={secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={danger ? dangerBtn : primaryBtn}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-[14px] font-medium leading-relaxed text-night/70">{message}</p>
    </Modal>
  );
}

/* ---------- Toast notifications ---------- */

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}
interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const toastStyles: Record<ToastKind, { icon: LucideIcon; className: string }> = {
  success: { icon: CheckCircle2, className: "border-[#1F7A3D]/20 bg-[#DFF2E4] text-[#1F7A3D]" },
  error: { icon: AlertCircle, className: "border-red-200 bg-red-50 text-red-700" },
  info: { icon: Info, className: "border-primary-200 bg-lav text-primary-800" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const api = useMemo<ToastApi>(() => {
    const push = (kind: ToastKind, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, kind, message }]);
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600);
    };
    return {
      success: (message) => push("success", message),
      error: (message) => push("error", message),
      info: (message) => push("info", message),
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2">
        {toasts.map((toast) => {
          const { icon: Icon, className } = toastStyles[toast.kind];
          return (
            <div
              key={toast.id}
              role="status"
              className={cx(
                "pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px] font-bold shadow-bar",
                className,
              )}
            >
              <Icon size={18} strokeWidth={2.4} className="mt-0.5 shrink-0" />
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="opacity-60 transition hover:opacity-100"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

export function SuccessBanner({ children }: { children: ReactNode }) {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#DFF2E4] px-4 py-3 text-[13px] font-bold text-[#1F7A3D]">
      <Check size={16} strokeWidth={2.6} /> {children}
    </div>
  );
}
