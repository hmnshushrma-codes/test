import SimpleNav from "@/components/layout/SimpleNav";

export const metadata = {
  title: "The Existence Series — Website Design Demos",
  description: "See how 3 things — Business Nature, Colors & Typography — completely change a website's feel. Live demos by Himanshu (@oye.nino).",
  alternates: { canonical: "https://oyenino.com/existence" },
  openGraph: {
    title: "The Existence Series — Website Design Demos",
    description: "Same layout, completely different feel. See how Nature, Colors & Typography change everything.",
    url: "https://oyenino.com/existence",
  },
};

export default function ExistenceLayout({ children }) {
  return <><SimpleNav />{children}</>;
}
