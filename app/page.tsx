import { CountdownSection } from "@/components/sections/countdown-section";
import { EventDetailsSection } from "@/components/sections/event-details-section";
import { Footer } from "@/components/sections/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { RsvpSection } from "@/components/sections/rsvp-section";

export default function Home() {
  return (
    <main className="site-main overflow-hidden text-foreground">
      <HeroSection />
      <CountdownSection />
      <EventDetailsSection />
      <RsvpSection />
      <Footer />
    </main>
  );
}
