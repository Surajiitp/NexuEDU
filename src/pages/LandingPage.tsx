import React from "react";
import { Hero } from "@/components/landing/Hero";
import AboutSection from "@/components/landing/About";

export default function LandingPage() {
  return (
    <main id="main" className="flex-grow">
      <Hero />
      <AboutSection />
    </main>
  );
}
