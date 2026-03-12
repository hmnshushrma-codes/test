"use client";

import { useState, useEffect, useRef } from "react";
import { trackEvent, trackCTA } from "@/lib/analytics";
import OyeNinoForm from "@/components/forms/OyeNinoForm";
import LeadForm from "@/components/forms/LeadForm";
import { FormInput, FormTextarea, FormSelect, FormRow, FormNote, FieldStatus } from "@/components/forms/FormFields";
import styles from "./HomeSections.module.css";

/* ========= PROOF BAR ========= */
const stats = [
  { num: "12", accent: "+", desc: "Years in Production" },
  { num: "50", accent: "+", desc: "Projects Shipped" },
  { num: "15", accent: "+", desc: "Global Clients" },
  { num: "24", accent: "h", desc: "Response Time" },
];

export function ProofBar() {
  return (
    <div className={styles.proofBar}>
      <div className={styles.proofInner}>
        <div className={`${styles.proofStats} reveal stagger-parent`}>
          {stats.map((s) => (
            <div key={s.desc} className={`${styles.proofStat} stagger-child`}>
              <div className={styles.proofNum}>{s.num}<span className={styles.accentDot}>{s.accent}</span></div>
              <div className={styles.proofDesc}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========= VALUE SECTION ========= */
const values = [
  { icon: "⚙", title: "Complexity → Clarity", desc: "I break down messy technical problems into clear, actionable steps. No jargon, no over-engineering." },
  { icon: "⚡", title: "Speed Without Shortcuts", desc: "Production-ready code shipped fast, without sacrificing architecture. Clean code, not technical debt." },
  { icon: "🌎", title: "Global, Human Touch", desc: "Based in India, working with teams worldwide. Real conversations, weekly updates, and zero ghosting." },
];

export function ValueSection() {
  return (
    <div className={styles.valueSection} data-section="value_proposition">
      <div className={styles.valueInner}>
        <p className="section-eyebrow reveal" style={{ justifyContent: "center" }}><span></span>Why Me</p>
        <div className={`${styles.valueHeading} reveal`}>
          You don&apos;t need another developer.<br />
          You need someone who <strong>understands your problem</strong> and builds the <strong>right solution</strong> — not the complicated one.
        </div>
        <div className={`${styles.valueCards} reveal stagger-parent`}>
          {values.map((v) => (
            <div key={v.title} className={`${styles.valueCard} stagger-child`}>
              <span className={styles.vcIcon}>{v.icon}</span>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========= SERVICES ========= */
const services = [
  { num: "01", title: "Frontend Architecture", desc: "Scalable React and Next.js applications. Component systems, state management, performance tuning — built so your team can maintain it.", tags: ["React.js", "Next.js", "TypeScript", "Performance"], ga: "frontend_architecture" },
  { num: "02", title: "AI Integration", desc: "Turn AI from a buzzword into a feature. LLM-powered chatbots, smart workflows, and AI-enhanced UX — connected to your product.", tags: ["OpenAI", "LangChain", "AI/UX", "Automation"], ga: "ai_integration" },
  { num: "03", title: "Technical Consulting", desc: "Architecture reviews, code audits, and tech stack decisions. Avoid the expensive mistakes that become visible 6 months later.", tags: ["Code Audit", "Architecture", "Mentoring", "Strategy"], ga: "technical_consulting" },
  { num: "04", title: "Full Stack Development", desc: "Complete product builds — database to deployment. APIs, authentication, admin panels, and polished UIs. One person, full ownership.", tags: ["Node.js", "REST APIs", "PostgreSQL", "DevOps"], ga: "full_stack_development" },
];

export function ServicesSection() {
  const cardsRef = useRef([]);

  useEffect(() => {
    const handlers = [];
    cardsRef.current.forEach((card) => {
      if (!card) return;
      const handleMove = (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", e.clientX - r.left + "px");
        card.style.setProperty("--mouse-y", e.clientY - r.top + "px");
      };
      card.addEventListener("mousemove", handleMove);
      handlers.push(() => card.removeEventListener("mousemove", handleMove));
    });
    return () => handlers.forEach((fn) => fn());
  }, []);

  return (
    <section id="services" data-section="services">
      <p className="section-eyebrow reveal">What I Do</p>
      <h2 className="section-title reveal">Technical consulting<br />that actually ships.</h2>
      <p className="section-desc reveal">From architecture decisions to production deployment — I help at every stage.</p>
      <div className={styles.servicesGrid}>
        {services.map((s, i) => (
          <article key={s.num} ref={(el) => (cardsRef.current[i] = el)} className={`${styles.serviceCard} reveal`} data-service={s.ga}>
            <span className={styles.scNumber}>{s.num}</span>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className={styles.scTags}>
              {s.tags.map((t) => <span key={t}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ========= PROCESS ========= */
const steps = [
  { num: "01", title: "Discovery Call (Free)", desc: "30 minutes, no strings. You explain the problem, I tell you honestly if I'm the right fit." },
  { num: "02", title: "Scope & Proposal", desc: "A clear document with deliverables, timeline, and cost. You know exactly what you're paying for." },
  { num: "03", title: "Build in Sprints", desc: "Weekly demos, async updates, and real progress you can see. No disappearing for 3 weeks." },
  { num: "04", title: "Launch & Handoff", desc: "Deploy with confidence. Full documentation, knowledge transfer, and 2 weeks post-launch support." },
];

export function ProcessSection() {
  return (
    <section id="process" className={styles.processSection} data-section="process">
      <p className="section-eyebrow reveal">How It Works</p>
      <h2 className="section-title reveal">From first call to<br />first deploy. Simply.</h2>
      <div className={styles.processTimeline}>
        {steps.map((s) => (
          <div key={s.num} className={`${styles.processStep} reveal`}>
            <div className={styles.psMarker}>{s.num}</div>
            <div className={styles.psContent}>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ========= TECH STACK ========= */
const techStack = [
  "React.js","Next.js","TypeScript","JavaScript","Node.js","Express.js",
  "GraphQL","REST APIs","Tailwind CSS","PostgreSQL","MongoDB","Redis",
  "AWS","Vercel","Docker","GitHub Actions","Figma","OpenAI API","LangChain","Playwright","Vite",
];

export function StackSection() {
  return (
    <div className={styles.stackSection} id="stack" data-section="tech_stack">
      <div className={styles.stackInner}>
        <p className="section-eyebrow reveal">Tech Stack</p>
        <h2 className="section-title reveal">The tools behind<br />the results.</h2>
        <div className={`${styles.stackGrid} reveal stagger-parent`}>
          {techStack.map((t) => (
            <span key={t} className={`${styles.stackChip} stagger-child`}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ========= TESTIMONIAL ========= */
export function TestimonialSection() {
  return (
    <div className={styles.testimonialBlock} data-section="testimonial">
      <div className={`${styles.testiContainer} reveal`}>
        <div className={styles.testiQuoteMark}>&ldquo;</div>
        <p className={styles.testiText}>
          Himanshu turned what felt like an impossible deadline into a smooth launch. He didn&apos;t just deliver code — he helped us rethink our approach entirely. Six weeks from concept to production, and our team can actually maintain what he built.
        </p>
        <div className={styles.testiAuthor}>
          <div className={styles.testiAvatar}>★</div>
          <div className={styles.testiMeta}>
            <strong>Startup Founder</strong>
            <span>SaaS Product · Finland</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========= CTA BANNER ========= */
export function CTABanner() {
  return (
    <div className={`${styles.ctaBanner} reveal`} data-section="cta_banner">
      <div className={styles.ctaInner}>
        <h2>Got a project? Let&apos;s make it real.</h2>
        <p>Free 30-minute call. No pitch, just a conversation about your problem.</p>
        <a href="#contact" className="btn-primary" onClick={() => trackCTA("cta_banner_book", "Book Your Free Call")} data-ga="cta_banner_book">Book Your Free Call →</a>
      </div>
    </div>
  );
}

/* ========= CONTACT ========= */
const serviceOptions = [
  { value: "Frontend Architecture", label: "Frontend Architecture" },
  { value: "AI Integration", label: "AI Integration" },
  { value: "Technical Consulting", label: "Technical Consulting" },
  { value: "Full Stack Development", label: "Full Stack Development" },
  { value: "Code Audit", label: "Code Audit / Review" },
  { value: "Other", label: "Something Else" },
];

const channels = [
  { href: "mailto:himanshu.sharma.codes@gmail.com", icon: "✉", label: "himanshu.sharma.codes@gmail.com", ga: "social_email" },
  { href: "https://github.com/hmnshushrma-codes", icon: "</>", label: "GitHub", ga: "social_github", external: true },
  { href: "https://www.linkedin.com/in/hmnshu-shrma/", icon: "in", label: "LinkedIn", ga: "social_linkedin", external: true },
  { href: "https://youtube.com/@oye_nino", icon: "▶", label: "YouTube", ga: "social_youtube", external: true },
  { href: "https://www.instagram.com/oye.nino", icon: "●", label: "Instagram", ga: "social_instagram", external: true },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="contact" data-section="contact">
      <p className="section-eyebrow reveal">Get In Touch</p>
      <h2 className="section-title reveal">Start with a<br />simple message.</h2>
      <p className="section-desc reveal">Fill out the form and I&apos;ll respond within 24 hours. No automated replies — you talk to me directly.</p>
      <div className={styles.contactLayout}>
        <div className={`${styles.contactLeft} reveal`}>
          <h3>Let&apos;s keep it simple.</h3>
          <p>Tell me what you&apos;re building and where you&apos;re stuck. I&apos;ll be honest about whether I can help.</p>
          <div className={styles.contactChannels}>
            {channels.map((c) => (
              <a key={c.ga} href={c.href} className={styles.chItem} target={c.external ? "_blank" : undefined} rel={c.external ? "noopener" : undefined} onClick={() => trackCTA(c.ga, c.label)} data-ga={c.ga}>
                <span className={styles.chIcon} dangerouslySetInnerHTML={{ __html: c.icon }} />
                {c.label}
              </a>
            ))}
          </div>
        </div>

        <div className={`${styles.contactForm} reveal`}>
          {!submitted ? (
            <LeadForm
              formName="contact"
              source="main_site"
              extraFields={[
                { name: "city", label: "Your City", placeholder: "Mumbai, India" },
                { name: "service", label: "What do you need?", type: "select", placeholder: "Select a service...", options: serviceOptions },
                { name: "message", label: "Tell me about your project", type: "textarea", placeholder: "What are you building? Where are you stuck? Any timeline or budget in mind?", required: true },
              ]}
              btnTexts={{ ready: "Send Message →", fields: "Fill required fields first", submitting: "Sending..." }}
              onSuccess={() => {
                setSubmitted(true);
                trackEvent("generate_lead", { currency: "USD", value: 1 });
              }}
            />
          ) : (
            <div className="form-success" style={{ display: "block" }}>
              <div className="checkmark">✓</div>
              <h3>Message received!</h3>
              <p>I&apos;ll get back to you within 24 hours. Talk soon.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
