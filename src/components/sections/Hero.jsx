"use client";

import { useEffect, useRef } from "react";
import { trackCTA } from "@/lib/analytics";
import styles from "./Hero.module.css";

const terminalLines = [
  { num: 1, delay: 2400, content: <span className="t-comment">{"// who am i?"}</span> },
  { num: 2, delay: 2800, content: <><span className="t-keyword">const</span> <span className="t-variable">himanshu</span> <span className="t-plain">=</span> <span className="t-bracket">{"{"}</span></> },
  { num: 3, delay: 3200, indent: true, content: <><span className="t-property">role</span><span className="t-plain">:</span> <span className="t-string">&quot;Product Engineer&quot;</span><span className="t-plain">,</span></> },
  { num: 4, delay: 3600, indent: true, content: <><span className="t-property">experience</span><span className="t-plain">:</span> <span className="t-string">&quot;12+ years in production&quot;</span><span className="t-plain">,</span></> },
  { num: 5, delay: 4000, indent: true, content: <><span className="t-property">stack</span><span className="t-plain">:</span> <span className="t-bracket">[</span><span className="t-string">&quot;React&quot;</span><span className="t-plain">,</span> <span className="t-string">&quot;Next.js&quot;</span><span className="t-plain">,</span> <span className="t-string">&quot;TypeScript&quot;</span><span className="t-plain">,</span> <span className="t-string">&quot;AI&quot;</span><span className="t-bracket">]</span><span className="t-plain">,</span></> },
  { num: 6, delay: 4400, indent: true, content: <><span className="t-property">shipped</span><span className="t-plain">:</span> <span className="t-number">50</span><span className="t-plain">+</span> <span className="t-comment">{"// projects"}</span><span className="t-plain">,</span></> },
  { num: 7, delay: 4800, indent: true, content: <><span className="t-property">clients</span><span className="t-plain">:</span> <span className="t-string">&quot;worldwide&quot;</span><span className="t-plain">,</span></> },
  { num: 8, delay: 5200, indent: true, content: <><span className="t-property">motto</span><span className="t-plain">:</span> <span className="t-string">&quot;Make it work. Make it clean.&quot;</span></> },
  { num: 9, delay: 5600, content: <><span className="t-bracket">{"}"}</span><span className="t-plain">;</span></> },
  { num: 10, delay: 6200, content: null },
  { num: 11, delay: 6600, content: <span className="t-comment">{"// ready to build something?"}</span> },
  { num: 12, delay: 7000, content: <><span className="t-variable">himanshu</span><span className="t-plain">.</span><span className="t-function">startProject</span><span className="t-bracket">(</span><span className="t-string">&quot;yours&quot;</span><span className="t-bracket">)</span><span className="t-plain">;</span> <span className={styles.cursorBlink}></span></> },
];

export default function Hero() {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    const lines = terminalRef.current.querySelectorAll('[data-delay]');
    const timers = [];
    lines.forEach((l) => {
      timers.push(
        setTimeout(() => l.classList.add(styles.visible), parseInt(l.dataset.delay) || 0)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <header className={styles.hero}>
      <div className={styles.heroGlow} />
      <div className={styles.heroGlow2} />

      <div className={styles.heroLeft}>
        <div className={styles.heroBadge}>
          <span className={styles.pulse} /> Available for consulting
        </div>
        <h1 className={styles.heroTitle}>
          <span className={styles.line}>I make tech</span>
          <span className={styles.line}>feel <em>simple.</em></span>
        </h1>
        <p className={styles.heroSub}>
          Product Engineer who turns complex technical problems into clean, working products. React, AI, and everything in between — explained in plain English, built with precision.
        </p>
        <div className={styles.heroActions}>
          <a href="#contact" className="btn-primary" onClick={() => trackCTA("hero_cta_book_call", "Book a Free Call")} data-ga="hero_cta_book_call">Book a Free Call →</a>
          <a href="#services" className="btn-ghost" onClick={() => trackCTA("hero_cta_see_services", "See How I Help")} data-ga="hero_cta_see_services">See How I Help</a>
        </div>
      </div>

      <div className={styles.heroRight}>
        <div className={styles.terminal}>
          <div className={styles.terminalBar}>
            <div className={`${styles.terminalDot} ${styles.red}`} />
            <div className={`${styles.terminalDot} ${styles.yellow}`} />
            <div className={`${styles.terminalDot} ${styles.green}`} />
            <div className={styles.terminalTitle}>himanshu.js — ~/projects</div>
            <div style={{ width: 36 }} />
          </div>
          <div className={styles.terminalBody} ref={terminalRef}>
            {terminalLines.map((line) => (
              <div key={line.num} className={styles.tLine} data-delay={line.delay}>
                <span className={styles.tLinenum}>{line.num}</span>
                {line.content && (line.indent ? <span className={styles.tIndent}>{line.content}</span> : line.content)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
    </header>
  );
}
