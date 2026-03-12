import SimpleNav from "@/components/layout/SimpleNav";

export const metadata = {
  title: "Free AI Prompts — Resume, Portfolio & Landing Page",
  description: "Get the exact ChatGPT prompts Himanshu uses to build resume sites, personal portfolios, and business landing pages. 9 free prompts — enter your email and unlock instantly.",
  keywords: "free ChatGPT prompts, AI prompts for resume, portfolio website prompt, landing page prompt, ChatGPT prompts India, oye nino prompts",
  alternates: { canonical: "https://oyenino.com/prompts" },
  openGraph: {
    title: "Free AI Prompts — Resume, Portfolio & Landing Page | Himanshu",
    description: "1000+ log maang rahe the — toh yahan hain. 9 free ChatGPT prompts for resume, portfolio, and business landing pages. Unlock instantly.",
    url: "https://oyenino.com/prompts",
    images: [{ url: "https://oyenino.com/og-image.jpg" }],
  },
};

export default function PromptsLayout({ children }) {
  return (
    <>
      <SimpleNav />
      {children}
    </>
  );
}
