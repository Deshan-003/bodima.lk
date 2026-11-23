import Hero from "../components/Hero";
import FeaturesStrip from "../components/FeaturesStrip";
import PopularLocations from "../components/PopularLocations";
import WhyChoose from "../components/WhyChoose";
import CTABanner from "../components/CTABanner";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturesStrip />
      <PopularLocations />
      <WhyChoose />
      <CTABanner />
      <Footer />
    </>
  );
}
