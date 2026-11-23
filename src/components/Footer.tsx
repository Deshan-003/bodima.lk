import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Logo from "./Logo";

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="currentColor" aria-hidden="true">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Browse", to: "/browse" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const OWNER_LINKS = [
  { label: "Post a Listing", to: "/register" },
  { label: "Dashboard", to: "/login" },
  { label: "Help", to: "/contact" },
];

const SOCIALS = [
  { label: "Facebook", icon: <Facebook size={22} /> },
  { label: "YouTube", icon: <Youtube size={22} /> },
  { label: "Instagram", icon: <Instagram size={22} /> },
  { label: "X", icon: <XIcon /> },
];

/** Deep indigo footer with brand, link columns and socials */
export default function Footer() {
  return (
    <footer className="mt-8 bg-ink text-white">
      <div className="mx-auto max-w-[1180px] px-8 pb-10 pt-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 text-[15px] font-medium text-white/70">
              Find. Rent. Stay
            </p>
          </div>

          <div>
            <h4 className="text-[17px] font-bold">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] font-medium text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[17px] font-bold">For Owners</h4>
            <ul className="mt-4 space-y-3">
              {OWNER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[15px] font-medium text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[17px] font-bold">Follow Us</h4>
            <div className="mt-4 flex items-center gap-5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="text-white transition hover:text-accent"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2 px-8 py-5 text-[13.5px] font-medium text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Bodima.lk. All rights reserved.</p>
          <p className="flex gap-5">
            <span className="cursor-pointer transition hover:text-white">Privacy Policy</span>
            <span className="cursor-pointer transition hover:text-white">Terms of Service</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
