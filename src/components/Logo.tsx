import { Link } from "react-router-dom";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

/** Bodima.lk brand — house icon + wordmark with the gold ".lk" */
export default function Logo({ variant = "dark", className = "" }: LogoProps) {
  const dark = variant === "dark";
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-hidden="true">
        {/* roof */}
        <path
          d="M6 24 L24 7 L42 24"
          fill="none"
          stroke="#FBC63F"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* walls */}
        <path
          d="M12 21 V39 H36 V21"
          fill="none"
          stroke={dark ? "#3B22A1" : "#FBC63F"}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* door */}
        <path
          d="M19.5 39 V30 a4.5 4.5 0 0 1 9 0 V39 Z"
          fill={dark ? "#3B22A1" : "#FFFFFF"}
        />
        {/* window dot */}
        <circle cx="24" cy="16.5" r="2" fill={dark ? "#3B22A1" : "#FFFFFF"} />
      </svg>
      <span className="text-[24px] font-extrabold leading-none tracking-tight">
        <span className={dark ? "text-night" : "text-white"}>Bodima</span>
        <span className="text-accent">.lk</span>
      </span>
    </Link>
  );
}
