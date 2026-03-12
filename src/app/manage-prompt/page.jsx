"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRevealOnScroll } from "@/lib/hooks";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/LeadForm";
import CursorGlow from "@/components/ui/CursorGlow";
import Footer from "@/components/layout/Footer";
import promptData from "@/data/manage-prompt-data.json";
import "@/styles/gate-pages.css";

const floatingProducts = [
  { emoji: "🍵", name: "Masala Chai", price: "₹15" },
  { emoji: "🧁", name: "Muffin", price: "₹40" },
  { emoji: "🍞", name: "Bun Makkhan", price: "₹10" },
  { emoji: "🌿", name: "Tulsi Chai", price: "₹18" },
  { emoji: "🫖", name: "Kesar Chai", price: "₹25" },
  { emoji: "🍪", name: "Biscuit Combo", price: "₹30" },
];

const powerTags = ["Add Products", "Edit Price", "Change Image", "Hide / Unhide", "Delete", "Zero Coding"];

export default function ManagePromptPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  useRevealOnScroll();

  useEffect(() => {
    if (sessionStorage.getItem("manage_prompt_unlocked") === "true") setUnlocked(true);
  }, []);

  const handleCopy = async () => {
    const el = document.getElementById("main-prompt");
    if (!el) return;
    await navigator.clipboard.writeText(el.innerText);
    setCopied(true);
    trackEvent("prompt_copied", { prompt_id: "manage_main" });
    setTimeout(() => setCopied(false), 2000);
  };

  const p = promptData.prompt;
  const cs = promptData.cheatSheet;
  const h = promptData.howToUse;
  const cta = promptData.cta;

  return (
    <>
      <CursorGlow />
      <div className="pageHero" style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div className="heroGlow" />
        <div className="badge"><span className="pulse" /> Free Prompt — The Existence Series</div>
        <h1 className="pageTitle">Website ke products<br /><em>manage</em> karo — bina code.</h1>
        <p className="pageSub">Add karo, edit karo, hide karo, delete karo. Ek simple list se poori website control hoti hai.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", justifyContent: "center", marginTop: "1.5rem" }}>
          {powerTags.map((t) => (
            <span key={t} style={{ padding: ".4rem 1rem", border: "1px solid var(--border)", borderRadius: "100px", fontSize: ".8rem", color: "var(--text-muted)", transition: "all .3s" }}>{t}</span>
          ))}
        </div>
      </div>

      {!unlocked && (
        <div className="gateWrap reveal" id="gate-section">
          <div className="gateCard">
            <div className="gateTitle">Prompt unlock karo — free hai</div>
            <div className="gateSub">Apna naam aur email daalo, prompt turant milega. <strong>No spam, promise.</strong></div>
            <ul className="teaserList">
              <li>AI se website bano jo products ek list se load kare</li>
              <li>Naam, price, image, description — sab list mein</li>
              <li>Naya product? List mein add karo — website mein aa jayega</li>
              <li>Product hide karo bina delete kiye — ek word se</li>
              <li>Copy-paste ready — Claude ya ChatGPT mein daalo</li>
            </ul>
            <LeadForm formName="manage_prompt_gate" source="manage_prompt_page"
              btnTexts={{ ready: "🔓 Prompt Unlock Karo — Free", fields: "Sab fields fill karo", submitting: "⏳ Submitting..." }}
              onSuccess={() => { sessionStorage.setItem("manage_prompt_unlocked", "true"); setUnlocked(true); trackEvent("manage_prompt_unlocked"); }}
            />
            <p className="gatePrivacy">🔒 Your info safe hai. Kabhi bhi unsubscribe kar sakte ho.</p>
          </div>
        </div>
      )}

      {unlocked && (
        <div className="promptsContent">
          <div className="unlockBanner"><div className="unlockIcon">🎉</div><div className="unlockText"><strong>Prompt unlock ho gaya!</strong><span>Copy karo, AI mein paste karo. Do files milegi — website + products list.</span></div></div>

          <div className="promptCategory">
            <div className="categoryHeader"><div className="categoryIcon">🔧</div><div className="categoryInfo"><div className="categoryEyebrow">{p.eyebrow}</div><div className="categoryTitle">{p.title}</div></div></div>
            <div className="promptCard">
              <div className="promptLabel">{p.label}</div>
              <h4>{p.heading}</h4>
              <div className="promptText" id="main-prompt">{p.text}</div>
              <button className={`copyBtn ${copied ? "copyBtnCopied" : ""}`} onClick={handleCopy}>{copied ? "✓ Copied!" : "Copy"}</button>
              <div className="promptTip">{p.tip}</div>
            </div>
          </div>

          <div className="cheatSheet">
            <h3>{cs.title}</h3>
            {cs.rows.map((row, i) => (
              <div key={i} className="cheatRow">
                <div className="cheatAction">{row.action}</div>
                <div className="cheatHow" dangerouslySetInnerHTML={{ __html: row.how }} />
              </div>
            ))}
          </div>

          <div className="howToUse">
            <h3>{h.title}</h3>
            {h.steps.map((step, i) => (
              <div key={i} className="stepItem"><div className="stepNum">{i + 1}</div><div className="stepText" dangerouslySetInnerHTML={{ __html: step.text }} /></div>
            ))}
          </div>

          <div className="bottomCta">
            <h3>{cta.title}</h3>
            <p>{cta.subtitle}</p>
            <div className="ctaButtons">
              {cta.buttons.map((btn, i) => (
                <Link key={i} href={btn.href.replace(".html", "")} className={btn.style === "primary" ? "btn-primary" : "btn-ghost"}>{btn.text}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
