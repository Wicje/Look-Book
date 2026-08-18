# ATELIER // Minimal Lookbook Builder

> **High-fashion, drag-and-drop web tool for assembling and sequencing seasonal lookbooks. No design work required—just composition, layout, and sequencing.**

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🌟 Overview

**ATELIER Lookbook Builder** is an editorial web application crafted for fashion houses, independent designers, boutique agencies, and e-commerce brands. It streamlines lookbook assembly by providing ready-to-use editorial layout templates, real-world e-commerce catalog integrations, interactive garment tagging, and automated page sequencing.

---

## ✨ Key Features

### 🎨 1. Editorial Layout Spreads
Choose from 6 precision-crafted editorial templates:
* **Cover Spread**: High-fashion cover page with collection title, season metadata, and hero image.
* **Single Hero Page**: Full-bleed portrait showcase with minimal serif typography.
* **Editorial Duo**: Two-column side-by-side comparison layout.
* **Triptych Showcase**: 1 large hero frame + 2 stacked detail thumbnail slots.
* **Catalogue Quad**: 4-frame matrix grid.
* **Manifesto & Quote Accent**: Single portrait frame paired with editorial quote & seasonal directive.

### 🌐 2. Real-World E-Commerce & Web APIs
* **Live Shopify Storefront Sync**: Connect any real Shopify store domain (e.g., `kith.com`, `allbirds.com`, `gymshark.com`, or any `.myshopify.com` store). Fetches live product photos, titles, SKUs, and categories via native API integration.
* **Live Unsplash Photography Search API**: Search and ingest real high-resolution editorial fashion photography directly from Unsplash in real time.
* **Real-Time Color Palette Extractor**: Uses HTML5 Canvas pixel sampling to calculate dominant HEX color palettes directly from any image.

### 🎯 3. Interactive Product Hotspots
* Tag garment SKUs directly on photos with interactive pin hotspots.
* Click any hotspot pin to reveal product detail overlays.

### 🤖 4. Smart Auto-Sequencing
* **Color Palette Harmony**: Sequence spreads smoothly from neutrals to darks and tonal accents based on dominant color hexes.
* **Garment Storyline Flow**: Automatically arranges sequence: Outerwear → Tailored Suiting → Knitwear → Footwear & Accessories.
* **Dynamic Editorial Rhythm**: Mixes layout templates automatically for visual engagement.

### 🌍 5. Internationalization & Localization (i18n)
* Built-in dictionary switcher supporting **English (`en`)**, **Français (`fr`)**, **Italiano (`it`)**, **日本語 (`ja`)**, and **Español (`es`)**.

### 👥 6. Studio Collaboration & Workspace Switcher
* Real-time collaborator presence indicators (*Paris Studio*, *Milan Atelier*, *Tokyo HQ*).
* Brand workspace manager (create new brand collections, switch active workspaces, clone templates).

### 🖨️ 7. 300 DPI Print Engine & PDF Export
* High-resolution PDF export using `html2canvas` & `jspdf` for physical print production or buyer presentations.

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Interactivity & Motion**: [Framer Motion](https://www.framer.com/motion/)
* **Drag and Drop**: [@dnd-kit/core](https://dndkit.com/) & `@dnd-kit/sortable`
* **Icons**: [Lucide React](https://lucide.dev/)
* **Export**: `html2canvas` & `jspdf`

---

## 🚀 Getting Started

### Prerequisites
* Node.js `>= 18.0.0`
* npm `>= 9.0.0`

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:Wicje/Look-Book.git
   cd Look-Book
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📁 Directory Structure

```text
Look-Book/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── assets/       # Live Unsplash Photography Search API
│   │   │   └── shopify/      # Live Shopify Storefront Ingestion API
│   │   ├── globals.css       # Tailwind CSS v4 styling rules
│   │   ├── layout.tsx        # Root layout with editorial typography
│   │   └── page.tsx          # Main application page
│   ├── components/
│   │   ├── Navbar.tsx             # Navigation header & locale switcher
│   │   ├── AssetLibrary.tsx       # Look asset drawer with drag-and-drop
│   │   ├── CanvasSpread.tsx       # Interactive composition sheet
│   │   ├── Inspector.tsx          # Frame slot & spread inspector
│   │   ├── SequencerGrid.tsx      # Page matrix sequencer
│   │   ├── PresentationMode.tsx   # Interactive fullscreen flipbook
│   │   ├── CommerceSyncModal.tsx  # Shopify live catalog sync modal
│   │   ├── AutoSequenceModal.tsx  # Smart auto-sequence modal
│   │   ├── ExportModal.tsx        # PDF & project JSON exporter
│   │   └── CollaborationBar.tsx   # Studio presence switcher
│   ├── i18n/
│   │   └── dictionaries.ts   # i18n translation dictionaries
│   ├── types/
│   │   └── lookbook.ts       # TypeScript interfaces & types
│   └── utils/
│       ├── colorExtractor.ts # Canvas pixel color palette sampler
│       └── pdfExport.ts      # High-res PDF renderer
├── public/
│   └── images/               # High-res editorial asset photography
├── package.json
└── README.md
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ for high fashion, minimal design, and digital publishing.
