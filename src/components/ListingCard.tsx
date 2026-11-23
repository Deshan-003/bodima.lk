import { Heart, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Listing } from "../data/listings";

/** Property card — photo with favorite heart, title, location, price, badges */
export default function ListingCard({ listing }: { listing: Listing }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-bar">
      <Link to={`/browse/${listing.id}`} className="block">
        <div className="relative">
          <img
            src={listing.img}
            alt={listing.title}
            className="h-48 w-full object-cover"
          />
          <button
            type="button"
            aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFavorite(!favorite);
            }}
            className="absolute right-4 top-4 text-white transition hover:scale-110"
          >
            <Heart
              size={26}
              strokeWidth={2.4}
              className={
                favorite ? "fill-accent text-accent drop-shadow" : "drop-shadow"
              }
            />
          </button>
        </div>

        <div className="px-5 pb-5 pt-4">
          <h3 className="text-[17px] font-bold leading-snug text-night">
            {listing.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-[14px] font-medium text-night/55">
            <MapPin size={15} strokeWidth={2.5} className="text-primary-500" />
            {listing.location}
          </p>
          <p className="mt-3 text-[16px]">
            <span className="font-extrabold text-primary-800">
              Rs. {listing.price.toLocaleString()}
            </span>{" "}
            <span className="text-[13px] font-semibold text-night/45">
              / month
            </span>
          </p>

          {listing.badges && (
            <div className="mt-3 flex flex-wrap gap-2">
              {listing.badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 rounded-full bg-[#DFF2E4] px-3 py-1 text-[12px] font-bold text-[#1F7A3D]"
                >
                  {badge === "Verified" ? (
                    <ShieldCheck size={13} strokeWidth={2.75} />
                  ) : (
                    <Heart size={12} strokeWidth={3} className="fill-current" />
                  )}
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
