import Link from "next/link";
import { trackCTA } from "@/lib/analytics";

const links = [
  { href: "https://github.com/hmnshushrma-codes", label: "GitHub", ga: "footer_github", external: true },
  { href: "https://www.linkedin.com/in/hmnshu-shrma/", label: "LinkedIn", ga: "footer_linkedin", external: true },
  { href: "https://www.youtube.com/@oye_nino", label: "YouTube", ga: "footer_youtube", external: true },
  { href: "https://www.instagram.com/oye.nino", label: "Instagram", ga: "footer_instagram", external: true },
  { href: "/prompts", label: "Free Prompts", ga: "footer_prompts" },
  { href: "/existence", label: "Existence Series", ga: "footer_existence" },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-left">© 2026 Himanshu. Built with code &amp; clarity.</div>
      <div className="footer-links">
        {links.map((l) =>
          l.external ? (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener"
              onClick={() => trackCTA(l.ga, l.label)}
              data-ga={l.ga}
            >
              {l.label}
            </a>
          ) : (
            <Link key={l.href} href={l.href} onClick={() => trackCTA(l.ga, l.label)} data-ga={l.ga}>
              {l.label}
            </Link>
          )
        )}
      </div>
    </footer>
  );
}
