import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Clock3,
  Flag,
  Plus,
  RotateCcw,
  X,
} from "lucide-react";
import ListingTable, { ListingDetailModal } from "../components/ListingTable";
import {
  ConfirmDialog,
  Field,
  Modal,
  PageHeader,
  SearchInput,
  SectionCard,
  SelectField,
  StatCard,
  inputClass,
  primaryBtn,
  secondaryBtn,
  useToast,
} from "../components/ui";
import { useAdminData } from "../data/store";
import type { AdminListing, ListingStatus } from "../data/types";
import { ALL_TOWNS, DISTRICTS, townsFor } from "../../data/locations";

const PAGE_SIZE = 8;
const STATUSES: ListingStatus[] = [
  "Pending", "Approved", "Rejected", "Active", "Inactive", "Reported",
];
const BOARDING_TYPES = ["Room", "Annex", "House", "Apartment"];
const FACILITIES = ["Wi-Fi", "AC", "Parking", "Meals", "Laundry", "Study Desk", "Hot Water", "Garden"];
const IMAGE_OPTIONS = [
  "/assets/listing-colombo.jpg",
  "/assets/listing-wellawatte.jpg",
  "/assets/listing-kandy.jpg",
  "/assets/listing-gampaha.jpg",
  "/assets/listing-nugegoda.jpg",
  "/assets/listing-moratuwa.jpg",
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price-high", label: "Rent: high to low" },
  { value: "price-low", label: "Rent: low to high" },
  { value: "views", label: "Most viewed" },
];

interface ListingForm {
  title: string;
  district: string;
  town: string;
  ownerId: number;
  price: string;
  type: "Male" | "Female" | "Any";
  boardingType: string;
  facilities: string[];
  description: string;
  img: string;
  status: ListingStatus;
}

export default function Listings() {
  const toast = useToast();
  const { data, addListing, setListingStatus, toggleFeatured, deleteListing } = useAdminData();
  const [searchParams, setSearchParams] = useSearchParams();

  const owners = useMemo(() => data.users.filter((user) => user.role === "owner"), [data.users]);
  const emptyForm = (): ListingForm => ({
    title: "",
    district: "",
    town: "",
    ownerId: owners[0]?.id ?? 0,
    price: "",
    type: "Any",
    boardingType: "Room",
    facilities: [],
    description: "",
    img: IMAGE_OPTIONS[0],
    status: "Pending",
  });

  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [boardingType, setBoardingType] = useState("");
  const [status, setStatus] = useState(() => searchParams.get("status") ?? "");
  const [featured, setFeatured] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [ownerFilter, setOwnerFilter] = useState<number | null>(() => {
    const raw = searchParams.get("owner");
    const parsed = raw ? Number(raw) : NaN;
    return raw && Number.isFinite(parsed) ? parsed : null;
  });
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<ListingForm>(emptyForm);
  const [errors, setErrors] = useState<string[]>([]);
  const [viewing, setViewing] = useState<AdminListing | null>(null);
  const [deleting, setDeleting] = useState<AdminListing | null>(null);

  // Owners page deep-links here with ?owner=<id>; other pages may preset ?status=.
  useEffect(() => {
    const owner = searchParams.get("owner");
    const parsed = owner ? Number(owner) : NaN;
    setOwnerFilter(owner && Number.isFinite(parsed) ? parsed : null);
    const preset = searchParams.get("status");
    if (preset) setStatus(preset);
  }, [searchParams]);

  const updateForm = <K extends keyof ListingForm>(key: K, value: ListingForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const rows = data.listings.filter((listing) => {
      if (ownerFilter !== null && listing.ownerId !== ownerFilter) return false;
      if (
        query &&
        ![listing.title, listing.ownerName, listing.town, listing.location, listing.district]
          .some((value) => value?.toLowerCase().includes(query))
      )
        return false;
      if (district && listing.district !== district) return false;
      if (town && listing.town !== town) return false;
      if (boardingType && listing.boardingType !== boardingType) return false;
      if (status && listing.status !== status) return false;
      if (featured === "yes" && !listing.featured) return false;
      if (featured === "no" && listing.featured) return false;
      return true;
    });
    const sorted = [...rows];
    if (sort === "price-high") sorted.sort((a, b) => b.price - a.price);
    else if (sort === "price-low") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "views") sorted.sort((a, b) => b.views - a.views);
    else sorted.sort((a, b) => b.submitted.localeCompare(a.submitted));
    return sorted;
  }, [data.listings, search, district, town, boardingType, status, featured, sort, ownerFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const changeFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const resetFilters = () => {
    setSearch("");
    setDistrict("");
    setTown("");
    setBoardingType("");
    setStatus("");
    setFeatured("");
    setSort("newest");
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const clearParam = (key: "owner" | "status") => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
    if (key === "status") setStatus("");
    setPage(1);
  };

  const stats = {
    total: data.listings.length,
    active: data.listings.filter((listing) => listing.status === "Active").length,
    pending: data.listings.filter((listing) => listing.status === "Pending").length,
    reported: data.listings.filter(
      (listing) => listing.status === "Reported" || listing.reports > 0,
    ).length,
  };

  const handleApprove = (listing: AdminListing) => {
    setListingStatus(listing.id, "Approved");
    toast.success(`Approved "${listing.title}".`);
  };
  const handleReject = (listing: AdminListing) => {
    setListingStatus(listing.id, "Rejected");
    toast.info(`Rejected "${listing.title}".`);
  };
  const handleStatus = (listing: AdminListing, next: ListingStatus) => {
    setListingStatus(listing.id, next);
    toast.success(`Status of "${listing.title}" changed to ${next}.`);
  };
  const handleFeature = (listing: AdminListing) => {
    toggleFeatured(listing.id);
    toast.success(
      listing.featured
        ? `Removed "${listing.title}" from featured listings.`
        : `Marked "${listing.title}" as featured.`,
    );
  };
  const handleDelete = () => {
    if (!deleting) return;
    deleteListing(deleting.id);
    toast.success(`Deleted listing "${deleting.title}".`);
    setDeleting(null);
    if (viewing?.id === deleting.id) setViewing(null);
  };

  const openAdd = () => {
    setForm(emptyForm());
    setErrors([]);
    setAddOpen(true);
  };

  const submitAdd = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: string[] = [];
    if (!form.title.trim()) nextErrors.push("A listing title is required.");
    if (!form.district) nextErrors.push("Select a district.");
    if (!form.town) nextErrors.push("Select a town.");
    if (!Number.isFinite(Number(form.price)) || Number(form.price) <= 0)
      nextErrors.push("Enter a monthly rent greater than zero.");
    const owner = owners.find((user) => user.id === form.ownerId);
    if (!owner) nextErrors.push("Select a property owner.");
    setErrors(nextErrors);
    if (nextErrors.length || !owner) {
      toast.error("Please correct the highlighted fields.");
      return;
    }
    addListing({
      title: form.title.trim(),
      location: form.town,
      district: form.district,
      town: form.town,
      price: Number(form.price),
      img: form.img,
      type: form.type,
      facilities: form.facilities,
      boardingType: form.boardingType,
      description: form.description.trim(),
      ownerId: owner.id,
      ownerName: owner.name,
      status: form.status,
      featured: false,
      submitted: new Date().toISOString().slice(0, 10),
      views: 0,
      enquiries: 0,
      reports: 0,
    });
    toast.success(`Listing "${form.title.trim()}" was added.`);
    setAddOpen(false);
    setPage(1);
  };

  const townOptions = (form.district ? townsFor(form.district) : ALL_TOWNS).map((value) => ({
    value,
    label: value,
  }));
  const filterTowns = (district ? townsFor(district) : ALL_TOWNS).map((value) => ({
    value,
    label: value,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Listings"
        subtitle="Review, approve and manage every boarding advertised on Bodima.lk."
        actions={
          <button type="button" className={primaryBtn} onClick={openAdd}>
            <Plus size={17} strokeWidth={2.5} /> Add Listing
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total listings" value={stats.total} hint="Across all districts" icon={Building2} tone="violet" />
        <StatCard label="Active" value={stats.active} hint="Live on the marketplace" icon={CheckCircle2} tone="green" />
        <StatCard label="Pending" value={stats.pending} hint="Awaiting moderation" icon={Clock3} tone="amber" />
        <StatCard label="Reported" value={stats.reported} hint="Need a moderation decision" icon={Flag} tone="red" />
      </div>

      {(ownerFilter !== null || Boolean(searchParams.get("status"))) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-bold text-night/50">Active filters:</span>
          {ownerFilter !== null && (
            <button
              type="button"
              onClick={() => clearParam("owner")}
              aria-label="Clear owner filter"
              className="inline-flex items-center gap-1.5 rounded-full bg-lav px-3 py-1.5 text-[12px] font-bold text-primary-700 hover:bg-primary-100"
            >
              Owner: {data.users.find((user) => user.id === ownerFilter)?.name ?? `#${ownerFilter}`}
              <X size={13} />
            </button>
          )}
          {Boolean(searchParams.get("status")) && (
            <button
              type="button"
              onClick={() => clearParam("status")}
              aria-label="Clear status filter"
              className="inline-flex items-center gap-1.5 rounded-full bg-lav px-3 py-1.5 text-[12px] font-bold text-primary-700 hover:bg-primary-100"
            >
              Status: {searchParams.get("status")}
              <X size={13} />
            </button>
          )}
        </div>
      )}

      <SectionCard
        title="Filters"
        action={
          <button type="button" className={secondaryBtn} onClick={resetFilters}>
            <RotateCcw size={15} /> Reset
          </button>
        }
      >
        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <SearchInput
            value={search}
            onChange={changeFilter(setSearch)}
            placeholder="Search title, owner or town"
            className="lg:col-span-2"
          />
          <SelectField
            value={district}
            onChange={(value) => {
              setDistrict(value);
              setTown("");
              setPage(1);
            }}
            options={DISTRICTS.filter((name) => name !== "All Districts").map((name) => ({ value: name, label: name }))}
            placeholder="All districts"
            ariaLabel="Filter by district"
          />
          <SelectField
            value={town}
            onChange={changeFilter(setTown)}
            options={filterTowns}
            placeholder="All towns"
            ariaLabel="Filter by town"
          />
          <SelectField
            value={boardingType}
            onChange={changeFilter(setBoardingType)}
            options={BOARDING_TYPES.map((value) => ({ value, label: value }))}
            placeholder="All boarding types"
            ariaLabel="Filter by boarding type"
          />
          <SelectField
            value={status}
            onChange={changeFilter(setStatus)}
            options={STATUSES.map((value) => ({ value, label: value }))}
            placeholder="All statuses"
            ariaLabel="Filter by status"
          />
          <SelectField
            value={featured}
            onChange={changeFilter(setFeatured)}
            options={[
              { value: "yes", label: "Featured only" },
              { value: "no", label: "Not featured" },
            ]}
            placeholder="Any featured state"
            ariaLabel="Filter by featured state"
          />
          <SelectField
            value={sort}
            onChange={changeFilter(setSort)}
            options={SORT_OPTIONS}
            ariaLabel="Sort listings"
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
        onApprove={handleApprove}
        onReject={handleReject}
        onFeature={handleFeature}
        onStatusChange={handleStatus}
        onDelete={(listing) => setDeleting(listing)}
        onView={setViewing}
        emptyTitle="No listings match these filters"
        emptyDescription="Try a different search or reset the filters to see the full catalogue."
        emptyAction={
          <button type="button" className={secondaryBtn} onClick={resetFilters}>
            Clear filters
          </button>
        }
      />

      <ListingDetailModal listing={viewing} onClose={() => setViewing(null)} reports={data.reports} />

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add a new listing"
        subtitle="Create a boarding advert as an administrator."
        maxWidth="max-w-2xl"
        footer={
          <>
            <button type="button" className={secondaryBtn} onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="add-listing-form" className={primaryBtn}>
              Add Listing
            </button>
          </>
        }
      >
        <form id="add-listing-form" onSubmit={submitAdd} className="space-y-4">
          {errors.length > 0 && (
            <ul className="rounded-xl bg-red-50 px-4 py-3 text-[12px] font-semibold text-red-600" role="alert">
              {errors.map((error) => (
                <li key={error}>• {error}</li>
              ))}
            </ul>
          )}
          <Field label="Listing title" htmlFor="listing-title">
            <input
              id="listing-title"
              className={inputClass}
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="e.g. Bright Room near University of Colombo"
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="District" htmlFor="listing-district">
              <SelectField
                value={form.district}
                onChange={(value) => {
                  updateForm("district", value);
                  updateForm("town", "");
                }}
                options={DISTRICTS.filter((name) => name !== "All Districts").map((name) => ({ value: name, label: name }))}
                placeholder="Select district"
                className="w-full"
              />
            </Field>
            <Field label="Town" htmlFor="listing-town">
              <SelectField
                value={form.town}
                onChange={(value) => updateForm("town", value)}
                options={townOptions}
                placeholder="Select town"
                className="w-full"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Owner" htmlFor="listing-owner">
              <SelectField
                value={String(form.ownerId)}
                onChange={(value) => updateForm("ownerId", Number(value))}
                options={owners.map((owner) => ({ value: String(owner.id), label: owner.name }))}
                placeholder="Select owner"
                className="w-full"
              />
            </Field>
            <Field label="Monthly rent (Rs.)" htmlFor="listing-price">
              <input
                id="listing-price"
                type="number"
                min={1}
                className={inputClass}
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
                placeholder="15000"
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Tenant type" htmlFor="listing-type">
              <SelectField
                value={form.type}
                onChange={(value) => updateForm("type", value as ListingForm["type"])}
                options={["Male", "Female", "Any"].map((value) => ({ value, label: value }))}
                className="w-full"
              />
            </Field>
            <Field label="Boarding type" htmlFor="listing-boarding">
              <SelectField
                value={form.boardingType}
                onChange={(value) => updateForm("boardingType", value)}
                options={BOARDING_TYPES.map((value) => ({ value, label: value }))}
                className="w-full"
              />
            </Field>
            <Field label="Initial status" htmlFor="listing-status">
              <SelectField
                value={form.status}
                onChange={(value) => updateForm("status", value as ListingStatus)}
                options={STATUSES.map((value) => ({ value, label: value }))}
                className="w-full"
              />
            </Field>
          </div>
          <Field label="Facilities" hint="Click to toggle each included facility.">
            <div className="flex flex-wrap gap-2">
              {FACILITIES.map((facility) => {
                const active = form.facilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      updateForm(
                        "facilities",
                        active
                          ? form.facilities.filter((item) => item !== facility)
                          : [...form.facilities, facility],
                      )
                    }
                    className={
                      active
                        ? "rounded-full bg-primary-700 px-3 py-1.5 text-[12px] font-bold text-white"
                        : "rounded-full bg-lav px-3 py-1.5 text-[12px] font-bold text-primary-700 hover:bg-primary-100"
                    }
                  >
                    {facility}
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Photo" htmlFor="listing-image">
            <div className="flex flex-wrap items-center gap-3">
              <SelectField
                value={form.img}
                onChange={(value) => updateForm("img", value)}
                options={IMAGE_OPTIONS.map((value) => ({ value, label: value.split("/").pop() ?? value }))}
                className="max-w-xs flex-1"
                ariaLabel="Listing photo"
              />
              <img src={form.img} alt="Selected listing preview" className="h-12 w-16 rounded-lg object-cover" />
            </div>
          </Field>
          <Field label="Description" htmlFor="listing-description">
            <textarea
              id="listing-description"
              rows={3}
              className={`${inputClass} h-auto py-3`}
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              placeholder="Describe the property, location and house rules…"
            />
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete listing?"
        message={`"${deleting?.title ?? ""}" will be permanently removed from the marketplace. This cannot be undone.`}
        confirmLabel="Delete listing"
        danger
        onConfirm={handleDelete}
      />
    </div>
  );
}
