"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRevealOnScroll } from "@/lib/hooks";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/LeadForm";
import Footer from "@/components/layout/Footer";
import "@/styles/gate-pages.css";

const pillars = [
  { href: "/existence/business-nature", emoji: "🏪", title: "Business Nature", desc: "Luxury ya playful? Aggressive ya calm? Tumhara business kya FEEL karta hai — wahi design language honi chahiye." },
  { href: "/existence/color-psychology", emoji: "🎨", title: "Colors", desc: "Red = urgency. Blue = trust. Black + Gold = premium. Colors sirf sundar dikhne ke liye nahi — FEEL karaane ke liye hain." },
  { href: "/existence/typography", emoji: "🔤", title: "Typography", desc: "Font = brand ki awaaz. Bold font = confidence. Serif = elegance. Rounded = friendly. Kaise bolni hai brand — wahi font choose karo." },
];

const demos = [
  {
    href: "/existence/noir-studio", icon: "✂️", name: "NOIR Studio", type: "Premium Men's Grooming Salon",
    tags: ["Luxury", "Dark Theme"],
    nature: "Luxury, Masculine, Refined",
    colors: [{ hex: "#0a0a08" }, { hex: "#c9a84c" }, { hex: "#f0ece0" }], colorNames: "Black, Gold, Cream",
    typo: "Cormorant Garamond (Serif)",
  },
  {
    href: "/existence/little-creators", icon: "🎨", name: "Little Creators", type: "Kids Art & Craft Studio",
    tags: ["Playful", "Bright Theme"],
    nature: "Playful, Joyful, Creative",
    colors: [{ hex: "#ff6b6b" }, { hex: "#ffd93d" }, { hex: "#6bc5f8" }], colorNames: "Coral, Yellow, Blue",
    typo: "Bubblegum Sans (Rounded)",
  },
];

const existencePrompts = [
  { id: "ep1", eyebrow: "Prompt 01", eyebrowColor: "#c9a84c", title: "NOIR Studio — Luxury Salon", iconBg: "rgba(201,168,76,.1)",
    text: `Build me a complete landing page for a premium men's grooming salon called "NOIR Studio". Design direction: - Nature: Luxury, masculine, refined — think high-end barbershop meets spa - Colors: Deep black background, warm gold (#c9a84c) accents, cream (#f0ece0) text. Dark and moody. - Typography: Elegant serif fonts for headings (like Cormorant Garamond), clean body text. Feels authoritative but sophisticated. Sections: Hero with tagline, 3 service cards with prices, a testimonial, and a booking CTA. Add smooth fade-up animations and gold hover effects.`,
    tip: "Dark theme + serif font + gold = instant luxury feel. Works for any premium service — salon, restaurant, law firm, jewellery." },
  { id: "ep2", eyebrow: "Prompt 02", eyebrowColor: "#ff6b6b", title: "Little Creators — Kids Studio", iconBg: "rgba(255,107,107,.1)",
    text: `Build me a complete landing page for a kids art & craft studio called "Little Creators". Design direction: - Nature: Playful, joyful, creative — like walking into a fun art room - Colors: Bright white (#FFFDF7) background with pops of coral (#FF6B6B), sunny yellow (#FFD93D), sky blue (#6BC5F8). Energetic and happy. - Typography: Rounded, bubbly fonts for headings (like Bubblegum Sans), friendly readable body text (like Nunito). Feels warm and approachable. Sections: Hero with tagline, 3 class cards with age groups, a parent testimonial, and a join CTA. Add playful bounce animations, floating emoji decorations, and colorful dashed borders.`,
    tip: "Same structure as NOIR — but Nature, Colors, Typography completely different. THAT'S the point. Change these 3 things = change everything." },
  { id: "ep3", eyebrow: "Template", eyebrowColor: "var(--accent)", title: "The Framework — Kisi Bhi Website Ke Liye", iconBg: "var(--accent-glow)",
    text: `Build me a complete landing page for [YOUR IDEA — shop / portfolio / freelance page / brand / cafe / studio]. Design direction: - Nature: [luxury / playful / bold / minimal / professional / artistic / ...] - Colors: [describe the emotion — dark & moody / bright & energetic / soft & calming / ...] with specific hex codes if possible - Typography: [serif / rounded / bold sans / monospace / handwritten / ...] — describe the personality of the font Sections: Hero with tagline, 3 service/feature cards, a testimonial, and a CTA section. Add smooth animations. Make it mobile responsive. Single HTML file, no frameworks.`,
    tip: "Brackets mein apna content daalo. Jitna specific likhoge — utni better website milegi. \"Dark theme\" se better hai \"Deep navy blue (#1a1a3e) with gold (#c9a84c) accents\"." },
];

export default function ExistenceIndexPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  useRevealOnScroll();

  useEffect(() => {
    if (sessionStorage.getItem("existence_unlocked") === "true") setUnlocked(true);
  }, []);

  const handleCopy = async (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    await navigator.clipboard.writeText(el.innerText);
    setCopiedId(id);
    trackEvent("prompt_copied", { prompt_id: id });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      {/* Hero */}
      <header className="pageHero">
        <div className="heroGlow" />
        <div className="badge"><span className="pulse" /> The Existence Series</div>
        <h1 className="pageTitle">3 cheezein jo website ko<br /><em>sundar</em> banati hain.</h1>
        <p className="pageSub">Business Nature. Colors. Typography. Same layout, completely different feel. Yeh teen cheezein soch lo — AI se kuch bhi bana lo.</p>
      </header>

      {/* 3 Pillars */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
        {pillars.map((p) => (
          <Link key={p.href} href={p.href} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2.5rem 2rem", textDecoration: "none", color: "var(--text)", transition: "all .35s", textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>{p.emoji}</span>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: ".5rem" }}>{p.title}</h3>
            <p style={{ fontSize: ".88rem", color: "var(--text-muted)", lineHeight: 1.6, fontWeight: 300 }}>{p.desc}</p>
            <span style={{ display: "inline-block", marginTop: "1rem", fontSize: ".82rem", color: "var(--accent)", fontWeight: 500 }}>See Examples →</span>
          </Link>
        ))}
      </div>

      {/* Demos */}
      <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 2rem 5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="section-eyebrow" style={{ justifyContent: "center" }}>Live Demos</p>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 400, marginBottom: ".75rem" }}>Same layout.<br />Completely <em style={{ fontStyle: "italic", color: "var(--accent)" }}>different</em> feel.</h2>
          <p style={{ color: "var(--text-muted)", fontWeight: 300 }}>Both websites have the same structure — Hero, Services, Testimonial, CTA. Sirf Nature, Colors &amp; Typography change ki.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
          {demos.map((d) => (
            <div key={d.href} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
              <div style={{ padding: "3rem 2rem", textAlign: "center", position: "relative", background: "var(--bg-elevated)" }}>
                <span style={{ fontSize: "3rem" }}>{d.icon}</span>
                <div style={{ display: "flex", gap: ".5rem", justifyContent: "center", marginTop: "1rem" }}>
                  {d.tags.map((t) => <span key={t} style={{ fontSize: ".7rem", padding: ".25rem .75rem", border: "1px solid var(--border)", borderRadius: "100px", color: "var(--text-muted)" }}>{t}</span>)}
                </div>
              </div>
              <div style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: ".25rem" }}>{d.name}</h3>
                <p style={{ fontSize: ".85rem", color: "var(--text-muted)", marginBottom: "1.25rem", fontWeight: 300 }}>{d.type}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".6rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>Nature</span><span style={{ fontSize: ".82rem", color: "var(--text-mid)" }}>{d.nature}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>Colors</span><span style={{ display: "flex", alignItems: "center", gap: ".35rem" }}>{d.colors.map((c) => <span key={c.hex} style={{ width: 14, height: 14, borderRadius: "50%", background: c.hex, border: "1px solid var(--border)" }} />)}<span style={{ fontSize: ".82rem", color: "var(--text-mid)", marginLeft: ".25rem" }}>{d.colorNames}</span></span></div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: ".75rem", color: "var(--text-muted)" }}>Typography</span><span style={{ fontSize: ".82rem", color: "var(--text-mid)" }}>{d.typo}</span></div>
                </div>
                <Link href={d.href} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>View Live Demo →</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gate */}
      {!unlocked && (
        <section className="gateWrap" id="gate-section" style={{ maxWidth: 560, marginBottom: "4rem" }}>
          <div className="gateCard">
            <div className="gateTitle">Yeh prompts chahiye? Unlock karo — free hai</div>
            <div className="gateSub">Dono websites ke <strong>exact prompts</strong> + reusable template. Naam aur email daalo, turant milenge.</div>
            <ul className="teaserList">
              <li>NOIR Studio ka complete prompt (luxury salon)</li>
              <li>Little Creators ka complete prompt (kids studio)</li>
              <li>Reusable framework template — kisi bhi website ke liye</li>
              <li>Sab copy-paste ready — seedha AI mein daalo</li>
            </ul>
            <LeadForm formName="existence_series" source="existence_page"
              btnTexts={{ ready: "🔓 Prompts Unlock Karo — Free", fields: "Sab fields fill karo", submitting: "⏳ Submitting..." }}
              onSuccess={() => { sessionStorage.setItem("existence_unlocked", "true"); setUnlocked(true); trackEvent("existence_prompts_unlocked"); }}
            />
            <p className="gatePrivacy">🔒 Your info safe hai. Kabhi bhi unsubscribe kar sakte ho.</p>
          </div>
        </section>
      )}

      {/* Prompts Content */}
      {unlocked && (
        <div className="promptsContent">
          <div className="unlockBanner"><div className="unlockIcon">🎉</div><div className="unlockText"><strong>Prompts unlock ho gaye!</strong><span>Copy karo, AI mein paste karo, aur dekho magic. Yeh prompts Maine personally test kiye hain.</span></div></div>
          {existencePrompts.map((p, i) => (
            <div key={p.id}>
              {i > 0 && <hr className="sectionDivider" />}
              <div className="promptCategory">
                <div className="categoryHeader">
                  <div className="categoryIcon" style={{ background: p.iconBg }}>{p.id === "ep1" ? "✂️" : p.id === "ep2" ? "🎨" : "🧩"}</div>
                  <div className="categoryInfo"><div className="categoryEyebrow" style={{ color: p.eyebrowColor }}>{p.eyebrow}</div><div className="categoryTitle">{p.title}</div></div>
                </div>
                <div className="promptCard">
                  <div className="promptText" id={p.id}>{p.text}</div>
                  <button className={`copyBtn ${copiedId === p.id ? "copyBtnCopied" : ""}`} onClick={() => handleCopy(p.id)}>{copiedId === p.id ? "✓ Copied!" : "Copy"}</button>
                  <div className="promptTip">{p.tip}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="bottomCta"><h3>Aur help chahiye? Let&apos;s talk.</h3><p>Agar yeh prompts kaam aaye, toh imagine karo kya ho sakta hai jab hum directly kaam karein.</p><a href="/#contact" className="btn-primary">Book a Free Call →</a></div>
        </div>
      )}

      <div style={{ textAlign: "center", padding: "0 2rem 3rem" }}>
        <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: ".85rem" }}>← Back to oyenino.com</Link>
      </div>
      <Footer />
    </>
  );
}
