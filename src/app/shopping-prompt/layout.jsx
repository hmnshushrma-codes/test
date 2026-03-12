import SimpleNav from "@/components/layout/SimpleNav";

export const metadata = {
  title: "Free AI Prompt — Build a Blinkit-Style Shopping Website in 10 Minutes",
  description: "Get the exact AI prompt to build a Blinkit-style shopping website with cart and email orders — zero investment, 10 minutes.",
  alternates: { canonical: "https://oyenino.com/shopping-prompt" },
  openGraph: {
    title: "Free AI Prompt — Build a Shopping Website in 10 Min | Zero Investment",
    description: "Blinkit jaisi shopping website 10 minute mein. AI se. Free mein.",
    url: "https://oyenino.com/shopping-prompt",
    images: [{ url: "https://oyenino.com/og-image.jpg" }],
  },
};

export default function ShoppingPromptLayout({ children }) {
  return (
    <>
      <SimpleNav />
      {children}
    </>
  );
}
