import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import Footer from "../components/Footer";
import FiltersSidebar, {
  INITIAL_FILTERS,
  type Filters,
} from "../components/FiltersSidebar";
import ListingCard from "../components/ListingCard";
import { LISTINGS, type Listing } from "../data/listings";

const PER_PAGE = 6;

const SORT_OPTIONS = [
  "Most Recent",
  "Price: Low to High",
  "Price: High to Low",
] as const;

type SortOption = (typeof SORT_OPTIONS)[number];

function matchesFilters(listing: Listing, f: Filters): boolean {
  if (f.district !== "All Districts" && listing.district !== f.district) {
    return false;
  }
  if (f.town !== "All Towns" && listing.town !== f.town) {
    return false;
  }
  if (
    f.propertyType !== "Any Type" &&
    listing.boardingType !== f.propertyType
  ) {
    return false;
  }
  if (listing.price < f.min || listing.price > f.max) {
    return false;
  }
  if (f.types.length > 0 && !f.types.includes(listing.type)) {
    return false;
  }
  if (
    f.facilities.length > 0 &&
    !f.facilities.every((fac) => listing.facilities.includes(fac))
  ) {
    return false;
  }
  return true;
}

function sortListings(listings: Listing[], sort: SortOption): Listing[] {
  const copy = [...listings];
  if (sort === "Price: Low to High") copy.sort((a, b) => a.price - b.price);
  if (sort === "Price: High to Low") copy.sort((a, b) => b.price - a.price);
  return copy;
}

/** Browse page — purple search hero, filters sidebar, listing grid, pagination */
export default function Browse() {
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [applied, setApplied] = useState<Filters>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortOption>("Most Recent");
  const [page, setPage] = useState(1);

  const results = useMemo(
    () => sortListings(LISTINGS.filter((l) => matchesFilters(l, applied)), sort),
    [applied, sort],
  );
  const pageCount = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  return (
    <>
      {/* Purple search hero */}
      <section className="relative overflow-hidden bg-[#33217F]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2E1E79] via-[#3A278B] to-[#6A54C8]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,110,227,0.65),transparent_55%)]" />
        <img
          src="/assets/hero-house.jpg"
          alt=""
          aria-hidden="true"
          className="absolute -top-4 right-0 hidden h-[92%] w-auto max-w-none opacity-35 sm:block"
        />
        <img
          src="/assets/hero-palms.jpg"
          alt=""
          aria-hidden="true"
          className="palms-mask absolute -top-2 left-0 hidden h-[70%] w-auto max-w-none opacity-35 sm:block"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2E1E79]/70 to-transparent" />

        <Header />

        <div className="relative z-10 mx-auto max-w-[1180px] px-8 pb-14 pt-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-[36px]">
            Find Your Perfect Boarding Place
          </h1>
          <p className="mt-3 text-[17px] font-medium text-white/85">
            Discover the best places near you
          </p>
          <div className="mt-9">
            <SearchBar variant="browse" />
          </div>
        </div>
      </section>

      {/* Filters + results */}
      <main className="mx-auto max-w-[1180px] px-8 py-10">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            onApply={() => {
              setApplied(filters);
              setPage(1);
            }}
            onReset={() => {
              setFilters(INITIAL_FILTERS);
              setApplied(INITIAL_FILTERS);
              setPage(1);
            }}
          />

          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[15px] font-semibold text-night/60">
                Showing {results.length} results
              </p>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-night/60">
                Sort by:
                <span className="relative">
                  <select
                    aria-label="Sort results"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="cursor-pointer appearance-none bg-transparent pr-7 text-[15px] font-bold text-night focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    strokeWidth={2.75}
                    className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-night"
                  />
                </span>
              </label>
            </div>

            {visible.length > 0 ? (
              <div className="grid items-start gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-card">
                <p className="text-[17px] font-bold text-night">
                  No boarding places match your filters
                </p>
                <p className="mt-2 text-[15px] font-medium text-night/60">
                  Try widening the price range or clearing a filter.
                </p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-9 flex items-center justify-center gap-2.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={current === 1}
                onClick={() => setPage(Math.max(1, current - 1))}
                className="grid h-11 w-11 place-items-center rounded-xl border border-primary-100 bg-white text-night/60 transition enabled:hover:border-primary-700 enabled:hover:text-primary-700 disabled:opacity-50"
              >
                <ChevronLeft size={18} strokeWidth={2.5} />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-label={`Page ${p}`}
                  aria-current={p === current ? "page" : undefined}
                  onClick={() => setPage(p)}
                  className={`grid h-11 w-11 place-items-center rounded-xl text-[15px] font-bold transition ${
                    p === current
                      ? "bg-primary-700 text-white"
                      : "bg-primary-50 text-night/70 hover:bg-primary-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={current === pageCount}
                onClick={() => setPage(Math.min(pageCount, current + 1))}
                className="grid h-11 w-11 place-items-center rounded-xl border border-primary-100 bg-white text-night/60 transition enabled:hover:border-primary-700 enabled:hover:text-primary-700 disabled:opacity-50"
              >
                <ChevronRight size={18} strokeWidth={2.5} />
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
