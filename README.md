# ◈ Folio — Portfolio Builder

A no-code portfolio generator SaaS. Pick a template, fill your details, set a domain, and deploy to Vercel in one click. 100% client-side, zero build step.

## 🚀 Features

### Landing Page
- Animated hero with floating browser mockup
- 6 live template previews (Midnight, Editorial, Terminal, Glass, Brutalist, Magazine)
- Feature grid, pricing table (Free / Pro / Teams), footer

### Builder Flow (4 Steps)
1. **Template** — Pick from 6 curated templates with live card previews
2. **Details** — Name, role, bio, links, skills chips, up to 3 projects with live preview panel
3. **Domain** — Free `folio.dev/subdomain` with availability checker, or custom domain with DNS instructions
4. **Deploy** — Animated deploy log, progress bar, confetti success screen with stats

### Dashboard
- Lists all deployed portfolios from localStorage
- Visit / Edit actions per portfolio

## 📁 File Structure

```
portfolio-builder/
├── index.html   ← Full app (landing + builder + dashboard)
├── style.css    ← Design system (light editorial theme)
├── script.js    ← All logic, state, animations
└── README.md
```

## 🛠️ Tech Stack

| Layer        | Tech                                    |
|--------------|-----------------------------------------|
| UI           | HTML5 + CSS3 (custom properties, grid)  |
| Logic        | Vanilla JS (ES6+)                       |
| Fonts        | Cabinet Grotesk + Instrument Serif + Fira Code |
| Storage      | localStorage (portfolios persist)       |
| Charts       | Pure CSS / inline SVG                   |


