import { CricketGround } from "@/components/ground/cricket-ground";
import { AboutSection } from "@/components/home/about-section";
import { FeaturedStory } from "@/components/home/featured-story";
import { HomeCards } from "@/components/home/home-cards";
import { MapTeaser } from "@/components/home/map-teaser";
import { NewsletterBand } from "@/components/home/newsletter-band";
import { PeopleSection } from "@/components/home/people-section";

export default function HomePage() {
  return (
    <>
      <CricketGround />
      <HomeCards />
      <FeaturedStory />
      <PeopleSection />
      <MapTeaser />
      <AboutSection />
      <NewsletterBand />
    </>
  );
}
