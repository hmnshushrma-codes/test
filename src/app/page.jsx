"use client";

import { useEffect } from "react";
import { useRevealOnScroll, useSectionTracking } from "@/lib/hooks";
import { initScrollTracking, initTimeTracking } from "@/lib/analytics";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import GridOverlay from "@/components/ui/GridOverlay";
import Hero from "@/components/sections/Hero";
import PromptsBanners from "@/components/sections/PromptsBanners";
import {
  ProofBar,
  ValueSection,
  ServicesSection,
  ProcessSection,
  StackSection,
  TestimonialSection,
  CTABanner,
  ContactSection,
} from "@/components/sections/HomeSections";

export default function HomePage() {
  useRevealOnScroll();
  useSectionTracking();

  useEffect(() => {
    const cleanupScroll = initScrollTracking();
    const cleanupTime = initTimeTracking();
    return () => {
      cleanupScroll?.();
      cleanupTime?.();
    };
  }, []);

  return (
    <>
      <GridOverlay />
      <CursorGlow />
      <Navbar />
      <Hero />
      <PromptsBanners />
      <ProofBar />
      <ValueSection />
      <ServicesSection />
      <ProcessSection />
      <StackSection />
      <TestimonialSection />
      <CTABanner />
      <ContactSection />
      <Footer />
    </>
  );
}
