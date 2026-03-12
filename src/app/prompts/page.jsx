"use client";

import { useState, useEffect } from "react";
import { useRevealOnScroll } from "@/lib/hooks";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/LeadForm";
import Footer from "@/components/layout/Footer";
import "@/styles/gate-pages.css";

const promptsData = [
  {
    section: "Resume / CV Prompts", icon: "📄", count: "3 Prompts", num: "01",
    prompts: [
      { id: "p1", num: "01", title: "Professional Resume Writer",
        text: `Act as an expert resume writer with 10+ years of experience. I will give you my work experience, skills, and the job description I'm applying for. Your job is to rewrite my resume in a way that: 1. Uses strong action verbs (Led, Built, Delivered, Scaled) 2. Quantifies achievements wherever possible (%, numbers, impact) 3. Is ATS-friendly with keywords from the job description 4. Is honest but positioned for maximum impact My Background: [paste your experience here] Target Job: [paste job description here] Format the output as a clean, ready-to-use resume.`,
        tip: "Job description ke keywords daalna mat bhulo — ATS systems ke liye zaruri hai." },
      { id: "p2", num: "02", title: "Resume Bullet Points Rewriter",
        text: `I have weak resume bullet points that need to be made more impactful. For each bullet point I give you, rewrite it using the formula: [Strong Action Verb] + [What you did] + [Result/Impact with numbers] If I haven't given numbers, make realistic assumptions and clearly mark them as "estimated." My current bullet points: - [paste your bullets here] Give me 2-3 alternatives for each bullet so I can choose the best one.`,
        tip: "Weak bullets sabse common mistake hain fresher resumes mein. Yeh prompt game changer hai." },
      { id: "p3", num: "03", title: "Fresher Resume (No Experience)",
        text: `I'm a fresher with no professional work experience. Help me build a strong resume using: - My education: [degree, college, year, CGPA/percentage] - Projects I built: [describe 2-3 projects] - Skills I know: [list your technical/soft skills] - Internships (if any): [describe or write "none"] - Achievements: [hackathons, competitions, certifications] Create a 1-page resume that positions me as a high-potential candidate. Focus on projects, skills, and learning ability. Make it honest but compelling.`,
        tip: "Fresher ho toh projects > experience. Projects section ko best banana hai." },
    ],
  },
  {
    section: "Personal Portfolio Website", icon: "🌐", count: "3 Prompts", num: "02",
    prompts: [
      { id: "p4", num: "04", title: "Complete Portfolio Website (HTML/CSS/JS)",
        text: `Build me a complete, single-file personal portfolio website in pure HTML, CSS, and JavaScript. No frameworks. Requirements: About Me: [your name, role, 2-3 line bio] Skills: [list your skills] Projects: [list 2-3 projects with name, description, tech used, and link] Contact: [your email, GitHub, LinkedIn] Design requirements: - Dark theme with a single accent color - Smooth scroll animations - Mobile responsive - Professional but personal — not a template look - Fast loading, no external dependencies except Google Fonts Output: Complete, ready-to-deploy HTML file.`,
        tip: "Yeh prompt ek working website deta hai jo tum GitHub Pages pe deploy kar sakte ho — FREE mein!" },
      { id: "p5", num: "05", title: "Portfolio Hero Section Copy",
        text: `Write compelling hero section copy for my personal portfolio website. I want to immediately grab the attention of recruiters and potential clients. My details: - Name: [your name] - Role: [e.g., Frontend Developer, UI Designer, Data Analyst] - Years of experience: [X years / Fresher] - Speciality: [what makes you different] - Target audience: [who will visit — recruiters, clients, startups?] Write: 1. A punchy headline (max 10 words) 2. A subheadline that explains what I do + who I help (max 25 words) 3. 2 CTA button texts 4. A 2-line "About" teaser Give me 3 variations — confident, creative, and minimal.`,
        tip: "First impression = hero section. Yahaan se recruit hoga ya nahi decide hota hai." },
      { id: "p6", num: "06", title: "Project Description Writer",
        text: `I need to write impressive project descriptions for my portfolio. For each project I describe, write a portfolio-ready description that: - Starts with what problem it solves (not what it is) - Mentions the tech stack naturally - Highlights your specific contribution - Ends with impact or outcome Format per project: - Title: [project name] - Problem line (1 sentence) - What I built (2-3 sentences) - Tech used: [comma-separated] - Outcome/Result: [what happened after] My projects: [Project 1]: [describe it] [Project 2]: [describe it]`,
        tip: "Recruiters 6 seconds dete hain portfolio ko. Problem-first descriptions unhe rok ke rakhte hain." },
    ],
  },
  {
    section: "Business Landing Page", icon: "🏢", count: "3 Prompts", num: "03",
    prompts: [
      { id: "p7", num: "07", title: "Landing Page Copy (Full)",
        text: `Write complete landing page copy for my business. Use proven conversion copywriting frameworks (AIDA, PAS). My Business: - What I sell: [product/service] - Target customer: [who they are, their pain point] - Main benefit: [biggest outcome customer gets] - Price range: [approximate] - Competitors: [2-3 competitors if known] - My USP: [what makes me different] Write all sections: 1. Headline + Subheadline 2. Problem section (agitate the pain) 3. Solution section (introduce your offer) 4. 3 Key Benefits (with icons suggested) 5. How It Works (3 steps) 6. Social Proof placeholder text 7. FAQ (5 questions) 8. CTA section Tone: Confident, clear, no fluff.`,
        tip: "Is copy ko le ke kisi bhi website builder mein paste karo. Instant professional landing page." },
      { id: "p8", num: "08", title: "Landing Page HTML Builder",
        text: `Build me a high-converting business landing page as a single HTML file. Business Details: - Business Name: [name] - What we do: [1 sentence] - Target customer: [describe them] - Main CTA: [Book a Call / Buy Now / Sign Up Free / etc.] - Color scheme preference: [or say "choose for me"] Requirements: - Above-the-fold hero with strong headline - 3 benefit cards - How it works section (3 steps) - 1 testimonial block - Contact form or CTA button - Mobile-first, responsive - Clean, modern, professional design - No external dependencies except Google Fonts Deliver: Complete, deployment-ready HTML file.`,
        tip: "Ek website 5-10 min mein. Iska baad bolo ki AI useful nahi hai 😄" },
      { id: "p9", num: "09", title: "WhatsApp / Instagram Bio + Link in Bio Page",
        text: `Help me create a high-converting "link in bio" page for my Instagram and a compelling bio. My Info: - Name/Brand: [your name or brand] - What I do: [1 sentence] - Who I help: [your target audience] - My main offers or content: [list 3-5 things you want people to click] - Instagram handle: [@yourusername] Create: 1. Instagram Bio (150 chars max) — hooks people in 3 seconds 2. A simple HTML link-in-bio page with: - Your name + tagline at top - 5 clickable link buttons (I'll give you URLs) - Social icons at bottom - Clean mobile design - Dark theme Make it feel personal, not corporate.`,
        tip: "Link in bio page apne domain pe host karo — Linktree se better dikhta hai aur professional lagta hai." },
    ],
  },
];

export default function PromptsPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  useRevealOnScroll();

  useEffect(() => {
    if (sessionStorage.getItem("prompts_unlocked") === "true") setUnlocked(true);
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
      <div className="pageHero">
        <div className="heroGlow" />
        <div className="badge"><span className="pulse" /> Free Resource</div>
        <h1 className="pageTitle">AI Prompts that actually <em>work.</em></h1>
        <p className="pageSub">Maine yeh prompts apne Instagram aur YouTube reel mein share kiye. 1000+ log &quot;prompt&quot; comment karke maang rahe the — toh yahan hain, free mein.</p>
        <div className="socialProof">🔥 <strong>1,000+</strong> people already requested these</div>
      </div>

      {!unlocked && (
        <div className="gateWrap" id="gate-section">
          <div className="gateCard">
            <div className="gateTitle">Prompts unlock karo — free hai</div>
            <div className="gateSub">Apna naam aur email daalo, prompts turant milenge. <strong>No spam, promise.</strong></div>
            <ul className="teaserList">
              <li>Resume / CV banane ke liye prompts</li>
              <li>Personal portfolio website ke liye prompts</li>
              <li>Business landing page ke liye prompts</li>
              <li>Har prompt copy-paste ready hai</li>
            </ul>
            <LeadForm formName="prompts_gate" source="prompts_page"
              btnTexts={{ ready: "🔓 Prompts Unlock Karo — Free", fields: "Sab fields fill karo", submitting: "⏳ Submitting..." }}
              onSuccess={() => { sessionStorage.setItem("prompts_unlocked", "true"); setUnlocked(true); trackEvent("prompts_unlocked"); }}
            />
            <p className="gatePrivacy">🔒 Your info safe hai. Kabhi bhi unsubscribe kar sakte ho.</p>
          </div>
        </div>
      )}

      {unlocked && (
        <div className="promptsContent">
          <div className="unlockBanner"><div className="unlockIcon">🎉</div><div className="unlockText"><strong>Prompts unlock ho gaye!</strong><span>Copy karo, paste karo ChatGPT mein, aur dekho magic. Yeh prompts Maine personally test kiye hain.</span></div></div>
          {promptsData.map((section, si) => (
            <div key={section.num}>
              {si > 0 && <hr className="sectionDivider" />}
              <div className="promptCategory">
                <div className="categoryHeader"><div className="categoryIcon">{section.icon}</div><div className="categoryInfo"><div className="categoryEyebrow">Section {section.num}</div><div className="categoryTitle">{section.section}</div></div><div className="categoryCount">{section.count}</div></div>
                <div className="promptsGrid">
                  {section.prompts.map((p) => (
                    <div key={p.id} className="promptCard"><div className="promptLabel">Prompt {p.num}</div><h4>{p.title}</h4><div className="promptText" id={p.id}>{p.text}</div><button className={`copyBtn ${copiedId === p.id ? "copyBtnCopied" : ""}`} onClick={() => handleCopy(p.id)}>{copiedId === p.id ? "✓ Copied!" : "Copy"}</button><div className="promptTip">{p.tip}</div></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="bottomCta"><h3>Aur help chahiye? Let&apos;s talk.</h3><p>Agar yeh prompts kaam aaye, toh imagine karo kya ho sakta hai jab hum directly kaam karein.</p><a href="/" className="btn-primary">Book a Free Call →</a></div>
        </div>
      )}
      <Footer />
    </>
  );
}
