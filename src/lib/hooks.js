"use client";

import { useEffect } from "react";

/**
 * Custom hook to observe .reveal elements and add .visible class on scroll.
 * Replaces the IntersectionObserver logic from the original site.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            // Handle stagger children
            e.target.querySelectorAll(".stagger-child").forEach((c, i) => {
              c.style.transitionDelay = i * 100 + "ms";
              setTimeout(() => c.classList.add("visible"), 10);
            });
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/**
 * Hook for section view tracking
 */
export function useSectionTracking() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            // Dynamic import to avoid SSR issues
            import("@/lib/analytics").then(({ trackEvent }) => {
              trackEvent("section_view", { section_name: e.target.dataset.section });
            });
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
