import SimpleNav from "@/components/layout/SimpleNav";

export const metadata = {
  title: "Free AI Prompt — Manage Website Products Without Code",
  description: "Get the exact AI prompt to build a product-manageable website. Add, edit, hide, delete products — just edit a simple list. Zero coding.",
  alternates: { canonical: "https://oyenino.com/manage-prompt" },
  openGraph: {
    title: "Free AI Prompt — Manage Website Products Without Code",
    description: "Website ke products add, edit, hide, delete karo — bina code. Free AI prompt.",
    url: "https://oyenino.com/manage-prompt",
  },
};

export default function ManagePromptLayout({ children }) {
  return <><SimpleNav />{children}</>;
}
