import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Car,
  ChevronRight,
  Heart,
  Home,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  Snowflake,
  UtensilsCrossed,
  Users,
  Wifi,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatPanel from "../components/ChatPanel";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../context/AuthContext";
import { LISTINGS } from "../data/listings";

const FACILITY_ICONS: Record<string, typeof Wifi> = {
  "Wi-Fi": Wifi,
  AC: Snowflake,
  Parking: Car,
  Meals: UtensilsCrossed,
};

const DEFAULT_DESCRIPTION = (location: string, facilities: string[]) =>
  `A comfortable and well-maintained boarding space in ${location}. Fully furnished with ${facilities
    .join(", ")
    .toLowerCase()}, making it ideal for students and young professionals looking for a hassle-free stay. Contact the owner directly to arrange a viewing.`;

/** Property details page — gallery, description, facilities and booking card */
export default function PropertyDetails() {
  const { id } = useParams();
  const listing = LISTINGS.find((l) => l.id === Number(id));
  const [photoIndex, setPhotoIndex] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { user } = useAuth();
  const isSeeker = user?.role === "seeker";
  const ownerName = "Kamal Perera";
  const ownerPhone = "+94 77 234 5678";

  if (!listing) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[1180px] px-8 py-24 text-center">
          <h1 className="text-3xl font-extrabold text-night">Listing not found</h1>
          <Link
            to="/browse"
            className="mt-6 inline-block rounded-full bg-accent px-8 py-3 font-bold text-night"
          >
            Back to Browse
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const gallery = listing.gallery ?? [
    listing.img,
    "/assets/detail-thumb-1.jpg",
    "/assets/detail-thumb-2.jpg",
    "/assets/detail-thumb-3.jpg",
  ];
  const description = listing.description ?? DEFAULT_DESCRIPTION(listing.location, listing.facilities);

  return (
    <>
      <Header />

      {/* Breadcrumb strip */}
      <div className="bg-lav">
        <div className="mx-auto flex max-w-[1180px] items-center gap-2 px-8 py-3 text-[14px] font-semibold text-night/55">
          <Link to="/" className="transition hover:text-primary-700">
            Home
          </Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <Link to="/browse" className="transition hover:text-primary-700">
            Browse
          </Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <span className="text-night/75">{listing.title}</span>
        </div>
      </div>

      <main className="bg-page pb-16">
        <div className="mx-auto max-w-[1180px] px-8 py-8">
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            {/* Left: gallery + details */}
            <div>
              <div className="overflow-hidden rounded-2xl bg-white shadow-card">
                <img
                  src={gallery[photoIndex]}
                  alt={listing.title}
                  className="h-[420px] w-full object-cover"
                />
                <div className="flex gap-3 p-4">
                  {gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      aria-label={`View photo ${i + 1}`}
                      onClick={() => setPhotoIndex(i)}
                      className={`h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                        i === photoIndex
                          ? "border-primary-700"
                          : "border-transparent hover:border-primary-200"
                      }`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-white p-7 shadow-card">
                <h2 className="text-[24px] font-extrabold tracking-tight text-night">
                  Boarding Details
                </h2>
                <p className="mt-4 text-[16px] leading-[1.8] text-night/70">
                  {description}
                </p>

                <h2 className="mt-8 text-[24px] font-extrabold tracking-tight text-night">
                  Facilities
                </h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {listing.facilities.map((facility) => {
                    const Icon = FACILITY_ICONS[facility] ?? Home;
                    return (
                      <span
                        key={facility}
                        className="flex items-center gap-2.5 rounded-xl bg-lav px-4 py-3 text-[15px] font-bold text-primary-700"
                      >
                        <Icon size={19} strokeWidth={2.4} />
                        {facility}
                      </span>
                    );
                  })}
                </div>
              </div>

              <ReviewsSection
                listingId={listing.id}
                canReview={isSeeker}
                userName={user?.name}
              />
            </div>

            {/* Right: booking card */}
            <aside className="h-fit rounded-2xl bg-white p-7 shadow-card lg:sticky lg:top-6">
              <h1 className="text-[22px] font-extrabold leading-snug text-night">
                {listing.title}
              </h1>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-[15px]">
                  <span className="text-[26px] font-extrabold text-primary-700">
                    Rs. {listing.price.toLocaleString()}
                  </span>{" "}
                  <span className="text-[15px] font-semibold text-night/55">
                    /month
                  </span>
                </p>
                <span className="mb-1 rounded-full bg-[#DFF2E4] px-3 py-1 text-[12px] font-bold text-[#1F7A3D]">
                  Available
                </span>
              </div>

              <div className="mt-6 space-y-4 border-t border-primary-100 pt-6">
                <div className="flex items-center gap-3 text-[15px] font-semibold text-night/75">
                  <MapPin size={18} strokeWidth={2.4} className="text-primary-600" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-3 text-[15px] font-semibold text-night/75">
                  <Users size={18} strokeWidth={2.4} className="text-primary-600" />
                  {listing.occupancy ?? "1 person"}
                </div>
                <div className="flex items-center gap-3 text-[15px] font-semibold text-night/75">
                  <Home size={18} strokeWidth={2.4} className="text-primary-600" />
                  {listing.boardingType ?? "Annex"}
                </div>
              </div>

              {isSeeker && (
                <div className="mt-7 rounded-xl bg-lav p-4">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-night/50">
                    House Owner
                  </p>
                  <p className="mt-1 text-[16px] font-extrabold text-night">
                    {ownerName}
                  </p>
                  <a
                    href={`tel:${ownerPhone.replace(/\s/g, "")}`}
                    className="mt-2 flex items-center gap-2 text-[16px] font-extrabold text-primary-700 hover:underline"
                  >
                    <Phone size={17} strokeWidth={2.4} />
                    {ownerPhone}
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => setChatOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl bg-accent px-6 py-4 text-[16px] font-extrabold text-night shadow-cta transition hover:bg-accent-dark"
              >
                <MessageCircle size={20} strokeWidth={2.5} />
                {isSeeker ? "Chat with Owner" : "Contact Owner"}
              </button>

              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-lav p-4 text-[13px] font-medium leading-relaxed text-night/70">
                <Info size={17} strokeWidth={2.4} className="mt-0.5 shrink-0 text-primary-600" />
                Contact owner directly to arrange a viewing. No broker fees — direct owner contact.
              </div>

              <button
                type="button"
                aria-label={favorite ? "Remove from favorites" : "Save to favorites"}
                onClick={() => setFavorite(!favorite)}
                className="mt-4 grid h-12 w-12 place-items-center rounded-xl border-2 border-primary-100 text-primary-700 transition hover:border-primary-700"
              >
                <Heart
                  size={22}
                  strokeWidth={2.4}
                  className={favorite ? "fill-accent text-accent" : ""}
                />
              </button>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        ownerName={ownerName}
      />
    </>
  );
}
