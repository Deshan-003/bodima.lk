import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { LISTINGS, type KeyMoney, type Listing } from "./listings";

const STORAGE_KEY = "bodima.listings.v1";

/**
 * Marketplace listings are shared client-side: seeded sample data plus any
 * property an owner publishes from the dashboard. Persisted so Browse and the
 * property detail page always show the latest posts to every visitor.
 */
type ListingsValue = {
  listings: Listing[];
  /** Publishes an owner's new post so seekers see it on Browse + Details. */
  publishListing: (listing: Listing) => void;
  /** Removes one of the owner's published posts. */
  removeListing: (id: number) => void;
  /** Updates one of the owner's published posts. */
  updateListing: (listing: Listing) => void;
  getListing: (id: number) => Listing | undefined;
};

const ListingsContext = createContext<ListingsValue | null>(null);

function loadListings(): Listing[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return LISTINGS;
    const parsed = JSON.parse(raw) as { listings?: Listing[] };
    if (!Array.isArray(parsed.listings)) return LISTINGS;
    return parsed.listings;
  } catch {
    return LISTINGS;
  }
}

function saveListings(rows: Listing[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ listings: rows }));
  } catch {
    // Storage may be unavailable (private mode / quota) — keep working in memory.
  }
}

export function ListingsProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(loadListings);

  const publishListing = useCallback((listing: Listing) => {
    setListings((prev) => {
      const next = [listing, ...prev.filter((row) => row.id !== listing.id)];
      saveListings(next);
      return next;
    });
  }, []);

  const removeListing = useCallback((id: number) => {
    setListings((prev) => {
      const next = prev.filter((row) => row.id !== id);
      saveListings(next);
      return next;
    });
  }, []);

  const updateListing = useCallback((listing: Listing) => {
    setListings((prev) => {
      const next = prev.map((row) => (row.id === listing.id ? listing : row));
      saveListings(next);
      return next;
    });
  }, []);

  const getListing = useCallback(
    (id: number) => listings.find((row) => row.id === id),
    [listings],
  );

  const value = useMemo<ListingsValue>(
    () => ({ listings, publishListing, removeListing, updateListing, getListing }),
    [listings, publishListing, removeListing, updateListing, getListing],
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings(): ListingsValue {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error("useListings must be used inside ListingsProvider");
  return ctx;
}

/** Normalises owner form input into a full Listing record ready for the store. */
export function buildListing(input: {
  title: string;
  district: string;
  town: string;
  price: number;
  keyMoneyMonths: number;
  bathroom: "Attached" | "Common";
  facilities: string[];
  description?: string;
  img: string;
  type?: "Male" | "Female" | "Any";
  boardingType?: string;
  occupancy?: string;
  gallery?: string[];
  isNew?: boolean;
  keyMoney?: KeyMoney;
}): Listing {
  const keyMoney: KeyMoney =
    input.keyMoney ??
    { months: input.keyMoneyMonths ?? 0, amount: (input.keyMoneyMonths ?? 0) * input.price };
  return {
    id: Date.now() + Math.floor(Math.random() * 1000),
    title: input.title.trim(),
    location: input.town,
    district: input.district,
    town: input.town,
    price: input.price,
    img: input.img,
    type: input.type ?? "Any",
    facilities: input.facilities,
    boardingType: input.boardingType ?? "Room",
    occupancy: input.occupancy ?? "1 person",
    description: input.description?.trim(),
    gallery: input.gallery,
    bathroom: input.bathroom,
    keyMoney,
    isNew: input.isNew !== false,
  };
}

