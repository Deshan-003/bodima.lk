import { useState } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

type Review = {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
};

const STORAGE_KEY = "bodima.reviews.v1";

const SEEDED: Review[] = [
  {
    id: -1,
    author: "Nimali Perera",
    rating: 5,
    text: "Really comfortable place and the owner is very friendly. Would recommend to any student.",
    date: "2026-10-12",
  },
  {
    id: -2,
    author: "Kasun Silva",
    rating: 4,
    text: "Great location, close to buses and shops. Rooms are clean and well maintained.",
    date: "2026-09-28",
  },
];

function loadReviews(listingId: number): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, Review[]>) : {};
    return all[String(listingId)] ?? [];
  } catch {
    return [];
  }
}

function saveReviews(listingId: number, reviews: Review[]) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const all = raw ? (JSON.parse(raw) as Record<string, Review[]>) : {};
    all[String(listingId)] = reviews;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage unavailable — keep the in-memory list only
  }
}

/** Reviews with a write form available to signed-in seekers */
export default function ReviewsSection({
  listingId,
  canReview,
  userName,
}: {
  listingId: number;
  canReview: boolean;
  userName?: string;
}) {
  const [mine, setMine] = useState<Review[]>(() => loadReviews(listingId));
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const reviews = [...mine, ...SEEDED];
  const average = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const post = () => {
    if (!rating || !text.trim()) return;
    const next = [
      {
        id: Date.now(),
        author: userName ?? "You",
        rating,
        text: text.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...mine,
    ];
    setMine(next);
    saveReviews(listingId, next);
    setRating(0);
    setText("");
  };

  return (
    <div className="mt-8 rounded-2xl bg-white p-7 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[24px] font-extrabold tracking-tight text-night">
          Reviews
        </h2>
        <p className="flex items-center gap-1.5 text-[15px] font-bold text-night/70">
          <Star size={18} strokeWidth={2.4} className="fill-accent text-accent" />
          {average} · {reviews.length} reviews
        </p>
      </div>

      <div className="mt-5 space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl bg-lav p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-700 text-[14px] font-extrabold text-white">
                  {r.author.slice(0, 1).toUpperCase()}
                </span>
                <p className="text-[15px] font-extrabold text-night">{r.author}</p>
              </div>
              <span className="text-[12px] font-semibold text-night/45">{r.date}</span>
            </div>
            <div className="mt-2 flex gap-0.5">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={15}
                  strokeWidth={2.3}
                  className={
                    i < r.rating
                      ? "fill-accent text-accent"
                      : "text-night/20"
                  }
                />
              ))}
            </div>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-night/75">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      {canReview ? (
        <div className="mt-6 border-t border-primary-100 pt-6">
          <h3 className="text-[18px] font-extrabold text-night">Write a Review</h3>
          <div className="mt-3 flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1} star${i ? "s" : ""}`}
                onClick={() => setRating(i + 1)}
                className="rounded p-0.5 transition hover:scale-110"
              >
                <Star
                  size={26}
                  strokeWidth={2.2}
                  className={
                    i < rating ? "fill-accent text-accent" : "text-night/25"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            aria-label="Your review"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Share your experience with this boarding place..."
            className="mt-3 w-full resize-none rounded-xl border border-primary-100 px-4 py-3 text-[14px] font-medium text-night placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={post}
            disabled={!rating || !text.trim()}
            className="mt-3 rounded-xl bg-primary-700 px-6 py-3 text-[14px] font-extrabold text-white transition enabled:hover:bg-primary-800 disabled:opacity-40"
          >
            Post Review
          </button>
        </div>
      ) : (
        <p className="mt-6 border-t border-primary-100 pt-6 text-[14px] font-medium text-night/60">
          <Link to="/login" className="font-extrabold text-primary-700 hover:underline">
            Sign in as a seeker
          </Link>{" "}
          to write a review.
        </p>
      )}
    </div>
  );
}
