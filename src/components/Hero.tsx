import Header from "./Header";
import SearchBar from "./SearchBar";

/** Purple hero with the extracted dusk-house photo, headline and search bar */
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#8B7BE2] via-[#5A3EC0] to-[#2B1C6B]" />

      {/* extracted house photo, right side */}
      <img
        src="/assets/hero-house.jpg"
        alt="Modern boarding house at dusk"
        className="hero-img-mask absolute -top-6 right-0 hidden h-[82%] w-auto max-w-none sm:block"
      />

      {/* faint palm ambience on the left, from the mockup's palm band */}
      <img
        src="/assets/hero-palms.jpg"
        alt=""
        aria-hidden="true"
        className="palms-mask absolute -top-4 left-0 hidden h-[60%] w-auto max-w-none opacity-60 sm:block"
      />

      {/* unify bottom edge into deep violet */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#2B1C6B] to-transparent" />

      <Header />

      <div className="relative z-10 mx-auto max-w-[1180px] px-8 pb-16 pt-28 sm:pt-32">
        <h1 className="text-5xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-[64px]">
          Find. Rent. <span className="text-accent">Stay.</span>
        </h1>
        <p className="mt-6 text-[20px] font-medium leading-snug text-white/95 sm:text-[22px]">
          Your perfect boarding place
          <br />
          is just a search away.
        </p>

        <div className="mt-10">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
