"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return;
    const handler = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed", width: 300, height: 300,
        background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none", zIndex: 1,
        transform: "translate(-50%, -50%)", transition: "opacity .3s",
        opacity: 0, filter: "blur(40px)",
      }}
      className="cursor-glow"
    />
  );
}
