# oyenino.com — Next.js

Portfolio & consulting website for Himanshu. Converted from static HTML/JS to modular Next.js.

## Architecture

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.jsx                # Root layout (GA, fonts, metadata, JSON-LD)
│   ├── page.jsx                  # Homepage
│   ├── prompts/                  # Free prompts (gated)
│   ├── shopping-prompt/          # Shopping prompt (gated)
│   ├── manage-prompt/            # Manage products prompt (gated)
│   ├── insta-bot-prompt/         # Instagram bot prompt (gated)
│   └── existence/                # Design demo series
│       ├── business-nature/
│       ├── color-psychology/
│       ├── typography/
│       ├── noir-studio/
│       └── little-creators/
│
├── components/
│   ├── forms/                    # ★ REUSABLE FORMS (used on EVERY page)
│   │   ├── OyeNinoForm.jsx      # Universal form component with validation
│   │   └── FormFields.jsx        # Input, Textarea, Select, FieldStatus, FormRow
│   ├── layout/                   # Shared layout components
│   │   ├── Navbar.jsx            # Main navigation (with dropdown + mobile)
│   │   ├── SimpleNav.jsx         # Simple nav for sub-pages
│   │   └── Footer.jsx            # Site footer
│   ├── sections/                 # Homepage sections
│   │   ├── Hero.jsx              # Hero with terminal animation
│   │   ├── PromptsBanners.jsx    # Banner cards for resources
│   │   └── HomeSections.jsx      # ProofBar, Value, Services, Process, Stack, Testimonial, CTA, Contact
│   └── ui/                       # UI primitives
│       ├── CursorGlow.jsx        # Mouse-following glow effect
│       └── GridOverlay.jsx       # Intro grid reveal animation
│
├── lib/                          # ★ CENTRALIZED UTILITIES
│   ├── api.js                    # ALL API calls (form submit, MX check, location)
│   ├── analytics.js              # GA4 tracking (events, scroll, time)
│   ├── validation.js             # Email & phone validation, device info
│   ├── hooks.js                  # useRevealOnScroll, useSectionTracking
│   └── utils.js                  # Clipboard, helpers
│
├── styles/
│   └── globals.css               # CSS variables, base styles, shared classes
│
└── data/                         # Static data (if needed)
```

## Key Decisions

### APIs in one place (`src/lib/api.js`)
All external API calls (form submission, MX check, geolocation) are in one file. Change the backend URL once, it updates everywhere.

### Forms in one place (`src/components/forms/`)
`OyeNinoForm` is a universal form component that handles:
- Email validation (format + disposable + typo + MX check)
- Phone validation (Indian format)
- Cloudflare Turnstile integration
- Smart button states
- Device & location fingerprinting
- Form submission via centralized API

Used on: homepage contact, prompts gate, shopping gate, manage gate, insta-bot gate.

### Animations preserved
- Grid overlay intro → `GridOverlay` component
- Cursor glow → `CursorGlow` component
- Scroll reveal → `useRevealOnScroll` hook
- Terminal typing → `Hero` component with delay-based reveal
- Service card mouse tracking → preserved in `ServicesSection`
- All CSS animations (breathe, fadeUp, pulse, blink) → `globals.css`

### SEO
- Next.js Metadata API for all pages (title, description, OG, Twitter)
- JSON-LD structured data in root layout
- Canonical URLs on every page
- Server-rendered HTML for crawlers
- Robots.txt and sitemap.xml in `/public`

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # production build
```

## Deployment

Push to GitHub → Vercel auto-deploys. No config needed.
