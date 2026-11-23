import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/** Violet call-to-action banner with the extracted house illustration */
export default function CTABanner() {
  return (
    <section className="pt-14">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3A20A0] via-[#4426B0] to-[#5230C4] shadow-cta">
          {/* soft light-purple glow under the illustration, like the mockup ground */}
          <div className="absolute -bottom-14 right-32 h-48 w-[430px] rounded-full bg-[#9D82D3] opacity-70 blur-2xl" />

          {/* extracted illustration (purple-on-purple, edge-masked to blend) */}
          <img
            src="/assets/cta-house.png"
            alt=""
            aria-hidden="true"
            className="cta-art-mask absolute bottom-0 right-[150px] hidden h-full w-auto max-w-none md:block"
          />

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 px-10 py-11 md:flex-row md:items-center">
            <div>
              <h3 className="text-[24px] font-extrabold tracking-tight text-white sm:text-[26px]">
                Ready to find your ideal boarding place?
              </h3>
              <p className="mt-2 text-[15px] font-medium text-white/85">
                Start searching now and discover the best options!
              </p>
            </div>

            <Link
              to="/browse"
              className="flex shrink-0 items-center gap-2 rounded-xl bg-accent px-7 py-4 text-[17px] font-bold text-night shadow-cta transition hover:bg-accent-dark"
            >
              Explore Now
              <ArrowRight size={20} strokeWidth={2.75} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
