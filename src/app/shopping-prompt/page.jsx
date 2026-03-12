"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRevealOnScroll } from "@/lib/hooks";
import { trackEvent } from "@/lib/analytics";
import LeadForm from "@/components/forms/LeadForm";
import Footer from "@/components/layout/Footer";
import "@/styles/gate-pages.css";

const MAIN_PROMPT = `Build me a complete, single-file shopping website in pure HTML, CSS, and JavaScript. No frameworks. No backend. No payment gateway. This is for a small local business that wants to take orders online with zero investment.

=== BUSINESS DETAILS (REPLACE WITH YOUR OWN) ===
- Shop Name: [Your Shop Name — e.g., "Sharma General Store"]
- Shop Tagline: [One line — e.g., "Fresh groceries delivered to your door"]
- Shop Location: [Your area — e.g., "Varanasi, UP"]
- Shop Phone: [WhatsApp number for customers to contact]
- Shop Owner Email: [Email where orders will be received]
- Product Categories: [e.g., "Groceries, Dairy, Snacks, Beverages"]

=== PRODUCTS (REPLACE WITH YOUR OWN) ===
Add 8-12 products with these details for each:
- Product Name
- Price (in ₹)
- Category
- Image URL (hosted on imgbb.com — upload your images there and paste the direct link)
- Short description (1 line)

Example:
1. Aashirvaad Atta (5kg) | ₹280 | Groceries | https://i.ibb.co/xxxxx/atta.jpg | "Premium whole wheat flour"
2. Amul Butter (500g) | ₹280 | Dairy | https://i.ibb.co/xxxxx/butter.jpg | "Fresh salted butter"
[Add your products here...]

=== WEBSITE REQUIREMENTS ===

DESIGN:
- Clean, modern, mobile-first design (80%+ users will be on phone)
- Shop name and tagline in header
- Product grid with images, name, price, and "Add to Cart" button
- Category filter buttons at the top to filter products
- Sticky cart icon in bottom-right showing item count
- Color scheme: [choose your preference or say "choose a clean, trustworthy scheme"]

CART FUNCTIONALITY:
- Clicking "Add to Cart" adds item with quantity 1
- Cart page/modal shows all added items with:
  - Product name, price, quantity
  - Plus/minus buttons to change quantity
  - Remove button for each item
  - Running subtotal for each item
  - Grand total at bottom
- Cart data stored in browser (localStorage)

ORDER / CHECKOUT:
- "Place Order" button opens a simple form asking:
  - Customer Name (required)
  - Phone Number (required)
  - Delivery Address (required)
  - Any special instructions (optional)
- When form is submitted, it sends an email containing:
  - All cart items (name, quantity, price)
  - Grand total
  - Customer details (name, phone, address, instructions)
- Use Formspree (formspree.io) or EmailJS for sending the email — NO backend needed
- For Formspree: action="https://formspree.io/f/[YOUR_FORM_ID]"
- Construct hidden fields that compile the full cart summary into the email body
- After successful submission:
  - Clear the cart
  - Show a confirmation message: "Order placed! [Shop Name] will contact you on WhatsApp to confirm."
  - Show the shop's WhatsApp link so customer can directly message

IMAGES:
- All product images hosted on imgbb.com (free image hosting, works as CDN)
- DO NOT put images in the project folder or on GitHub
- Use direct imgbb URLs in img src tags
- Add lazy loading to all images: loading="lazy"
- Add proper alt text for each product image

TECHNICAL:
- Everything in a SINGLE HTML file (HTML + CSS + JS)
- Mobile responsive — looks great on phones
- Fast loading — minimal code, optimized images via imgbb CDN
- No external dependencies except Google Fonts (optional)
- Smooth animations on cart interactions
- WhatsApp integration: "Chat on WhatsApp" floating button linking to wa.me/[shop_phone]

=== IMPORTANT NOTES ===
- This is NOT an e-commerce store with payment processing
- This is an ORDER COLLECTION system — shopkeeper receives order via email, then contacts customer to confirm availability, pricing, and delivery
- Keep it simple, fast, and functional
- The entire website should work by just opening the HTML file in a browser — no server needed
- Make sure the email contains a COMPLETE, READABLE order summary — not just form field names

Output: Complete, deployment-ready single HTML file.`;

const steps = [
  { num: 1, text: <><strong>Product images upload karo</strong> — imgbb.com pe jaao, apni product photos upload karo, direct link copy karo. Yeh free CDN ki tarah kaam karega.</> },
  { num: 2, text: <><strong>Formspree pe account banao</strong> — formspree.io pe sign up karo (free), ek form create karo, form ID copy karo. Orders isi email pe aayenge.</> },
  { num: 3, text: <><strong>Prompt mein apne details daalo</strong> — shop name, products, prices, imgbb links, Formspree ID, WhatsApp number — sab replace karo brackets mein.</> },
  { num: 4, text: <><strong>ChatGPT mein paste karo</strong> — poora prompt copy karke ChatGPT (ya Claude) mein daalo. Ek complete HTML file milegi.</> },
  { num: 5, text: <><strong>Deploy karo — FREE</strong> — GitHub Pages ya Vercel pe upload karo. Custom domain chahiye? Pichli reel dekho. Done. Dukaan live.</> },
];

export default function ShoppingPromptPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  useRevealOnScroll();

  useEffect(() => {
    if (sessionStorage.getItem("shopping_prompt_unlocked") === "true") setUnlocked(true);
  }, []);

  const handleCopy = async () => {
    const el = document.getElementById("main-prompt");
    if (!el) return;
    await navigator.clipboard.writeText(el.innerText);
    setCopied(true);
    trackEvent("prompt_copied", { prompt_id: "shopping_main" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="pageHero">
        <div className="heroGlow" />
        <div className="badge"><span className="pulse" /> Free Prompt — The Existence Series</div>
        <h1 className="pageTitle">Blinkit jaisi website.<br />10 min. <em>₹0.</em></h1>
        <p className="pageSub">Kitna kar sakte ho zero investment mein? Yeh woh prompt hai jisse maine reel mein shopping website banayi. 4,000+ log maang rahe the — lo, free hai.</p>
        <div className="socialProof">🔥 <strong>4,000+</strong> people commented asking for this prompt</div>
      </div>

      {!unlocked && (
        <div className="gateWrap" id="gate-section">
          <div className="gateCard">
            <div className="gateTitle">Prompt unlock karo — free hai</div>
            <div className="gateSub">Apna naam aur email daalo, prompt turant milega. <strong>No spam, promise.</strong></div>
            <ul className="teaserList">
              <li>Complete shopping website — products, cart, checkout</li>
              <li>Orders seedha tumhare email inbox mein</li>
              <li>Images free CDN (imgbb) pe hosted</li>
              <li>Zero payment gateway needed</li>
              <li>Copy-paste ready — ChatGPT mein daalo, website lo</li>
            </ul>
            <LeadForm formName="shopping_prompt_gate" source="shopping_prompt_page"
              btnTexts={{ ready: "🔓 Prompt Unlock Karo — Free", fields: "Sab fields fill karo", submitting: "⏳ Submitting..." }}
              onSuccess={() => { sessionStorage.setItem("shopping_prompt_unlocked", "true"); setUnlocked(true); trackEvent("shopping_prompt_unlocked"); }}
            />
            <p className="gatePrivacy">🔒 Your info safe hai. Kabhi bhi unsubscribe kar sakte ho.</p>
          </div>
        </div>
      )}

      {unlocked && (
        <div className="promptsContent">
          <div className="unlockBanner"><div className="unlockIcon">🎉</div><div className="unlockText"><strong>Prompt unlock ho gaya!</strong><span>Copy karo, ChatGPT mein paste karo, aur 10 minute mein tumhari shopping website taiyaar. Maine personally test kiya hai.</span></div></div>

          <div className="promptCategory">
            <div className="categoryHeader"><div className="categoryIcon">🛒</div><div className="categoryInfo"><div className="categoryEyebrow">The Existence Series — Part 4</div><div className="categoryTitle">Shopping Website Prompt</div></div></div>
            <div className="promptCard">
              <div className="promptLabel">🔥 The Full Prompt</div>
              <h4>Complete Shopping Website with Cart &amp; Email Orders</h4>
              <div className="promptText" id="main-prompt">{MAIN_PROMPT}</div>
              <button className={`copyBtn ${copied ? "copyBtnCopied" : ""}`} onClick={handleCopy}>{copied ? "✓ Copied!" : "Copy"}</button>
              <div className="promptTip">Brackets [ ] mein jo bhi likha hai — woh TUMHARE details se replace karo. Shop name, products, images, email, phone — sab apna daalo.</div>
            </div>
          </div>

          <div className="howToUse">
            <h3>Kaise use karna hai? 5 steps.</h3>
            {steps.map((s) => (
              <div key={s.num} className="stepItem"><div className="stepNum">{s.num}</div><div className="stepText">{s.text}</div></div>
            ))}
          </div>

          <div className="promptCard" style={{ marginTop: "2rem" }}>
            <div className="promptLabel">⚠️ Important</div>
            <h4>GitHub pe images kyu nahi daalni chahiye?</h4>
            <div className="promptTip" style={{ marginTop: 0 }}>
              GitHub code ke liye hai, storage ke liye nahi. Images daaloge toh repo size badh jaayega, git clone slow hoga, deploy slow hoga, aur GitHub ki bandwidth limit hit hogi. imgbb free hai, fast hai, aur CDN ki tarah kaam karta hai — images wahan host karo, link yahan use karo.
            </div>
          </div>

          <div className="bottomCta">
            <h3>Aur prompts chahiye? Sab free hai.</h3>
            <p>Resume, portfolio, landing page — 9 aur free prompts hain mere paas. Ya phir directly baat karo.</p>
            <div className="ctaButtons">
              <Link href="/prompts" className="btn-primary">Get 9 More Free Prompts →</Link>
              <a href="/#contact" className="btn-ghost">Book a Free Call →</a>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
