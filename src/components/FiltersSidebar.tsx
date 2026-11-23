import { Check, ChevronDown } from "lucide-react";

export type Filters = {
  district: string;
  min: number;
  max: number;
  types: string[];
  facilities: string[];
};

export const INITIAL_FILTERS: Filters = {
  district: "All Districts",
  min: 0,
  max: 50000,
  types: [],
  facilities: [],
};

const DISTRICTS = [
  "All Districts",
  "Colombo",
  "Gampaha",
  "Kandy",
  "Galle",
  "Negombo",
  "Kalutara",
];

const BOARDING_TYPES = ["Male", "Female", "Any"];
const FACILITIES = ["Wi-Fi", "AC", "Parking", "Meals"];

function SectionLabel({ children }: { children: string }) {
  return (
    <h4 className="text-[17px] font-bold text-night">{children}</h4>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-3 text-[15px] font-medium text-night/80">
      <span
        className={`grid h-5 w-5 place-items-center rounded-md border-2 transition ${
          checked
            ? "border-primary-700 bg-primary-700"
            : "border-primary-200 bg-white"
        }`}
      >
        {checked && <Check size={14} strokeWidth={3.5} className="text-white" />}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

function toggleIn(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

/** Left filter panel — district, dual price slider, boarding type + facilities */
export default function FiltersSidebar({
  filters,
  onChange,
  onApply,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const priceLabel = `Rs. ${filters.min.toLocaleString()} - ${
    filters.max >= 50000 ? "50,000+" : filters.max.toLocaleString()
  }`;

  return (
    <aside className="space-y-7">
      <h2 className="text-[26px] font-extrabold tracking-tight text-night">
        Filters
      </h2>

      {/* Location */}
      <div className="space-y-3">
        <SectionLabel>Location</SectionLabel>
        <div className="relative">
          <select
            aria-label="District"
            value={filters.district}
            onChange={(e) => set({ district: e.target.value })}
            className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-primary-100 bg-white pl-4 pr-10 text-[15px] font-semibold text-night focus:outline-none"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={2.75}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-night"
          />
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <SectionLabel>Price Range</SectionLabel>
        <p className="text-[15px] font-medium text-night/60">{priceLabel}</p>
        <div className="dual-range pt-1">
          <div className="absolute top-[9.5px] h-[5px] w-full rounded-full bg-primary-100" />
          <div
            className="absolute top-[9.5px] h-[5px] rounded-full bg-primary-600"
            style={{
              left: `${(filters.min / 50000) * 100}%`,
              right: `${100 - (filters.max / 50000) * 100}%`,
            }}
          />
          <input
            type="range"
            aria-label="Minimum price"
            min={0}
            max={50000}
            step={500}
            value={filters.min}
            onChange={(e) =>
              set({ min: Math.min(Number(e.target.value), filters.max - 500) })
            }
            className="thumb-hollow"
          />
          <input
            type="range"
            aria-label="Maximum price"
            min={0}
            max={50000}
            step={500}
            value={filters.max}
            onChange={(e) =>
              set({ max: Math.max(Number(e.target.value), filters.min + 500) })
            }
            className="thumb-solid"
          />
        </div>
      </div>

      {/* Boarding type */}
      <div className="space-y-3">
        <SectionLabel>Boarding Type</SectionLabel>
        <div className="space-y-3">
          {BOARDING_TYPES.map((t) => (
            <Checkbox
              key={t}
              label={t}
              checked={filters.types.includes(t)}
              onChange={() => set({ types: toggleIn(filters.types, t) })}
            />
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div className="space-y-3">
        <SectionLabel>Facilities</SectionLabel>
        <div className="space-y-3">
          {FACILITIES.map((f) => (
            <Checkbox
              key={f}
              label={f}
              checked={filters.facilities.includes(f)}
              onChange={() => set({ facilities: toggleIn(filters.facilities, f) })}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-1">
        <button
          onClick={onApply}
          className="h-12 w-full rounded-xl bg-primary-700 text-[16px] font-bold text-white transition hover:bg-primary-800"
        >
          Apply Filters
        </button>
        <button
          onClick={onReset}
          className="h-12 w-full rounded-xl border-2 border-primary-200 bg-white text-[16px] font-bold text-primary-700 transition hover:border-primary-700"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}
