'use client';

import React, { useState } from 'react';
import { Sparkles, Palette, Layers, X, Wand2, ArrowRight } from 'lucide-react';
import { LookbookProject, SpreadPage, AssetItem } from '../types/lookbook';
import confetti from 'canvas-confetti';

interface AutoSequenceModalProps {
  project: LookbookProject;
  onApplySequence: (newSpreads: SpreadPage[]) => void;
  onClose: () => void;
}

export const AutoSequenceModal: React.FC<AutoSequenceModalProps> = ({
  project,
  onApplySequence,
  onClose
}) => {
  const [strategy, setStrategy] = useState<'color' | 'category' | 'rhythm'>('color');

  const handleRunAutoSequence = () => {
    const assets = [...project.assets];
    let sortedAssets: AssetItem[] = [];

    if (strategy === 'color') {
      // Sort by dominant color lightness or hue approximation
      sortedAssets = assets.sort((a, b) => {
        const hexA = a.colorPalette[0] || '#FFFFFF';
        const hexB = b.colorPalette[0] || '#FFFFFF';
        return hexA.localeCompare(hexB);
      });
    } else if (strategy === 'category') {
      // Order: Cover -> Outerwear -> Tailoring -> Knitwear -> Footwear -> Accessories
      const order = ['Outerwear', 'Tailoring', 'Knitwear', 'Footwear', 'Accessories', 'Custom'];
      sortedAssets = assets.sort((a, b) => {
        return order.indexOf(a.category) - order.indexOf(b.category);
      });
    } else {
      // Rhythm strategy: mix up categories
      sortedAssets = assets.sort(() => Math.random() - 0.5);
    }

    // Build automated editorial spreads
    const newSpreads: SpreadPage[] = [];

    // Spread 1: Cover Spread
    if (sortedAssets.length > 0) {
      newSpreads.push({
        id: `auto-cover-${Date.now()}`,
        pageNumber: 1,
        layout: 'cover-spread',
        title: project.title,
        subtitle: `Curated Sequence — ${strategy.toUpperCase()} FLOW`,
        lookNumber: 'COVER',
        bgColor: '#FAF9F6',
        textColor: '#171717',
        slots: [{ slotId: 'cover-1', assetId: sortedAssets[0].id }]
      });
    }

    // Process remaining assets into varied editorial layouts
    let index = 1;
    let pageNum = 2;
    const layouts: ('editorial-duo' | 'triptych-grid' | 'single-hero' | 'catalogue-quad' | 'quote-accent')[] = [
      'editorial-duo',
      'triptych-grid',
      'single-hero',
      'catalogue-quad',
      'quote-accent'
    ];

    while (index < sortedAssets.length) {
      const layoutType = layouts[(pageNum - 2) % layouts.length];
      const slotCount =
        layoutType === 'single-hero' || layoutType === 'quote-accent'
          ? 1
          : layoutType === 'editorial-duo'
          ? 2
          : layoutType === 'triptych-grid'
          ? 3
          : 4;

      const chunk = sortedAssets.slice(index, index + slotCount);
      index += slotCount;

      newSpreads.push({
        id: `auto-spread-${pageNum}-${Date.now()}`,
        pageNumber: pageNum,
        layout: layoutType,
        title: `LOOK SEQUENCE ${String(pageNum - 1).padStart(2, '0')}`,
        subtitle: `Editorial Arrangement in ${chunk[0]?.category || 'Silhouettes'}`,
        lookNumber: `LOOK ${String(pageNum - 1).padStart(2, '0')}`,
        quote:
          layoutType === 'quote-accent'
            ? '"The harmony of form emerges when sequence honors proportion."'
            : undefined,
        bgColor: pageNum % 2 === 0 ? '#FAF9F6' : '#F5F3EF',
        textColor: '#171717',
        slots: chunk.map((asset, sIdx) => ({
          slotId: `auto-slot-${pageNum}-${sIdx}`,
          assetId: asset.id,
          customCaption: asset.title
        }))
      });

      pageNum++;
    }

    onApplySequence(newSpreads);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-neutral-100 flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Smart Auto-Sequencing</h3>
              <p className="text-xs text-neutral-400">
                Compose lookbook pages automatically without manual layout design.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Strategy Selector */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono uppercase text-neutral-400">
            Select Composition Strategy
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            <button
              onClick={() => setStrategy('color')}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                strategy === 'color'
                  ? 'border-amber-400 bg-neutral-800/80 text-white ring-1 ring-amber-400/40'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <Palette className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold">Color Palette Harmony</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Sequences looks based on dominant color hex tones (Neutrals → Darks → Tonal Accents) for smooth visual transition.
                </div>
              </div>
            </button>

            <button
              onClick={() => setStrategy('category')}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                strategy === 'category'
                  ? 'border-amber-400 bg-neutral-800/80 text-white ring-1 ring-amber-400/40'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <Layers className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold">Garment Storyline Flow</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Arranges sequence naturally: Hero Outerwear → Tailored Suiting → Knitwear → Footwear & Accessories.
                </div>
              </div>
            </button>

            <button
              onClick={() => setStrategy('rhythm')}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                strategy === 'rhythm'
                  ? 'border-amber-400 bg-neutral-800/80 text-white ring-1 ring-amber-400/40'
                  : 'border-neutral-800 bg-neutral-900/50 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold">Dynamic Editorial Rhythm</div>
                <div className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                  Mixes layout density (Single Hero, Editorial Duo, Triptych, Quad) to maximize visual pacing and engagement.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleRunAutoSequence}
            className="px-5 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow"
          >
            <span>Generate Auto-Sequence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
