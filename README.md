# Portfolio Website - Ekkachai Kiwsanthia

Minimal tech portfolio built with Astro.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Metrics.astro
│   │   ├── Projects.astro
│   │   ├── TechStack.astro
│   │   ├── WorkExperience.astro
│   │   └── Contact.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── projects/
│   │       ├── mc-group.md
│   │       ├── aig-thailand.md
│   │       ├── ayodia.md
│   │       ├── ayudhya-capital.md
│   │       ├── pnl.md
│   │       └── shuttrsnap.md
│   ├── data/
│   │   ├── metrics.json
│   │   └── skills.json
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── env.d.ts
├── .gitignore
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Design

- **Style**: Minimal Tech (Option A)
- **Colors**: Black/White + Blue accent
- **Typography**: System fonts
- **Layout**: Single-page with sections

## 📝 Content Management

### Add New Project

Create a new `.md` file in `src/content/projects/`:

```markdown
---
title: "Project Name"
company: "Company Name"
period: "2020 - 2021"
challenge: "Problem description"
solution: "Solution description"
tech: ["Tech1", "Tech2"]
results: ["Result 1", "Result 2"]
order: 3
---

Detailed project description...
```

### Update Metrics

Edit `src/data/metrics.json`

### Update Skills

Edit `src/data/skills.json`

## 🚢 Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder
```

### DigitalOcean App Platform
1. Connect GitHub repo
2. Build command: `npm run build`
3. Output directory: `dist`

## 📄 License

MIT
