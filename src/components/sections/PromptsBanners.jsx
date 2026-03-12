import Link from "next/link";
import { trackCTA } from "@/lib/analytics";
import styles from "./PromptsBanners.module.css";

const banners = [
  {
    emoji: "🎨", label: "The Existence Series — Live Demos",
    title: "Website Sundar Kaise Banao? Dekho.",
    desc: <>Same layout, <strong>completely different feel</strong>. See how Nature, Colors &amp; Typography change everything.</>,
    href: "/existence", cta: "See Live Demos →", ga: "existence_banner",
  },
  {
    emoji: "🛒", label: "Free Prompt — 4,000+ Requested This",
    title: "Blinkit jaisi website. 10 min. ₹0.",
    desc: <>Shopping website with cart &amp; email orders — <strong>zero investment</strong>. Get the exact AI prompt.</>,
    href: "/shopping-prompt", cta: "Get Free Prompt →", ga: "shopping_banner",
  },
  {
    emoji: "🔓", label: "Free Resource — 1,000+ Already Got These",
    title: "ChatGPT Prompts that actually work",
    desc: <>Resume, Portfolio, Landing Page — <strong>9 ready-to-use prompts</strong>, free.</>,
    href: "/prompts", cta: "Get Free Prompts →", ga: "prompts_banner",
  },
];

export default function PromptsBanners() {
  return (
    <>
      {banners.map((b) => (
        <div key={b.ga} className={`${styles.banner} reveal`}>
          <div className={styles.inner}>
            <div className={styles.emoji}>{b.emoji}</div>
            <div className={styles.content}>
              <div className={styles.label}>{b.label}</div>
              <div className={styles.title}>{b.title}</div>
              <div className={styles.desc}>{b.desc}</div>
            </div>
            <Link href={b.href} className={styles.cta} onClick={() => trackCTA(b.ga, b.cta)} data-ga={b.ga}>{b.cta}</Link>
          </div>
        </div>
      ))}
    </>
  );
}
