import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Ban,
  Bookmark,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  Mail,
  MapPin,
  MessageSquare,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Store,
  Trash2,
  UserCheck,
  UserRound,
  Users as UsersIcon,
} from "lucide-react";
import { DISTRICTS, townsFor } from "../../data/locations";
import type { AccountType, AdminUser, UserStatus } from "../data/types";
import { useAdminData } from "../data/store";
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
  UserStatusBadge,
  cx,
  iconBtn,
  inputClass,
  primaryBtn,
  secondaryBtn,
  useToast,
  type Column,
  type SelectOption,
} from "../components/ui";

/* ------------------------------------------------------------------ */
/* Shared helpers — reused by the Seekers and Owners pages             */
/* ------------------------------------------------------------------ */

export const STATUS_OPTIONS: SelectOption[] = [
  { value: "All", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Suspended", label: "Suspended" },
  { value: "Pending", label: "Pending" },
];

export const USER_STATUS_OPTIONS: SelectOption[] = STATUS_OPTIONS.slice(1);

export const ROLE_OPTIONS: SelectOption[] = [
  { value: "All", label: "All roles" },
  { value: "seeker", label: "Seeker" },
  { value: "owner", label: "Owner" },
];

export const SORT_OPTIONS: SelectOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "name", label: "Name A–Z" },
  { value: "lastActive", label: "Last active" },
];

export const DISTRICT_OPTIONS: SelectOption[] = DISTRICTS.map((district) => ({
  value: district,
  label: district,
}));

/** Accounts are always located in a real district, not the "All Districts" filter sentinel. */
export const DISTRICT_FORM_OPTIONS: SelectOption[] = DISTRICT_OPTIONS.filter(
  (option) => option.value !== "All Districts",
);

export const PAGE_SIZE = 8;

export function formatDate(value: string): string {
  const date = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RoleBadge({ role }: { role: AccountType }) {
  return role === "owner" ? (
    <Badge tone="blue">
      <Store size={12} strokeWidth={2.4} /> Owner
    </Badge>
  ) : (
    <Badge tone="violet">
      <UserRound size={12} strokeWidth={2.4} /> Seeker
    </Badge>
  );
}

export function sortUsers(rows: AdminUser[], sort: string): AdminUser[] {
  const sorted = [...rows];
  if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "lastActive")
    sorted.sort((a, b) => b.lastActive.localeCompare(a.lastActive));
  else sorted.sort((a, b) => b.joined.localeCompare(a.joined));
  return sorted;
}

export function matchesSearch(user: AdminUser, term: string): boolean {
  if (!term) return true;
  const needle = term.trim().toLowerCase();
  return [user.name, user.email, user.phone].some((value) =>
    value.toLowerCase().includes(needle),
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-200 bg-white px-4 py-2 text-[13px] font-bold text-primary-700 transition hover:border-primary-700"
    >
      <RotateCcw size={15} strokeWidth={2.4} /> Reset filters
    </button>
  );
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  role: AccountType;
  district: string;
  town: string;
  status: UserStatus;
  verified: boolean;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  email: "",
  phone: "",
  role: "seeker",
  district: "",
  town: "",
  status: "Active",
  verified: false,
  notes: "",
};

/** Add / edit account form with inline validation and cascading district → town. */
export function UserFormModal({
  open,
  onClose,
  user,
  defaultRole = "seeker",
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  user?: AdminUser | null;
  defaultRole?: AccountType;
  onSubmit: (values: Omit<AdminUser, "id">) => void;
}) {
  const { data } = useAdminData();
  const toast = useToast();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setForm(
      user
        ? {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            district: user.district,
            town: user.town,
            status: user.status,
            verified: user.verified,
            notes: user.notes ?? "",
          }
        : { ...EMPTY_FORM, role: defaultRole },
    );
    setErrors({});
  }, [open, user, defaultRole]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    const email = form.email.trim().toLowerCase();

    if (!form.name.trim()) next.name = "Full name is required.";
    if (!email) next.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email address.";
    else if (
      data.users.some(
        (existing) =>
          existing.email.trim().toLowerCase() === email && existing.id !== user?.id,
      )
    )
      next.email = "An account with this email already exists.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.district) next.district = "Select a district.";
    if (!form.town) next.town = "Select a town.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    onSubmit({
      name: form.name.trim(),
      email,
      phone: form.phone.trim(),
      role: form.role,
      district: form.district,
      town: form.town,
      status: form.status,
      verified: form.verified,
      notes: form.notes.trim() || undefined,
      joined: user?.joined ?? today,
      lastActive: user?.lastActive ?? today,
      listings: user?.listings ?? 0,
      saved: user?.saved ?? 0,
      enquiries: user?.enquiries ?? 0,
    });
  };

  const errorText = (key: string) =>
    errors[key] ? (
      <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[12px] font-bold text-red-600">
        <AlertCircle size={13} strokeWidth={2.5} /> {errors[key]}
      </p>
    ) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? "Edit account" : "Add new user"}
      subtitle={
        user
          ? `Update the details for ${user.name}.`
          : "Create a seeker or owner account on Bodima.lk."
      }
      maxWidth="max-w-2xl"
      footer={
        <>
          <button type="button" className={secondaryBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="user-form" className={primaryBtn}>
            {user ? "Save changes" : "Add user"}
          </button>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="uf-name">
            <input
              id="uf-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Nimali Fernando"
              autoComplete="name"
              className={inputClass}
            />
            {errorText("name")}
          </Field>
          <Field label="Email address" htmlFor="uf-email">
            <input
              id="uf-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              className={inputClass}
            />
            {errorText("email")}
          </Field>
          <Field label="Phone number" htmlFor="uf-phone">
            <input
              id="uf-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+94 77 123 4567"
              autoComplete="tel"
              className={inputClass}
            />
            {errorText("phone")}
          </Field>
          <Field label="Account status" htmlFor="uf-status">
            <SelectField
              value={form.status}
              onChange={(value) => set("status", value as UserStatus)}
              options={USER_STATUS_OPTIONS}
              ariaLabel="Account status"
              className="h-11 w-full"
            />
          </Field>
        </div>

        <div>
          <p className="text-[13px] font-bold text-night">Account role</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {(["seeker", "owner"] as AccountType[]).map((role) => (
              <button
                key={role}
                type="button"
                aria-pressed={form.role === role}
                onClick={() => set("role", role)}
                className={cx(
                  "flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-[14px] font-bold capitalize transition",
                  form.role === role
                    ? "border-primary-700 bg-lav text-primary-700"
                    : "border-primary-100 bg-white text-night/60 hover:border-primary-300",
                )}
              >
                {role === "owner" ? <Store size={17} /> : <UserRound size={17} />}
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="District" htmlFor="uf-district">
            <SelectField
              value={form.district}
              onChange={(value) => {
                set("district", value);
                set("town", "");
              }}
              options={DISTRICT_FORM_OPTIONS}
              placeholder="Select district"
              ariaLabel="District"
            />
            {errorText("district")}
          </Field>
          <Field label="Town" htmlFor="uf-town">
            <SelectField
              value={form.town}
              onChange={(value) => set("town", value)}
              options={townsFor(form.district).map((town) => ({ value: town, label: town }))}
              placeholder={form.district ? "Select town" : "Select a district first"}
              ariaLabel="Town"
            />
            {errorText("town")}
          </Field>
        </div>

        <Field label="Internal notes" htmlFor="uf-notes" hint="Optional — visible to admins only.">
          <textarea
            id="uf-notes"
            rows={2}
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Add context about this account…"
            className="w-full rounded-xl border border-primary-100 bg-white px-4 py-3 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
          />
        </Field>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-page px-4 py-3">
          <input
            type="checkbox"
            checked={form.verified}
            onChange={(e) => set("verified", e.target.checked)}
            className="h-4 w-4 accent-primary-700"
          />
          <span className="text-[14px] font-bold text-night">Verified account</span>
          <CheckCircle2 size={16} className="ml-auto text-primary-700" />
        </label>
      </form>
    </Modal>
  );
}

/** Read-only account summary shared by all three user pages. */
export function UserProfileDetails({
  user,
  children,
}: {
  user: AdminUser;
  children?: ReactNode;
}) {
  const metrics = [
    {
      label: user.role === "owner" ? "Properties listed" : "Listings",
      value: user.listings,
      icon: Building2,
    },
    { label: "Saved properties", value: user.saved, icon: Bookmark },
    { label: "Enquiries", value: user.enquiries, icon: MessageSquare },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar name={user.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[19px] font-extrabold text-night">{user.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium text-night/60">
            <Mail size={14} /> {user.email}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
            {user.verified ? (
              <Badge tone="green">
                <CheckCircle2 size={12} /> Verified
              </Badge>
            ) : (
              <Badge tone="gray">Unverified</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-x-6 gap-y-3 rounded-xl bg-page p-4 sm:grid-cols-2">
        <p className="flex items-center gap-2 text-[13px] font-medium text-night/70">
          <Phone size={15} className="shrink-0 text-primary-700" /> {user.phone}
        </p>
        <p className="flex items-center gap-2 text-[13px] font-medium text-night/70">
          <MapPin size={15} className="shrink-0 text-primary-700" /> {user.town}, {user.district}
        </p>
        <p className="flex items-center gap-2 text-[13px] font-medium text-night/70">
          <CalendarDays size={15} className="shrink-0 text-primary-700" /> Joined {formatDate(user.joined)}
        </p>
        <p className="flex items-center gap-2 text-[13px] font-medium text-night/70">
          <Clock3 size={15} className="shrink-0 text-primary-700" /> Last active {formatDate(user.lastActive)}
        </p>
        <p className="flex items-center gap-2 text-[12px] font-medium text-night/45 sm:col-span-2">
          Account ID #{user.id}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-primary-100 p-3 text-center">
            <Icon size={17} className="mx-auto text-primary-700" />
            <p className="mt-1.5 text-[20px] font-extrabold leading-none text-night">{value}</p>
            <p className="mt-1 text-[11px] font-bold text-night/50">{label}</p>
          </div>
        ))}
      </div>

      {user.notes && (
        <div className="rounded-xl border-l-4 border-primary-400 bg-lav px-4 py-3">
          <p className="text-[12px] font-extrabold uppercase tracking-wide text-primary-700">
            Admin notes
          </p>
          <p className="mt-1 text-[13px] font-medium leading-relaxed text-night/75">{user.notes}</p>
        </div>
      )}

      {children}
    </div>
  );
}

/** Suspend / activate / delete confirmations with a toast for each mutation. */
export function useUserModals() {
  const { setUserStatus, deleteUser } = useAdminData();
  const toast = useToast();
  const [statusTarget, setStatusTarget] = useState<AdminUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  const suspending = statusTarget?.status === "Active";

  const dialogs = (
    <>
      <ConfirmDialog
        open={statusTarget !== null}
        onClose={() => setStatusTarget(null)}
        title={suspending ? "Suspend account" : "Activate account"}
        message={
          statusTarget
            ? suspending
              ? `Suspend ${statusTarget.name}'s account? They will not be able to sign in until it is reactivated.`
              : `Reactivate ${statusTarget.name}'s account? They will regain access to Bodima.lk.`
            : ""
        }
        confirmLabel={suspending ? "Suspend account" : "Activate account"}
        danger={suspending}
        onConfirm={() => {
          if (!statusTarget) return;
          const next: UserStatus = suspending ? "Suspended" : "Active";
          setUserStatus(statusTarget.id, next);
          toast.success(`${statusTarget.name}'s account is now ${next.toLowerCase()}.`);
        }}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="Delete account"
        message={
          deleteTarget
            ? `Permanently remove ${deleteTarget.name} from Bodima.lk? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete account"
        danger
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteUser(deleteTarget.id);
          toast.success(`${deleteTarget.name} was removed from the platform.`);
        }}
      />
    </>
  );

  return {
    requestStatus: (user: AdminUser) => setStatusTarget(user),
    requestDelete: (user: AdminUser) => setDeleteTarget(user),
    dialogs,
  };
}

/** Action button cluster used in the user tables. */
export function UserRowActions({
  user,
  onView,
  onEdit,
  onStatus,
  onDelete,
}: {
  user: AdminUser;
  onView: (user: AdminUser) => void;
  onEdit?: (user: AdminUser) => void;
  onStatus: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}) {
  const suspending = user.status === "Active";
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        className={iconBtn}
        aria-label={`View profile of ${user.name}`}
        title="View profile"
        onClick={() => onView(user)}
      >
        <Eye size={16} strokeWidth={2.2} />
      </button>
      {onEdit && (
        <button
          type="button"
          className={iconBtn}
          aria-label={`Edit ${user.name}`}
          title="Edit account"
          onClick={() => onEdit(user)}
        >
          <Pencil size={16} strokeWidth={2.2} />
        </button>
      )}
      <button
        type="button"
        className={iconBtn}
        aria-label={suspending ? `Suspend ${user.name}` : `Activate ${user.name}`}
        title={suspending ? "Suspend account" : "Activate account"}
        onClick={() => onStatus(user)}
      >
        {suspending ? <Ban size={16} strokeWidth={2.2} /> : <UserCheck size={16} strokeWidth={2.2} />}
      </button>
      <button
        type="button"
        className={cx(iconBtn, "text-red-600 hover:bg-red-50")}
        aria-label={`Delete ${user.name}`}
        title="Delete account"
        onClick={() => onDelete(user)}
      >
        <Trash2 size={16} strokeWidth={2.2} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* /admin/users                                                        */
/* ------------------------------------------------------------------ */

export default function Users() {
  const { data, addUser, updateUser } = useAdminData();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q");

  const [search, setSearch] = useState(q ?? "");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewingId, setViewingId] = useState<number | null>(null);
  const { requestStatus, requestDelete, dialogs } = useUserModals();

  // The global topbar search navigates here with ?q=… — keep the table in sync.
  useEffect(() => {
    if (q !== null) {
      setSearch(q);
      setPage(1);
    }
  }, [q]);

  const seekers = data.users.filter((user) => user.role === "seeker").length;
  const owners = data.users.filter((user) => user.role === "owner").length;
  const suspended = data.users.filter((user) => user.status === "Suspended").length;

  const filtered = useMemo(() => {
    const rows = data.users.filter(
      (user) =>
        matchesSearch(user, search) &&
        (role === "All" || user.role === role) &&
        (status === "All" || user.status === status) &&
        (district === "All Districts" || user.district === district),
    );
    return sortUsers(rows, sort);
  }, [data.users, search, role, status, district, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const editing = data.users.find((user) => user.id === editingId) ?? null;
  const viewing = data.users.find((user) => user.id === viewingId) ?? null;

  const resetFilters = () => {
    setSearch("");
    setRole("All");
    setStatus("All");
    setDistrict("All Districts");
    setSort("newest");
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
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
      key: "role",
      header: "Role",
      render: (user) => <RoleBadge role={user.role} />,
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
      render: (user) => <span className="text-[13px] font-medium text-night/70">{formatDate(user.joined)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (user) => <UserStatusBadge status={user.status} />,
    },
    {
      key: "activity",
      header: "Activity",
      render: (user) => (
        <div>
          <p className="text-[12px] font-bold text-night/75">Active {formatDate(user.lastActive)}</p>
          <p className="mt-0.5 text-[11px] font-medium text-night/50">
            {user.listings} listings · {user.saved} saved · {user.enquiries} enquiries
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (user) => (
        <UserRowActions
          user={user}
          onView={(row) => setViewingId(row.id)}
          onEdit={(row) => {
            setEditingId(row.id);
            setFormOpen(true);
          }}
          onStatus={requestStatus}
          onDelete={requestDelete}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Review, search and manage every seeker and owner account on Bodima.lk."
        actions={
          <button
            type="button"
            className={primaryBtn}
            onClick={() => {
              setEditingId(null);
              setFormOpen(true);
            }}
          >
            <Plus size={17} strokeWidth={2.5} /> Add User
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={data.users.length} icon={UsersIcon} tone="violet" hint="All registered accounts" />
        <StatCard label="Seekers" value={seekers} icon={UserRound} tone="blue" hint="Looking for a place" />
        <StatCard label="Owners" value={owners} icon={Store} tone="green" hint="Property advertisers" />
        <StatCard label="Suspended accounts" value={suspended} icon={Ban} tone="red" hint="Currently restricted" />
      </div>

      <SectionCard
        title="All accounts"
        subtitle={`Showing ${filtered.length} of ${data.users.length} accounts`}
        action={<ResetButton onClick={resetFilters} />}
      >
        <div className="grid gap-3 border-b border-primary-100 p-5 sm:grid-cols-2 lg:grid-cols-6">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search name, email or phone"
            className="lg:col-span-2"
          />
          <SelectField
            value={role}
            onChange={(value) => {
              setRole(value);
              setPage(1);
            }}
            options={ROLE_OPTIONS}
            ariaLabel="Filter by role"
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
          <SelectField
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
            ariaLabel="Sort users"
          />
        </div>

        <DataTable
          columns={columns}
          rows={pageRows}
          emptyIcon={UsersIcon}
          emptyTitle="No users found"
          emptyDescription="Try a different search term or reset the filters."
          empty={
            <EmptyState
              icon={UsersIcon}
              title="No users found"
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

      <UserFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingId(null);
        }}
        user={editing}
        onSubmit={(values) => {
          if (editing) {
            updateUser(editing.id, values);
            toast.success(`Profile updated for ${values.name}.`);
          } else {
            addUser(values);
            toast.success(`${values.name} was added as a ${values.role}.`);
          }
          setFormOpen(false);
          setEditingId(null);
        }}
      />

      <Modal
        open={viewing !== null}
        onClose={() => setViewingId(null)}
        title="User profile"
        subtitle={viewing ? `Account #${viewing.id} · ${viewing.role}` : undefined}
        maxWidth="max-w-2xl"
        footer={
          <button type="button" className={secondaryBtn} onClick={() => setViewingId(null)}>
            Close
          </button>
        }
      >
        {viewing && <UserProfileDetails user={viewing} />}
      </Modal>

      {dialogs}
    </div>
  );
}
