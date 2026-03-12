"use client";

import Footer from "@/components/layout/Footer";

export default function ExistenceDemoPage() {
  return (
    <>
      <div style={{ padding: "9rem 2rem 5rem", maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 400, marginBottom: "1rem" }}>
          Existence Demo
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", fontWeight: 300 }}>
          This demo page content will be ported from the original HTML. Each existence demo has unique styles and theme.
        </p>
      </div>
      <Footer />
    </>
  );
}
