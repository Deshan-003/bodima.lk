import { Link } from "react-router-dom";

const LOCATIONS = [
  { name: "Colombo", img: "/assets/loc-colombo.jpg" },
  { name: "Kandy", img: "/assets/loc-kandy.jpg" },
  { name: "Gampaha", img: "/assets/loc-gampaha.jpg" },
  { name: "Galle", img: "/assets/loc-galle.jpg" },
];

/** "Popular Locations" — four photo cards extracted from the reference mockup */
export default function PopularLocations() {
  return (
    <section className="pt-12">
      <div className="mx-auto max-w-[1180px] px-8">
        <div className="mb-7 flex items-end justify-between">
          <h2 className="text-[28px] font-extrabold tracking-tight text-night">
            Popular Locations
          </h2>
          <Link
            to="/browse"
            className="text-[16px] font-bold text-primary-500 transition hover:text-primary-700"
          >
            See all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.name}
              to="/browse"
              className="group overflow-hidden rounded-2xl bg-white shadow-card transition hover:-translate-y-1 hover:shadow-bar"
            >
              <img
                src={loc.img}
                alt={`Boarding places in ${loc.name}`}
                className="h-44 w-full rounded-b-xl object-cover transition duration-300 group-hover:scale-[1.04]"
              />
              <div className="px-5 py-4 text-[18px] font-bold text-night">
                {loc.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
