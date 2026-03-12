/**
 * Google Analytics / GA4 tracking utilities
 * Centralized event tracking used across the entire app.
 */

export const GA_ID = "G-BGL94NLVL7";

// Track a custom GA4 event
export function trackEvent(eventName, params = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

// Track CTA clicks (used via data-ga attribute)
export function trackCTA(buttonId, buttonText) {
  trackEvent("cta_click", {
    button_id: buttonId,
    button_text: (buttonText || "").substring(0, 50),
  });
}

// Track section views
export function trackSectionView(sectionName) {
  trackEvent("section_view", { section_name: sectionName });
}

// Track scroll depth
export function initScrollTracking() {
  if (typeof window === "undefined") return;

  const scrollHits = { 25: false, 50: false, 75: false, 100: false };

  const handler = () => {
    const p = Math.round(
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
        100
    );
    [25, 50, 75, 100].forEach((m) => {
      if (p >= m && !scrollHits[m]) {
        scrollHits[m] = true;
        trackEvent("scroll_depth", { percent: m });
      }
    });
  };

  window.addEventListener("scroll", handler, { passive: true });
  return () => window.removeEventListener("scroll", handler);
}

// Track time on page
export function initTimeTracking() {
  let timeCount = 0;
  const timer = setInterval(() => {
    timeCount += 15;
    if ([30, 60, 120, 300].includes(timeCount)) {
      trackEvent("time_on_page", { seconds: timeCount });
    }
    if (timeCount >= 300) clearInterval(timer);
  }, 15000);

  return () => clearInterval(timer);
}
