import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Phone,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import Logo from "../components/Logo";
import { useAuth, type Role } from "../context/AuthContext";

const FIELDS: {
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    icon: User,
  },
  {
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address",
    icon: Mail,
  },
  {
    label: "Phone Number",
    type: "tel",
    placeholder: "+94 XX XXX XXXX",
    icon: Phone,
  },
  {
    label: "Password",
    type: "password",
    placeholder: "At least 8 characters",
    icon: Lock,
  },
  {
    label: "Confirm Password",
    type: "password",
    placeholder: "Re-enter your password",
    icon: Lock,
  },
];

/** Centered registration page with the Bodima.lk brand at the top */
export default function SignUp() {
  const [role, setRole] = useState<Role>("seeker");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center bg-white px-5 py-10 font-sans sm:py-12">
      <Logo />

      <div className="mt-9 w-full max-w-[440px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-lav px-4 py-1.5 text-[12px] font-extrabold uppercase tracking-wider text-primary-700">
            <Sparkles size={14} strokeWidth={2.6} />
            Join Our Community
          </span>

          <h1 className="mt-5 text-[32px] font-extrabold leading-tight tracking-tight text-night">
            Create your account
          </h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-night/60">
            Start your journey to finding the perfect boarding place.
          </p>
        </div>

        {/* Role toggle */}
        <div className="mt-7 flex gap-3">
          {(
            [
              { key: "seeker", label: "I'm a Seeker" },
              { key: "owner", label: "I'm an Owner" },
            ] as const
          ).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRole(option.key)}
              aria-pressed={role === option.key}
              className={`flex-1 rounded-full py-2.5 text-[14px] font-bold transition ${
                role === option.key
                  ? "bg-primary-700 px-8 text-white shadow-cta"
                  : "bg-lav px-8 text-night/65 hover:text-night"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            signIn({ name: fullName.trim() || "Bodima User", email, role });
            setSubmitted(true);
            navigate("/browse", { replace: true });
          }}
        >
          {FIELDS.map((field) => {
            const id = `signup-${field.label.replace(/\s+/g, "-").toLowerCase()}`;
            const Icon = field.icon;
            return (
              <div key={field.label} className="mt-4 first:mt-0">
                <label htmlFor={id} className="block text-[14px] font-bold text-night">
                  {field.label}
                </label>
                <div className="relative mt-2">
                  <Icon
                    size={18}
                    strokeWidth={2.3}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-500"
                  />
                  <input
                    id={id}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={
                      field.label === "Full Name"
                        ? fullName
                        : field.label === "Email Address"
                          ? email
                          : undefined
                    }
                    onChange={
                      field.label === "Full Name"
                        ? (e) => setFullName(e.target.value)
                        : field.label === "Email Address"
                          ? (e) => setEmail(e.target.value)
                          : undefined
                    }
                    required
                    className="h-12 w-full rounded-xl border border-primary-100 bg-white pl-11 pr-4 text-[15px] font-medium text-night placeholder:font-normal placeholder:text-night/35 focus:border-primary-600 focus:outline-none"
                  />
                </div>
              </div>
            );
          })}

          <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-[13px] font-medium leading-relaxed text-night/70">
            <span
              className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded border-2 ${
                agreed
                  ? "border-primary-700 bg-primary-700"
                  : "border-primary-200 bg-white"
              }`}
            >
              {agreed && (
                <svg viewBox="0 0 14 14" className="h-3 w-3" aria-hidden="true">
                  <path
                    d="M2 7l3 3 7-7"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
            />
            I agree to the{" "}
            <span className="font-bold text-primary-700">Terms of Service</span>{" "}
            and{" "}
            <span className="font-bold text-primary-700">Privacy Policy</span>
          </label>

          {submitted && (
            <p className="mt-4 rounded-xl bg-[#DFF2E4] px-4 py-3 text-[14px] font-bold text-[#1F7A3D]">
              Account created! You're signed in as a {role}.
            </p>
          )}

          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-xl bg-primary-700 text-[16px] font-extrabold text-white shadow-cta transition hover:bg-primary-800"
          >
            Create Account
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] font-medium text-night/60">
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold text-primary-700 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
