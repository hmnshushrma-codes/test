"use client";

import { useEffect, useState, useMemo } from "react";

export default function GridOverlay() {
  const [visible, setVisible] = useState(true);
  const [grid, setGrid] = useState(null);
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [flashSet, setFlashSet] = useState(new Set());

  // Calculate grid dimensions on mount
  useEffect(() => {
    const mob = window.innerWidth < 768;
    const cols = mob ? 6 : 10;
    const rows = mob ? 8 : 7;
    setGrid({ cols, rows, total: cols * rows });
  }, []);

  // Run the reveal animation
  useEffect(() => {
    if (!grid) return;

    const { cols, rows, total } = grid;
    const cx = Math.floor(cols / 2);
    const cy = Math.floor(rows / 2);

    const sorted = Array.from({ length: total }, (_, idx) => ({
      idx,
      dist: Math.sqrt(
        (idx % cols - cx) ** 2 + (Math.floor(idx / cols) - cy) ** 2
      ),
    })).sort((a, b) => a.dist - b.dist);

    const B = 300;
    const G = 22;
    const timers = [];

    sorted.forEach((item, i) => {
      const d = B + i * G;
      timers.push(
        setTimeout(() => setFlashSet((prev) => new Set([...prev, item.idx])), d - 60)
      );
      timers.push(
        setTimeout(() => {
          setFlashSet((prev) => {
            const next = new Set(prev);
            next.delete(item.idx);
            return next;
          });
          setRevealedSet((prev) => new Set([...prev, item.idx]));
        }, d)
      );
    });

    timers.push(
      setTimeout(() => setVisible(false), B + sorted.length * G + 1200)
    );

    return () => timers.forEach(clearTimeout);
  }, [grid]);

  if (!visible || !grid) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "grid",
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
      }}
    >
      {Array.from({ length: grid.total }, (_, idx) => (
        <div
          key={idx}
          style={{
            background: "var(--bg)",
            border: "0.5px solid rgba(0,240,160,0.02)",
            transition:
              "transform .7s cubic-bezier(.23,1,.32,1), opacity .7s cubic-bezier(.23,1,.32,1)",
            transformOrigin: "center",
            position: "relative",
            overflow: "hidden",
            opacity: revealedSet.has(idx) ? 0 : 1,
            transform: revealedSet.has(idx)
              ? "scale(.7) rotateX(20deg)"
              : "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--accent)",
              opacity: flashSet.has(idx) ? 0.2 : 0,
              transition: "opacity .12s",
            }}
          />
        </div>
      ))}
    </div>
  );
}
