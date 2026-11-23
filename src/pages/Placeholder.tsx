import { Link } from "react-router-dom";
import Logo from "../components/Logo";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-page px-6 text-center">
      <Logo />
      <h1 className="text-3xl font-extrabold text-night">{title}</h1>
      <p className="max-w-md text-night/60">
        This page is on the way. The reference design for it hasn't been added
        yet — the landing page sets the design language it will follow.
      </p>
      <Link
        to="/"
        className="rounded-full bg-accent px-7 py-3 font-bold text-night shadow-cta transition hover:bg-accent-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
