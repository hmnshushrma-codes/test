"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { trackCTA } from "@/lib/analytics";
import styles from "./Navbar.module.css";

const dropdownItems = [
  { href: "/existence", emoji: "🎨", name: "Existence Series", desc: "Design demos — live", ga: "nav_existence" },
  { href: "/prompts", emoji: "🔓", name: "Free Prompts", desc: "Resume, portfolio, landing page", ga: "nav_prompts" },
  { href: "/shopping-prompt", emoji: "🛒", name: "Shopping Prompt", desc: "Blinkit-style site in 10 min", ga: "nav_shopping" },
  { divider: true },
  { href: "/manage-prompt", emoji: "🔧", name: "Manage Products", desc: "Add, edit, hide — bina code", ga: "nav_manage" },
  { divider: true },
  { href: "/insta-bot-prompt", emoji: "🤖", name: "Build Your Agent", desc: "AI Instagram Coach — Free Prompt", ga: "nav_bot_prompt" },
];

const navLinks = [
  { href: "#services", label: "Services", ga: "nav_services" },
  { href: "#process", label: "Process", ga: "nav_process" },
  { href: "#stack", label: "Stack", ga: "nav_stack" },
];

const mobileLinks = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];

const mobileResources = [
  { href: "/existence", emoji: "🎨", label: "Existence Series" },
  { href: "/prompts", emoji: "🔓", label: "Free Prompts" },
  { href: "/shopping-prompt", emoji: "🛒", label: "Shopping Prompt" },
  { href: "/manage-prompt", emoji: "🔧", label: "Manage Products" },
];

export default function Navbar() {
  const [ddOpen, setDdOpen] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    const close = (e) => {
      if (ddOpen && !e.target.closest(`.${styles.navDropdown}`)) setDdOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [ddOpen]);

  useEffect(() => {
    document.body.style.overflow = mobOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobOpen]);

  const closeMob = () => setMobOpen(false);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>himanshu<span>.</span></Link>

        <ul className={styles.navCenter}>
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => trackCTA(l.ga, l.label)} data-ga={l.ga}>{l.label}</a>
            </li>
          ))}
          <li className={`${styles.navDropdown} ${ddOpen ? styles.open : ""}`}>
            <div className={styles.ddTrigger} onClick={(e) => { e.stopPropagation(); setDdOpen(!ddOpen); }}>
              Free Resources <span className={styles.ddArrow}>▾</span>
            </div>
            <div className={styles.ddMenu}>
              {dropdownItems.map((item, i) =>
                item.divider ? (
                  <div key={`div-${i}`} className={styles.ddDivider} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={styles.ddItem}
                    onClick={() => { setDdOpen(false); trackCTA(item.ga, item.name); }}
                    data-ga={item.ga}
                  >
                    <span className={styles.ddEmoji}>{item.emoji}</span>
                    <span className={styles.ddInfo}>
                      <span className={styles.ddName}>{item.name}</span>
                      <span className={styles.ddDesc}>{item.desc}</span>
                    </span>
                  </Link>
                )
              )}
            </div>
          </li>
        </ul>

        <div className={styles.navRight}>
          <a href="#contact" className={styles.navCta} onClick={() => trackCTA("nav_cta", "Let's Talk")} data-ga="nav_cta">Let&apos;s Talk</a>
          <button className={`${styles.mobileToggle} ${mobOpen ? styles.open : ""}`} onClick={() => setMobOpen(!mobOpen)} aria-label="Menu">
            <span className={styles.hamLine} />
            <span className={styles.hamLine} />
            <span className={styles.hamLine} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div className={`${styles.mobOverlay} ${mobOpen ? styles.open : ""}`} onClick={closeMob} />

      {/* Mobile panel */}
      <div className={`${styles.mobPanel} ${mobOpen ? styles.open : ""}`}>
        <div className={styles.mpSection}>
          <div className={styles.mpLabel}>Navigate</div>
          {mobileLinks.map((l) => (
            <a key={l.href} href={l.href} className={styles.mpLink} onClick={closeMob}>{l.label}</a>
          ))}
        </div>
        <div className={styles.mpDivider} />
        <div className={styles.mpSection}>
          <div className={styles.mpLabel}>Free Resources</div>
          {mobileResources.map((l) => (
            <Link key={l.href} href={l.href} className={styles.mpLink} onClick={closeMob}>
              <span className={styles.mpEmoji}>{l.emoji}</span> {l.label}
            </Link>
          ))}
        </div>
        <a href="#contact" className={styles.mpCta} onClick={closeMob}>Let&apos;s Talk →</a>
      </div>
    </>
  );
}
