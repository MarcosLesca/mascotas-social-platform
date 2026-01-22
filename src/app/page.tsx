import { Navigation } from "@/components/layout/Navigation";
import { HeroSection } from "@/components/layout/HeroSection";
import { FeaturesSection } from "@/components/layout/FeaturesSection";
import { SuccessStories } from "@/components/sections/SuccessStories";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SuccessStories />
      </main>
      <Footer />
    </div>
  );
}
