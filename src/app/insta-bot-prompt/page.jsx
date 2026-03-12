"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/LeadForm";
import Footer from "@/components/layout/Footer";
import "@/styles/gate-pages.css";

const BOT_PROMPT = `I want you to create a complete Telegram bot in a single Node.js file that acts as a personalized Instagram growth assistant.

REQUIREMENTS:
- Use Telegram Bot API with long polling (getUpdates, NOT webhooks)
- Use [CHOOSE: OpenAI / Anthropic Claude / Google Gemini] API for AI responses
- Read TELEGRAM_BOT_TOKEN and API key from .env file using dotenv package
- When user sends /start, ask 4 questions one by one:
  1. What's your Instagram niche?
  2. Which creators do you admire? (comma separated handles)
  3. Who's your target audience?
  4. What language do you create content in?
- Save user profiles to profiles.json (persists across restarts)
- Support multiple users with separate profiles
- After setup, personalize ALL responses to user's niche, audience, creators, and language
- Add a fun animated console startup with loading bars, typewriter text, and witty messages

COMMANDS:
- /start — interactive onboarding (4 questions)
- /trends — 8 trending content ideas for their niche
- /hashtags [topic] — 30 hashtags (10 high volume, 10 medium, 10 niche)
- /caption [idea] — 3 caption styles (short, story, long) in their language
- /hook [topic] — 10 scroll-stopping reel hooks in their language
- /calendar — 7-day content plan with ideas, hooks, times, hashtags
- /besttimes — best posting times for their niche
- /tips — 10 growth hacks for their niche
- /report — weekly strategy report (niche analysis, creator analysis, 5 action items)
- /setup — redo onboarding
- /profile — show saved profile
- Any free text — answer Instagram growth questions

TECHNICAL:
- Single file: index.js
- Only dependency: dotenv
- Node.js 18+ (built-in fetch)
- Split messages over 4000 chars
- Show typing indicator while AI responds
- If Markdown fails, retry plain text
- Validate API keys on startup with helpful error messages

Generate: index.js, .env.example (with clear comments), package.json, .gitignore, and README.md with setup steps + deployment guide for Railway, Render, and VPS with PM2.`;

const features = [
  { icon: "📈", title: "Trending Ideas", desc: "Daily trends specific to your niche." },
  { icon: "✍️", title: "Viral Captions", desc: "3 styles. In your language." },
  { icon: "#️⃣", title: "Smart Hashtags", desc: "30 hashtags. Copy-paste ready." },
  { icon: "🎣", title: "Reel Hooks", desc: "10 scroll-stopping hooks." },
  { icon: "📅", title: "Content Calendar", desc: "Full 7-day plan." },
  { icon: "📊", title: "Weekly Report", desc: "Niche analysis + action items." },
];

const aiOptions = [
  { name: "Claude", cost: "~₹0.25/msg", quality: "⭐⭐⭐⭐⭐ Best" },
  { name: "GPT-4o mini", cost: "~₹0.08/msg", quality: "⭐⭐⭐⭐ Great" },
  { name: "Gemini", cost: "Free tier", quality: "⭐⭐⭐ Good" },
  { name: "Groq", cost: "Free tier", quality: "⭐⭐⭐ Fastest" },
];

const stepsData = [
  { label: "Step 1", text: "Copy prompt" },
  { label: "Step 2", text: "Paste into AI" },
  { label: "Step 3", text: "Save files" },
  { label: "Step 4", text: "npm start" },
];

export default function InstaBotPromptPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("insta_prompt_unlocked") === "yes") setUnlocked(true);
  }, []);

  const handleUnlock = () => {
    setFormSuccess(true);
    setTimeout(() => {
      localStorage.setItem("insta_prompt_unlocked", "yes");
      setUnlocked(true);
    }, 1500);
  };

  const handleCopy = async () => {
    const el = document.getElementById("promptBody");
    if (!el) return;
    await navigator.clipboard.writeText(el.innerText);
    setCopied(true);
    trackEvent("prompt_copied", { prompt_id: "insta_bot" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Hero */}
      <section style={{ maxWidth: 800, margin: "0 auto", padding: "5rem 2rem 3rem", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 600, background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 60%)", borderRadius: "50%", pointerEvents: "none", filter: "blur(100px)", opacity: .3 }} />
        <div className="badge"><span className="pulse" /> Free Resource</div>
        <h1 className="pageTitle">Your own AI<br /><em>Instagram Coach.</em></h1>
        <p className="pageSub" style={{ margin: "0 auto 2rem" }}>A Telegram bot that knows your niche, writes your captions, plans your week, and tells you what&apos;s trending. Built with one prompt. Running in 2 minutes.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
          {[{ n: "1", s: "file", l: "Single index.js" }, { n: "0", s: "₹", l: "Completely Free" }, { n: "2", s: "min", l: "Setup Time" }, { n: "10", s: "+", l: "Commands" }].map((st) => (
            <div key={st.l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{st.n}<span style={{ color: "var(--accent)" }}>{st.s}</span></div>
              <div style={{ fontSize: ".75rem", color: "var(--text-muted)", marginTop: ".15rem" }}>{st.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 2rem 4rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {features.map((f) => (
          <div key={f.title} style={{ background: "var(--bg-card)", padding: "2rem 1.5rem", textAlign: "center", transition: "background .3s" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: ".75rem" }}>{f.icon}</div>
            <h3 style={{ fontSize: ".95rem", fontWeight: 600, marginBottom: ".4rem" }}>{f.title}</h3>
            <p style={{ fontSize: ".8rem", color: "var(--text-muted)", lineHeight: 1.5, fontWeight: 300 }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Gate */}
      {!unlocked && (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 2rem 4rem" }}>
          <div className="gateCard">
            {!formSuccess ? (
              <>
                <h2 style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", fontWeight: 400, textAlign: "center", marginBottom: ".5rem" }}>Get the prompt. Free.</h2>
                <p style={{ color: "var(--text-muted)", fontSize: ".9rem", textAlign: "center", marginBottom: "2rem", fontWeight: 300 }}>Enter your details — I&apos;ll unlock the prompt and send you updates.</p>
                <LeadForm formName="insta_bot_prompt" source="insta-bot-prompt-page"
                  extraFields={[{ name: "niche", label: "Your Instagram Niche", placeholder: "fitness, cooking, tech...", required: true }]}
                  btnTexts={{ ready: "🧞 Unlock the Prompt →", fields: "Fill required fields first", submitting: "🧞 Unlocking..." }}
                  onSuccess={handleUnlock}
                />
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧞</div>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", marginBottom: ".5rem" }}>Hukum mere aaka!</h3>
                <p style={{ color: "var(--text-muted)", fontWeight: 300, fontSize: ".9rem" }}>Prompt unlock ho gaya. Neeche scroll karo.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Prompt Section */}
      {unlocked && (
        <>
          <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 2rem 5rem" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2 style={{ fontFamily: "var(--serif)", fontSize: "2rem", fontWeight: 400, marginBottom: ".5rem" }}>Here&apos;s your prompt 🧞</h2>
              <p style={{ color: "var(--text-muted)", fontSize: ".9rem", fontWeight: 300 }}>Copy this. Paste into ChatGPT, Claude, or Gemini. Get your bot.</p>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              {stepsData.map((s) => (
                <div key={s.label} style={{ flex: 1, minWidth: 150, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem", textAlign: "center" }}>
                  <div style={{ fontSize: ".7rem", color: "var(--accent)", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: ".35rem" }}>{s.label}</div>
                  <div style={{ fontSize: ".85rem", color: "var(--text-mid)", fontWeight: 300, lineHeight: 1.5 }}>{s.text}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "#080808", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 18px", background: "#0d0d0d", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840" }} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: ".72rem", color: "var(--text-muted)", marginLeft: 8 }}>prompt.txt</span>
                </div>
                <button className={`copyBtn ${copied ? "copyBtnCopied" : ""}`} onClick={handleCopy}>{copied ? "✓ Copied!" : "Copy Prompt"}</button>
              </div>
              <div id="promptBody" style={{ padding: "1.5rem", fontFamily: "var(--mono)", fontSize: ".78rem", lineHeight: 1.9, color: "var(--text-mid)", whiteSpace: "pre-wrap", maxHeight: 500, overflowY: "auto" }}>{BOT_PROMPT}</div>
            </div>

            <div style={{ marginTop: "2rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", textAlign: "center" }}>Which AI should you use?</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".75rem" }}>
                {aiOptions.map((ai) => (
                  <div key={ai.name} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem 1rem", textAlign: "center", transition: "all .3s", cursor: "default" }}>
                    <div style={{ fontWeight: 600, fontSize: ".9rem", marginBottom: ".2rem" }}>{ai.name}</div>
                    <div style={{ fontSize: ".75rem", color: "var(--accent)", fontWeight: 500 }}>{ai.cost}</div>
                    <div style={{ fontSize: ".7rem", color: "var(--text-muted)", marginTop: ".2rem" }}>{ai.quality}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 2rem 4rem" }}>
            <div style={{ background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(0,240,160,.04) 100%)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "2.5rem", textAlign: "center" }}>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.5rem", fontWeight: 400, marginBottom: ".5rem" }}>Want the ready-made bot?</h3>
              <p style={{ color: "var(--text-muted)", fontSize: ".9rem", fontWeight: 300, marginBottom: "1.5rem" }}>Skip the prompt — clone and run in 2 minutes.</p>
              <a href="https://github.com/hmnshushrma-codes" className="btn-primary" target="_blank" rel="noopener">&lt;/&gt; Clone from GitHub →</a>
            </div>
          </div>
        </>
      )}

      <footer style={{ borderTop: "1px solid var(--border)", padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: ".8rem", fontWeight: 300 }}>Built by <a href="/" style={{ color: "var(--accent)", textDecoration: "none" }}>himanshu</a> — <a href="https://instagram.com/oye.nino" target="_blank" rel="noopener" style={{ color: "var(--accent)", textDecoration: "none" }}>@oye.nino</a></p>
      </footer>
    </>
  );
}
