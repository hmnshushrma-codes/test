import SimpleNav from "@/components/layout/SimpleNav";

export const metadata = {
  title: "AI Instagram Coach Bot — Free Prompt",
  description: "Build your own AI-powered Instagram growth bot on Telegram. Free prompt — just add your niche, clone, and run. By Himanshu at Oye Nino.",
  alternates: { canonical: "https://oyenino.com/insta-bot-prompt" },
  openGraph: {
    title: "AI Instagram Coach Bot — Free Prompt",
    description: "Build your own AI Instagram growth bot. Free. Open source. 2 min setup.",
    url: "https://oyenino.com/insta-bot-prompt",
  },
};

export default function InstaBotLayout({ children }) {
  return <><SimpleNav />{children}</>;
}
