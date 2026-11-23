/** Filled purple house with lavender door (Wide Selection) */
function HouseIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11" aria-hidden="true">
      <path d="M5 23 L24 6 L43 23 V43 H5 Z" fill="#3B22A1" />
      <path
        d="M19 43 V31 a5 5 0 0 1 10 0 V43 Z"
        fill="#C9BFF2"
      />
    </svg>
  );
}

/** Filled shield with a lightning bolt (Verified Owners) */
function ShieldBoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-11 w-11" aria-hidden="true">
      <path
        d="M12 1.8l8.5 3.7v6.4c0 5.2-3.5 9.3-8.5 11.3-5-2-8.5-6.1-8.5-11.3V5.5L12 1.8z"
        fill="#3B22A1"
      />
      <path
        d="M12.9 6.5L8.6 12.6h2.9l-1.2 4.9 4.9-6.4h-3l0.7-4.6z"
        fill="#C9BFF2"
      />
    </svg>
  );
}

/** Headset (Direct Support) */
function HeadsetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-11 w-11" aria-hidden="true">
      <path
        d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2"
        fill="none"
        stroke="#3B22A1"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="2.8" y="12.5" width="4.4" height="7" rx="2.2" fill="#3B22A1" />
      <rect x="16.8" y="12.5" width="4.4" height="7" rx="2.2" fill="#3B22A1" />
      <path
        d="M19 19.5v.8a2.7 2.7 0 0 1-2.7 2.7H13"
        fill="none"
        stroke="#3B22A1"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const REASONS = [
  {
    icon: <HouseIcon />,
    title: "Wide Selection",
    subtitle: "of Boarding Places",
  },
  {
    icon: <ShieldBoltIcon />,
    title: "Verified Owners",
    subtitle: "for Your Safety",
  },
  {
    icon: <HeadsetIcon />,
    title: "Direct Support",
    subtitle: "contact@bodima.lk",
  },
];

/** "Why Choose Bodima.lk?" — three lavender value cards */
export default function WhyChoose() {
  return (
    <section className="pt-16">
      <div className="mx-auto max-w-[1180px] px-8">
        <h2 className="text-[28px] font-extrabold tracking-tight text-night">
          Why Choose Bodima.lk?
        </h2>
        <p className="mt-2 text-[15px] font-medium text-night/60">
          A smarter way to find your next home away from home.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col items-center gap-2 rounded-2xl bg-lav px-6 py-9 text-center transition hover:-translate-y-1 hover:shadow-card"
            >
              {reason.icon}
              <div className="mt-1 text-[19px] font-bold text-primary-800">
                {reason.title}
              </div>
              <div className="text-[15px] font-semibold text-night/70">
                {reason.subtitle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
