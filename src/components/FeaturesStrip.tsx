import { Search } from "lucide-react";

/** Filled purple shield with a white check (matches mockup icon style) */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" aria-hidden="true">
      <path
        d="M12 2l8 3.5v6.1c0 4.8-3.2 8.6-8 10.4-4.8-1.8-8-5.6-8-10.4V5.5L12 2z"
        fill="#3B22A1"
      />
      <path
        d="M8.4 11.8l2.5 2.5 4.7-4.7"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Filled chat bubble with a little face (Direct Contact) */
function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" aria-hidden="true">
      <path
        d="M12 2.5c5.25 0 9.5 3.9 9.5 8.7s-4.25 8.7-9.5 8.7c-1.1 0-2.16-.16-3.14-.46L4.5 21l.9-3.3c-1.8-1.6-2.9-3.8-2.9-6.5 0-4.8 4.25-8.7 9.5-8.7z"
        fill="#3B22A1"
      />
      <circle cx="9.2" cy="11.4" r="1.15" fill="#FFFFFF" />
      <circle cx="14.8" cy="11.4" r="1.15" fill="#FFFFFF" />
      <path
        d="M9.5 14.6c.7.7 1.55 1 2.5 1s1.8-.3 2.5-1"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ITEMS = [
  { label: "Easy Search", icon: <Search size={26} strokeWidth={2.75} className="text-primary-700" /> },
  { label: "Trusted Listings", icon: <ShieldIcon /> },
  { label: "Direct Contact", icon: <ChatIcon /> },
  {
    label: "Save Favorites",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" aria-hidden="true">
        <path
          d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95L12 2.6z"
          fill="#3B22A1"
        />
      </svg>
    ),
  },
];

/** Light lavender strip of quick value props under the hero */
export default function FeaturesStrip() {
  return (
    <section className="bg-lav">
      <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-y-5 px-8 py-9 md:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center justify-center gap-3">
            {item.icon}
            <span className="text-[17px] font-bold text-night">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
