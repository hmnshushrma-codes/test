"use client";

import Link from "next/link";
import styles from "./SimpleNav.module.css";

export default function SimpleNav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.navLogo}>himanshu<span>.</span></Link>
      <Link href="/" className={styles.navBack}>← Back to Portfolio</Link>
    </nav>
  );
}
