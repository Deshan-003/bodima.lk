import { useMemo, useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { formatPrice } from "../components/ListingTable";
import {
  Badge,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Field,
  ListingStatusBadge,
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
  inputClass,
  primaryBtn,
  secondaryBtn,
  useToast,
  type Column,
} from "../components/ui";
import { useAdminData } from "../data/store";
import type { AdminListing, LocationEntry } from "../data/types";
import { DISTRICTS } from "../../data/locations";

const PAGE_SIZE = 10;
const CUSTOM_DISTRICT = "__custom";

interface LocationForm {
  district: string;
  customDistrict: string;
  town: string;
  listings: string;
  status: "Active" | "Inactive";
}

export default function Locations() {
  const toast = useToast();
  const { data, addLocation, updateLocation, deleteLocation } = useAdminData();
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LocationForm>(emptyForm());
  const [errors, setErrors] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<LocationEntry | null>(null);
  const [propertiesFor, setPropertiesFor] = useState<LocationEntry | null>(null);

  function emptyForm(): LocationForm {
    return {
      district: "",
      customDistrict: "",
      town: "",
      listings: "0",
      status: "Active",
    };
  }

  const stats = useMemo(() => {
    const districts = new Set(data.locations.map((location) => location.district));
    const towns = new Set(data.locations.map((location) => location.town));
    return {
      districts: districts.size,
      towns: towns.size,
      active: data.locations.filter((location) => location.status === "Active").length,
      properties: data.locations.reduce((sum, location) => sum + location.listings, 0),
    };
  }, [data.locations]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return data.locations.filter((location) => {
      if (district && location.district !== district) return false;
      if (status && location.status !== status) return false;
      if (query && ![location.district, location.town].some((value) => value.toLowerCase().includes(query)))
        return false;
      return true;
    });
  }, [data.locations, search, district, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const resetFilters = () => {
    setSearch("");
    setDistrict("");
    setStatus("");
    setPage(1);
  };

  const updateForm = <K extends keyof LocationForm>(key: K, value: LocationForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const openAdd = () => {
    setForm(emptyForm());
    setEditingId(null);
    setErrors([]);
    setFormOpen(true);
  };

  const openEdit = (location: LocationEntry) => {
    const knownDistrict = DISTRICTS.includes(location.district) && location.district !== "All Districts";
    setForm({
      district: knownDistrict ? location.district : CUSTOM_DISTRICT,
      customDistrict: knownDistrict ? "" : location.district,
      town: location.town,
      listings: String(location.listings),
      status: location.status,
    });
    setEditingId(location.id);
    setErrors([]);
    setFormOpen(true);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const resolvedDistrict = form.district === CUSTOM_DISTRICT ? form.customDistrict.trim() : form.district;
    const town = form.town.trim();
    const count = Number(form.listings);
    const nextErrors: string[] = [];
    if (!resolvedDistrict) nextErrors.push("Select or enter a district.");
    if (!town) nextErrors.push("A town name is required.");
    if (!Number.isInteger(count) || count < 0) nextErrors.push("Properties must be a whole number of zero or more.");
    if (
      resolvedDistrict &&
      town &&
      data.locations.some(
        (location) =>
          location.id !== editingId &&
          location.district.toLowerCase() === resolvedDistrict.toLowerCase() &&
          location.town.toLowerCase() === town.toLowerCase(),
      )
    )
      nextErrors.push("That district/town pair already exists.");
    setErrors(nextErrors);
    if (nextErrors.length) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    const payload = { district: resolvedDistrict, town, listings: count, status: form.status };
    if (editingId !== null) {
      updateLocation(editingId, payload);
      toast.success(`Updated ${town}, ${resolvedDistrict}.`);
    } else {
      addLocation(payload);
      toast.success(`Added ${town}, ${resolvedDistrict}.`);
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    deleteLocation(deleting.id);
    toast.success(`Removed ${deleting.town}, ${deleting.district} from the location list.`);
    setDeleting(null);
  };

  const properties: AdminListing[] = propertiesFor
    ? data.listings.filter(
        (listing) => listing.district === propertiesFor.district && listing.town === propertiesFor.town,
      )
    : [];

  const columns: Column<LocationEntry>[] = [
    {
      key: "district",
      header: "District",
      render: (location) => (
        <span className="inline-flex items-center gap-2 text-[13px] font-bold text-night">
          <MapPin size={14} className="text-primary-700" /> {location.district}
        </span>
      ),
    },
    {
      key: "town",
      header: "Town",
      render: (location) => <span className="text-[13px] font-semibold text-night/75">{location.town}</span>,
    },
    {
      key: "properties",
      header: "Properties",
      render: (location) => (
        <button
          type="button"
          onClick={() => setPropertiesFor(location)}
          aria-label={`View properties in ${location.town}, ${location.district}`}
          className="inline-flex items-center gap-1.5 text-[13px] font-extrabold text-primary-700 hover:underline"
        >
          <Building2 size={14} /> {location.listings}
        </button>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (location) => (
        <Badge tone={location.status === "Active" ? "green" : "gray"}>{location.status}</Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (location) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openEdit(location)}
            aria-label={`Edit location ${location.town}, ${location.district}`}
            title="Edit location"
            className={iconBtn}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => setDeleting(location)}
            aria-label={`Delete location ${location.town}, ${location.district}`}
            title="Delete location"
            className={cx(iconBtn, "text-red-600 hover:bg-red-50")}
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
        title="Locations"
        subtitle="Maintain the districts and towns available across Bodima.lk."
        actions={
          <button type="button" className={primaryBtn} onClick={openAdd}>
            <Plus size={17} strokeWidth={2.5} /> Add Location
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Districts" value={stats.districts} hint="Covered by the platform" icon={MapPin} tone="violet" />
        <StatCard label="Towns" value={stats.towns} hint="Unique towns in the directory" icon={MapPin} tone="blue" />
        <StatCard label="Active locations" value={stats.active} hint="Visible to seekers" icon={CheckCircle2} tone="green" />
        <StatCard label="Properties covered" value={stats.properties} hint="Listings in the location directory" icon={Building2} tone="amber" />
      </div>

      <SectionCard
        title="Filter locations"
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
            placeholder="Search town or district"
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
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
            placeholder="All statuses"
            ariaLabel="Filter by status"
          />
        </div>
      </SectionCard>

      <div className={cardClass}>
        <DataTable
          columns={columns}
          rows={pageRows}
          empty={
            <EmptyState
              icon={MapPin}
              title="No locations found"
              description="Try a different search or add a new district/town pair."
            />
          }
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
          total={filtered.length}
          pageSize={PAGE_SIZE}
        />
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingId !== null ? "Edit location" : "Add a location"}
        subtitle="Districts and towns power the marketplace browse filters."
        maxWidth="max-w-lg"
        footer={
          <>
            <button type="button" className={secondaryBtn} onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="location-form" className={primaryBtn}>
              {editingId !== null ? "Save changes" : "Add Location"}
            </button>
          </>
        }
      >
        <form id="location-form" onSubmit={submit} className="space-y-4">
          {errors.length > 0 && (
            <ul className="rounded-xl bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600" role="alert">
              {errors.map((error) => (
                <li key={error}>• {error}</li>
              ))}
            </ul>
          )}
          <Field label="District" htmlFor="location-district">
            <SelectField
              value={form.district}
              onChange={(value) => updateForm("district", value)}
              options={[
                ...DISTRICTS.filter((name) => name !== "All Districts").map((name) => ({ value: name, label: name })),
                { value: CUSTOM_DISTRICT, label: "Other district (type below)" },
              ]}
              placeholder="Select district"
              className="w-full"
              ariaLabel="District"
            />
          </Field>
          {form.district === CUSTOM_DISTRICT && (
            <Field label="Custom district" htmlFor="location-custom-district">
              <input
                id="location-custom-district"
                className={inputClass}
                value={form.customDistrict}
                onChange={(event) => updateForm("customDistrict", event.target.value)}
                placeholder="e.g. Matara"
              />
            </Field>
          )}
          <Field label="Town" htmlFor="location-town">
            <input
              id="location-town"
              className={inputClass}
              value={form.town}
              onChange={(event) => updateForm("town", event.target.value)}
              placeholder="e.g. Colombo 07"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Properties" htmlFor="location-properties" hint="Number of listings in this town.">
              <input
                id="location-properties"
                type="number"
                min={0}
                step={1}
                className={inputClass}
                value={form.listings}
                onChange={(event) => updateForm("listings", event.target.value)}
              />
            </Field>
            <Field label="Status" htmlFor="location-status">
              <SelectField
                value={form.status}
                onChange={(value) => updateForm("status", value as LocationForm["status"])}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
                className="w-full"
                ariaLabel="Location status"
              />
            </Field>
          </div>
        </form>
      </Modal>

      <Modal
        open={Boolean(propertiesFor)}
        onClose={() => setPropertiesFor(null)}
        title="Properties by location"
        subtitle={propertiesFor ? `${propertiesFor.town}, ${propertiesFor.district}` : undefined}
        maxWidth="max-w-xl"
        footer={
          <button type="button" className={secondaryBtn} onClick={() => setPropertiesFor(null)}>
            Close
          </button>
        }
      >
        {properties.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No listings in this location yet"
            description="New boarding submissions for this town will show up here."
          />
        ) : (
          <ul className="space-y-2">
            {properties.map((listing) => (
              <li
                key={listing.id}
                className="flex items-center gap-3 rounded-xl border border-primary-100 p-2.5"
              >
                <img src={listing.img} alt="" className="h-12 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-extrabold text-night">{listing.title}</p>
                  <p className="mt-0.5 text-[12px] font-bold text-primary-700">{formatPrice(listing.price)}</p>
                </div>
                <ListingStatusBadge status={listing.status} />
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this location?"
        message={`${deleting?.town ?? ""}, ${deleting?.district ?? ""} will be removed from the location directory. Existing listings are not deleted.`}
        confirmLabel="Delete location"
        danger
        onConfirm={confirmDelete}
      />
    </div>
  );
}
