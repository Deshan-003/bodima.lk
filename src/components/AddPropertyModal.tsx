import { useState } from "react";
import { Plus, X } from "lucide-react";
import { DISTRICTS, townsFor } from "../data/locations";

export type NewProperty = {
  id: number;
  title: string;
  img: string;
  price: number;
  district: string;
  town: string;
  views: number;
  description?: string;
};

const FACILITIES = ["WiFi", "AC", "Parking", "Meals"];
const PROPERTY_TYPES = ["Room", "Annex", "House", "Apartment"];

/** Add Property dialog styled from the reference mockup */
export default function AddPropertyModal({
  open,
  onClose,
  onPublish,
}: {
  open: boolean;
  onClose: () => void;
  onPublish: (property: NewProperty) => void;
}) {
  const [title, setTitle] = useState("");
  const [district, setDistrict] = useState("All Districts");
  const [town, setTown] = useState("All Towns");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("Room");
  const [description, setDescription] = useState("");
  const [facilities, setFacilities] = useState<string[]>(["WiFi"]);
  const [photo, setPhoto] = useState("");

  if (!open) return null;

  const reset = () => {
    setTitle("");
    setDistrict("All Districts");
    setTown("All Towns");
    setPrice("");
    setPropertyType("Room");
    setDescription("");
    setFacilities(["WiFi"]);
    setPhoto("");
  };

  const publish = () => {
    if (!title.trim() || !price) return;
    onPublish({
      id: Date.now(),
      title: title.trim(),
      img:
        photo ||
        ["/assets/listing-colombo.jpg", "/assets/listing-kandy.jpg"][
          Math.floor(Math.random() * 2)
        ],
      price: Number(price),
      district,
      town,
      views: 0,
      description: description.trim(),
    });
    reset();
    onClose();
  };

  const fieldClass =
    "mt-2 h-11 w-full rounded-xl border border-primary-100 bg-white px-4 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none";
  const labelClass = "block text-[13px] font-bold text-night";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4"
      onClick={onClose}
    >
      <div
        className="my-8 w-full max-w-[720px] rounded-2xl bg-[#F7F6FC] p-7 shadow-bar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[24px] font-extrabold tracking-tight text-night">
              Add New Property
            </h2>
            <p className="mt-1 text-[13px] font-medium text-night/55">
              Fill in the details to list your boarding place.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close form"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-night/50 transition hover:bg-white"
          >
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="ap-title" className={labelClass}>
              Property Title
            </label>
            <input
              id="ap-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spacious Room in Colombo 07"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="ap-district" className={labelClass}>
              District
            </label>
            <select
              id="ap-district"
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setTown("All Towns");
              }}
              className={`${fieldClass} cursor-pointer`}
            >
              {DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ap-town" className={labelClass}>
              Town
            </label>
            <select
              id="ap-town"
              value={town}
              onChange={(e) => setTown(e.target.value)}
              className={`${fieldClass} cursor-pointer`}
            >
              <option>All Towns</option>
              {townsFor(district).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ap-rent" className={labelClass}>
              Monthly Rent (Rs.)
            </label>
            <input
              id="ap-rent"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="ap-type" className={labelClass}>
              Property Type
            </label>
            <select
              id="ap-type"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className={`${fieldClass} cursor-pointer`}
            >
              {PROPERTY_TYPES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ap-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="ap-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe your property..."
              className="mt-2 w-full resize-none rounded-xl border border-primary-100 bg-white px-4 py-3 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <p className={labelClass}>Facilities</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {FACILITIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() =>
                    setFacilities((prev) =>
                      prev.includes(f)
                        ? prev.filter((x) => x !== f)
                        : [...prev, f],
                    )
                  }
                  className={`rounded-full px-5 py-2 text-[13px] font-bold transition ${
                    facilities.includes(f)
                      ? "bg-primary-700 text-white"
                      : "bg-white text-night/60 hover:bg-primary-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-primary-100 bg-white px-5 py-3 text-[14px] font-bold text-night/70 transition hover:border-primary-700">
            <Plus size={18} strokeWidth={2.5} />
            Add Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhoto(URL.createObjectURL(file));
              }}
            />
          </label>
          {photo && (
            <img
              src={photo}
              alt="Selected property"
              className="h-11 w-14 rounded-lg object-cover"
            />
          )}
          <button
            type="button"
            onClick={publish}
            disabled={!title.trim() || !price}
            className="ml-auto rounded-xl bg-primary-700 px-7 py-3 text-[14px] font-extrabold text-white shadow-cta transition enabled:hover:bg-primary-800 disabled:opacity-40"
          >
            Publish Property
          </button>
        </div>
      </div>
    </div>
  );
}
