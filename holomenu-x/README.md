# HoloMenu X 🍽️

**Photorealistic Interactive Dining Experience**

A next-generation luxury restaurant menu platform built with React + Three.js. Customers scan a QR code and enter a cinematic, fully interactive 3D dining experience.

## ✨ Features

- 🎨 **Painted Food Art** — Every dish hand-painted with Canvas2D (bezier curves, gradients, specular highlights)
- 🔄 **360° 3D Viewer** — Drag to rotate, scroll to zoom, touch support
- 💡 **Michelin Lighting Rig** — 6-point PBR lighting: tungsten key, cool fill, rim, bounce, hero spot
- 🫧 **Live Steam Particles** — 45-particle system with curl noise and lifecycle fade
- ✨ **Gold Sparkles** — For desserts and premium items
- 🏺 **Porcelain Plate** — LatheGeometry with 15-point precision profile
- 🪵 **Walnut Table** — Procedural wood grain via fractal brownian motion
- 🍴 **Cutlery** — Chrome knife + fork with environment reflections
- 🛒 **Full Cart System** — Add, update quantity, remove, place order
- 📊 **Macro Nutrition** — Per-dish calories, protein, carbs, fat
- 🎬 **Cinematic UI** — ACES filmic tonemapping, grain overlay, DoF vignette

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## 📦 Build & Deploy

```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages
```bash
npm run build
# Upload the dist/ folder to GitHub Pages
```

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Three.js 0.163** — 3D engine (WebGL)
- **Vite 5** — Build tool
- **Canvas2D API** — Procedural food art
- **CSS Custom Properties** — Design tokens

## 📁 Structure

```
holomenu-x/
├── src/
│   ├── App.jsx        # Complete application (3D engine + UI)
│   ├── main.jsx       # React entry point
│   └── index.css      # CSS reset
├── public/
│   └── favicon.svg
├── index.html
├── package.json
└── vite.config.js
```

## 🎨 Design Language

- **Typography**: Playfair Display (display) + Jost (body) + DM Mono (labels)
- **Colors**: Near-black `#080806` · Gold `#B8963E` · Cream `#F2EDDE`
- **Aesthetic**: Michelin-star restaurant × Apple product launch

---

Built with HoloMenu X Platform · Arkaadia Fine Dining
