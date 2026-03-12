import Script from "next/script";
import { GA_ID } from "@/lib/analytics";
import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://oyenino.com"),
  title: {
    default: "Himanshu | Senior Frontend Developer & Technical Consultant — React, AI, Web Development",
    template: "%s | Himanshu (@oye.nino)",
  },
  description: "Hire Himanshu — Senior Frontend Engineer & Technical Consultant specializing in React.js, Next.js, AI integration, and scalable web applications. Available for freelance consulting worldwide.",
  keywords: [
    "frontend developer", "React developer", "technical consultant",
    "hire frontend developer India", "React.js consultant", "Next.js developer",
    "AI integration", "web development consultant", "freelance developer",
    "senior software engineer", "full stack developer", "JavaScript expert",
  ],
  authors: [{ name: "Himanshu" }],
  creator: "Himanshu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oyenino.com/",
    title: "Himanshu | Senior Frontend Developer & Technical Consultant",
    description: "I make tech feel simple. Senior Frontend Engineer specializing in React.js, AI integration, and scalable web solutions. Consulting worldwide.",
    images: [{ url: "https://oyenino.com/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himanshu | Senior Frontend Developer & Technical Consultant",
    description: "I make tech feel simple. React.js, AI, and scalable web solutions. Consulting worldwide.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://oyenino.com/" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","${GA_ID}");`}
        </Script>

        {/* Cloudflare Turnstile */}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="lazyOnload"
        />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Himanshu — Technical Consulting",
              description: "Senior Frontend Developer and Technical Consultant specializing in React.js, Next.js, AI integration, and scalable web application development.",
              url: "https://oyenino.com",
              areaServed: ["IN", "US", "GB", "AE", "CA", "AU", "DE", "SG"],
              serviceType: ["Frontend Development", "Technical Consulting", "React.js Development", "AI Integration", "Web Application Development"],
              priceRange: "$$",
              address: { "@type": "PostalAddress", addressCountry: "IN" },
              sameAs: [
                "https://github.com/hmnshushrma-codes",
                "https://www.linkedin.com/in/hmnshu-shrma/",
                "https://www.instagram.com/oye.nino",
                "https://youtube.com/@oye_nino",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Himanshu",
              jobTitle: "Senior Frontend Developer & Technical Consultant",
              knowsAbout: ["React.js", "Next.js", "JavaScript", "TypeScript", "AI Integration", "Frontend Architecture", "Web Performance", "SEO Optimization"],
              url: "https://oyenino.com",
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
