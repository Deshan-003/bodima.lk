import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Sparkles, type LucideIcon } from "lucide-react";
import Logo from "../components/Logo";
import { useAuth, type Role } from "../context/AuthContext";

const FIELDS: {
  label: string;
  type: string;
  placeholder: string;
  icon: LucideIcon;
}[] = [
  {
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address",
    icon: Mail,
  },
  {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    icon: Lock,
  },
];

/** Centered login page matching the Sign Up design language */
export default function Login() {
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState<Role>("seeker");
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
            Welcome Back
          </span>

          <h1 className="mt-5 text-[32px] font-extrabold leading-tight tracking-tight text-night">
            Sign in to your account
          </h1>
          <p className="mt-2 text-[15px] font-medium leading-relaxed text-night/60">
            Continue your journey to finding the perfect boarding place.
          </p>
        </div>

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
              className={`flex-1 rounded-full px-8 py-2.5 text-[14px] font-bold transition ${
                role === option.key
                  ? "bg-primary-700 text-white shadow-cta"
                  : "bg-lav text-night/65 hover:text-night"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            const name = email.split("@")[0].replace(/[._]/g, " ") || "Bodima User";
            signIn({
              name: name.charAt(0).toUpperCase() + name.slice(1),
              email,
              role,
            });
            setSubmitted(true);
            navigate(role === "owner" ? "/dashboard" : "/browse", {
              replace: true,
            });
          }}
        >
          {FIELDS.map((field) => {
            const id = `login-${field.label.replace(/\s+/g, "-").toLowerCase()}`;
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
                    value={field.label === "Email Address" ? email : undefined}
                    onChange={
                      field.label === "Email Address"
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

          <div className="mt-5 flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-night/70">
              <span
                className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded border-2 ${
                  remember
                    ? "border-primary-700 bg-primary-700"
                    : "border-primary-200 bg-white"
                }`}
              >
                {remember && (
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
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-[13px] font-bold text-primary-700 hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {submitted && (
            <p className="mt-4 rounded-xl bg-[#DFF2E4] px-4 py-3 text-[14px] font-bold text-[#1F7A3D]">
              Signed in as a {role}! Check the header for your account icon.
            </p>
          )}

          <button
            type="submit"
            className="mt-6 h-12 w-full rounded-xl bg-primary-700 text-[16px] font-extrabold text-white shadow-cta transition hover:bg-primary-800"
          >
            Sign In
          </button>
        </form>

        <p className="mt-5 text-center text-[14px] font-medium text-night/60">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-extrabold text-primary-700 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
