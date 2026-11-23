import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";

const PROPERTY_TYPES = [
  "Any Type",
  "Annex",
  "Single Room",
  "Room with Facilities",
  "Whole House",
  "Apartment",
];

const PRICE_RANGES = [
  "Any Price",
  "Under Rs. 10,000",
  "Rs. 10,000 – 20,000",
  "Rs. 20,000 – 40,000",
  "Above Rs. 40,000",
];

function Dropdown({
  label,
  options,
  value,
  onChange,
  bordered = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  bordered?: boolean;
}) {
  return (
    <div
      className={`relative hidden shrink-0 md:block ${
        bordered ? "rounded-xl border border-primary-100" : ""
      }`}
    >
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-12 cursor-pointer appearance-none bg-transparent pl-5 pr-11 text-[15px] font-semibold text-night focus:outline-none ${
          bordered ? "rounded-xl" : "h-14"
        }`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2.75}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-night"
      />
    </div>
  );
}

/** White pill search bar — location input + type/price dropdowns + action button */
export default function SearchBar({
  variant = "home",
}: {
  variant?: "home" | "browse";
}) {
  const [type, setType] = useState(PROPERTY_TYPES[0]);
  const [price, setPrice] = useState(PRICE_RANGES[0]);
  const browse = variant === "browse";

  return (
    <form
      className={`flex items-center bg-white shadow-bar ${
        browse ? "gap-2.5 rounded-[22px] p-3" : "gap-1 rounded-2xl p-2.5"
      }`}
      onSubmit={(e) => e.preventDefault()}
    >
      <div
        className={`flex min-w-0 flex-1 items-center gap-3 ${
          browse ? "h-12 rounded-xl border border-primary-100 px-4" : "px-4"
        }`}
      >
        <Search
          size={browse ? 20 : 22}
          strokeWidth={2.5}
          className="shrink-0 text-night/50"
        />
        <input
          type="text"
          placeholder="Search by location..."
          className={`w-full min-w-0 bg-transparent text-[16px] font-semibold text-night placeholder:font-medium placeholder:text-night/40 focus:outline-none ${
            browse ? "h-10 text-[15px]" : "h-14"
          }`}
        />
      </div>

      {!browse && <span className="hidden h-9 w-px bg-night/10 md:block" />}
      <Dropdown
        label="Property type"
        options={PROPERTY_TYPES}
        value={type}
        onChange={setType}
        bordered={browse}
      />
      {!browse && <span className="hidden h-9 w-px bg-night/10 md:block" />}
      <Dropdown
        label="Price range"
        options={PRICE_RANGES}
        value={price}
        onChange={setPrice}
        bordered={browse}
      />

      {browse ? (
        <button
          type="submit"
          className="h-12 shrink-0 rounded-xl bg-primary-700 px-9 text-[16px] font-bold text-white transition hover:bg-primary-800"
        >
          Search
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Search"
          className="ml-1 grid h-[58px] w-[68px] shrink-0 place-items-center rounded-xl bg-accent transition hover:bg-accent-dark"
        >
          <Search size={24} strokeWidth={3} className="text-night" />
        </button>
      )}
    </form>
  );
}
