import { AboutCTA } from "@/components/modules/about/AboutCta";
import { AboutHero } from "@/components/modules/about/AboutHero";
import { AboutStory } from "@/components/modules/about/AboutStory";
import { AboutValues } from "@/components/modules/about/AboutValues";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | WearGic",
  description: "Your one-stop shop for all things Wearable Technology.",
};
const AboutUs = () => {
  return (
    <main className="min-h-screen bg-background">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutCTA />
    </main>
  );
};

export default AboutUs;
