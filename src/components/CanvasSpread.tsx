'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layout,
  Palette,
  Tag,
  ShoppingBag
} from 'lucide-react';
import { AssetItem, SpreadPage, SpreadLayoutType, SupportedLocale, Hotspot } from '../types/lookbook';
import { DICTIONARIES } from '../i18n/dictionaries';

interface CanvasSpreadProps {
  spread: SpreadPage;
  spreadIndex: number;
  totalSpreads: number;
  assets: AssetItem[];
  selectedSlotId: string | null;
  locale?: SupportedLocale;
  onSelectSlot: (slotId: string | null) => void;
  onUpdateSpread: (updated: SpreadPage) => void;
  onSelectSpreadIndex: (idx: number) => void;
  onAddSpread: () => void;
  onDuplicateSpread: () => void;
  onDeleteSpread: () => void;
  onDropAssetToSlot: (slotId: string, assetId: string) => void;
}

export const CanvasSpread: React.FC<CanvasSpreadProps> = ({
  spread,
  spreadIndex,
  totalSpreads,
  assets,
  selectedSlotId,
  locale = 'en',
  onSelectSlot,
  onUpdateSpread,
  onSelectSpreadIndex,
  onAddSpread,
  onDuplicateSpread,
  onDeleteSpread,
  onDropAssetToSlot
}) => {
  const [dragOverSlotId, setDragOverSlotId] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const dict = DICTIONARIES[locale || 'en'];

  const getAsset = (assetId: string | null) => {
    if (!assetId) return null;
    return assets.find((a) => a.id === assetId) || null;
  };

  const handleTextChange = (field: keyof SpreadPage, value: string) => {
    onUpdateSpread({
      ...spread,
      [field]: value
    });
  };

  const handleSlotCaptionChange = (slotId: string, caption: string) => {
    const updatedSlots = spread.slots.map((s) =>
      s.slotId === slotId ? { ...s, customCaption: caption } : s
    );
    onUpdateSpread({ ...spread, slots: updatedSlots });
  };

  const handleDragOver = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlotId(slotId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSlotId(null);
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    setDragOverSlotId(null);
    const assetId = e.dataTransfer.getData('text/plain');
    if (assetId) {
      onDropAssetToSlot(slotId, assetId);
    }
  };

  // Collect dominant colors from assets placed on this spread
  const spreadSwatches = Array.from(
    new Set(
      spread.slots
        .map((s) => getAsset(s.assetId))
        .filter((a): a is AssetItem => a !== null)
        .flatMap((a) => a.colorPalette)
    )
  ).slice(0, 6);

  const bgStyle = {
    backgroundColor: spread.bgColor || '#FAF9F6',
    color: spread.textColor || (spread.bgColor === '#121212' ? '#F5F5F5' : '#171717')
  };

  return (
    <main className="flex-1 bg-neutral-900 flex flex-col items-center justify-between p-6 overflow-y-auto select-none relative">
      {/* Top Floating Spread Toolbar */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-neutral-950/90 border border-neutral-800 rounded-2xl px-4 py-2 text-neutral-300 shadow-xl backdrop-blur-md z-20 mb-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectSpreadIndex(Math.max(0, spreadIndex - 1))}
            disabled={spreadIndex === 0}
            className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 disabled:opacity-30 disabled:hover:border-neutral-800 transition-colors"
            title="Previous Spread"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs text-neutral-300 px-2 font-semibold">
            {dict.page} {spreadIndex + 1} {dict.of} {totalSpreads}
          </span>

          <button
            onClick={() => onSelectSpreadIndex(Math.min(totalSpreads - 1, spreadIndex + 1))}
            disabled={spreadIndex === totalSpreads - 1}
            className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 disabled:opacity-30 disabled:hover:border-neutral-800 transition-colors"
            title="Next Spread"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Layout Switcher Selector */}
        <div className="flex items-center gap-2">
          <Layout className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={spread.layout}
            onChange={(e) => {
              const newLayout = e.target.value as SpreadLayoutType;
              let slots = spread.slots;
              if (newLayout === 'single-hero' || newLayout === 'cover-spread' || newLayout === 'quote-accent') {
                slots = [slots[0] || { slotId: 'slot-1', assetId: null }];
              } else if (newLayout === 'editorial-duo') {
                slots = [
                  slots[0] || { slotId: 'duo-1', assetId: null },
                  slots[1] || { slotId: 'duo-2', assetId: null }
                ];
              } else if (newLayout === 'triptych-grid') {
                slots = [
                  slots[0] || { slotId: 'trip-1', assetId: null },
                  slots[1] || { slotId: 'trip-2', assetId: null },
                  slots[2] || { slotId: 'trip-3', assetId: null }
                ];
              } else if (newLayout === 'catalogue-quad') {
                slots = [
                  slots[0] || { slotId: 'quad-1', assetId: null },
                  slots[1] || { slotId: 'quad-2', assetId: null },
                  slots[2] || { slotId: 'quad-3', assetId: null },
                  slots[3] || { slotId: 'quad-4', assetId: null }
                ];
              }
              onUpdateSpread({ ...spread, layout: newLayout, slots });
            }}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-neutral-600 font-medium"
          >
            <option value="cover-spread">Cover Spread</option>
            <option value="single-hero">Single Hero Page</option>
            <option value="editorial-duo">Editorial Duo (2 Looks)</option>
            <option value="triptych-grid">Triptych Showcase (3 Looks)</option>
            <option value="catalogue-quad">Catalogue Quad (4 Grid)</option>
            <option value="quote-accent">Manifesto & Quote Accent</option>
          </select>
        </div>

        {/* Color Palette Quick Preset */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-neutral-400" />
          {[
            { bg: '#FAF9F6', text: '#171717', name: 'Studio Off-White' },
            { bg: '#F5F3EF', text: '#1C1917', name: 'Warm Stone' },
            { bg: '#121212', text: '#F5F5F5', name: 'Noir Dark' },
            { bg: '#EAE8E3', text: '#262626', name: 'Archival Grey' }
          ].map((colorOpt, i) => (
            <button
              key={i}
              onClick={() =>
                onUpdateSpread({ ...spread, bgColor: colorOpt.bg, textColor: colorOpt.text })
              }
              className={`w-4 h-4 rounded-full border transition-transform ${
                spread.bgColor === colorOpt.bg ? 'scale-125 border-amber-400' : 'border-neutral-700 hover:scale-110'
              }`}
              style={{ backgroundColor: colorOpt.bg }}
              title={colorOpt.name}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onDuplicateSpread}
            className="p-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors"
            title="Duplicate Spread"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onAddSpread}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-medium transition-colors"
            title="Add New Spread"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Spread</span>
          </button>
          <button
            onClick={onDeleteSpread}
            disabled={totalSpreads <= 1}
            className="p-1.5 rounded-lg border border-neutral-800 hover:border-rose-800 text-neutral-400 hover:text-rose-400 disabled:opacity-30 transition-colors"
            title="Delete Spread"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Interactive Spread Canvas Sheet */}
      <div
        id="lookbook-active-spread"
        className="lookbook-spread-page w-full max-w-4xl aspect-[1.414/1] rounded-2xl shadow-2xl overflow-hidden border border-neutral-800/80 transition-colors duration-300 flex flex-col justify-between p-8 relative"
        style={bgStyle}
      >
        {/* Editorial Header */}
        <div className="flex items-start justify-between border-b border-current/15 pb-4">
          <div className="flex flex-col gap-0.5 max-w-lg">
            <input
              type="text"
              value={spread.title}
              onChange={(e) => handleTextChange('title', e.target.value)}
              className="bg-transparent font-serif text-2xl font-bold tracking-tight focus:outline-none focus:bg-current/5 px-1 py-0.5 rounded transition-colors placeholder:text-current/40"
              placeholder="SPREAD TITLE"
            />
            <input
              type="text"
              value={spread.subtitle}
              onChange={(e) => handleTextChange('subtitle', e.target.value)}
              className="bg-transparent font-sans text-xs uppercase tracking-widest opacity-60 focus:outline-none focus:bg-current/5 px-1 py-0.5 rounded transition-colors placeholder:text-current/30"
              placeholder="SUBTITLE / COLLECTION DESCRIPTION"
            />
          </div>

          <div className="flex flex-col items-end gap-1">
            <input
              type="text"
              value={spread.lookNumber}
              onChange={(e) => handleTextChange('lookNumber', e.target.value)}
              className="bg-transparent font-mono text-xs font-bold uppercase tracking-widest text-right opacity-80 focus:outline-none focus:bg-current/5 px-1 py-0.5 rounded"
              placeholder="LOOK 01"
            />
            {spreadSwatches.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {spreadSwatches.map((hex, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full border border-black/20"
                    style={{ backgroundColor: hex }}
                    title={`Extracted Palette: ${hex}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Layout Frames */}
        <div className="flex-1 my-6 relative flex items-center justify-center">
          {spread.layout === 'cover-spread' && (
            <div className="w-full h-full grid grid-cols-12 gap-6 items-center">
              <div className="col-span-5 flex flex-col justify-center gap-4 pr-4">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                  {spread.lookNumber}
                </div>
                <h1 className="font-serif text-4xl font-extrabold tracking-tight leading-tight">
                  {spread.title}
                </h1>
                <p className="text-xs leading-relaxed opacity-75 font-sans">
                  {spread.subtitle}
                </p>
                <div className="pt-4 border-t border-current/15 flex items-center gap-3 text-[10px] font-mono opacity-50">
                  <span>ATELIER EDITORIAL</span>
                  <span>•</span>
                  <span>AUTUMN / WINTER</span>
                </div>
              </div>

              <div className="col-span-7 h-full">
                {renderSlot(spread.slots[0] || { slotId: 'cover-hero', assetId: null })}
              </div>
            </div>
          )}

          {spread.layout === 'single-hero' && (
            <div className="w-full h-full max-w-xl mx-auto">
              {renderSlot(spread.slots[0] || { slotId: 'single-hero-slot', assetId: null })}
            </div>
          )}

          {spread.layout === 'editorial-duo' && (
            <div className="w-full h-full grid grid-cols-2 gap-6">
              {renderSlot(spread.slots[0] || { slotId: 'duo-1', assetId: null })}
              {renderSlot(spread.slots[1] || { slotId: 'duo-2', assetId: null })}
            </div>
          )}

          {spread.layout === 'triptych-grid' && (
            <div className="w-full h-full grid grid-cols-12 gap-6">
              <div className="col-span-7 h-full">
                {renderSlot(spread.slots[0] || { slotId: 'trip-1', assetId: null })}
              </div>
              <div className="col-span-5 h-full grid grid-rows-2 gap-4">
                {renderSlot(spread.slots[1] || { slotId: 'trip-2', assetId: null })}
                {renderSlot(spread.slots[2] || { slotId: 'trip-3', assetId: null })}
              </div>
            </div>
          )}

          {spread.layout === 'catalogue-quad' && (
            <div className="w-full h-full grid grid-cols-4 gap-4">
              {renderSlot(spread.slots[0] || { slotId: 'quad-1', assetId: null })}
              {renderSlot(spread.slots[1] || { slotId: 'quad-2', assetId: null })}
              {renderSlot(spread.slots[2] || { slotId: 'quad-3', assetId: null })}
              {renderSlot(spread.slots[3] || { slotId: 'quad-4', assetId: null })}
            </div>
          )}

          {spread.layout === 'quote-accent' && (
            <div className="w-full h-full grid grid-cols-12 gap-8 items-center">
              <div className="col-span-5 h-full">
                {renderSlot(spread.slots[0] || { slotId: 'quote-slot', assetId: null })}
              </div>
              <div className="col-span-7 flex flex-col gap-6 pl-4 justify-center">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-50">
                  SEASONAL MANIFESTO
                </div>
                <textarea
                  value={spread.quote || ''}
                  onChange={(e) => handleTextChange('quote', e.target.value)}
                  className="bg-transparent font-serif italic text-2xl leading-relaxed focus:outline-none focus:bg-current/5 p-2 rounded transition-colors resize-none border border-dashed border-current/20"
                  rows={4}
                  placeholder="Enter editorial quote or seasonal text..."
                />
                <div className="text-xs font-mono opacity-60">
                  — ATELIER EDITORIAL DIRECTIVE
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-current/15 pt-3 text-[10px] font-mono opacity-50">
          <span>{dict.page} {spreadIndex + 1} {dict.of} {totalSpreads}</span>
          <span>LOOKBOOK COMPOSITION ENGINE</span>
          <span>AUTUMN / WINTER 2026</span>
        </div>
      </div>

      {/* Helper Footer Hint */}
      <div className="mt-4 text-xs font-mono text-neutral-400 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{dict.dragDropHint}</span>
      </div>

      {/* Hotspot Modal Popover */}
      {activeHotspot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xs w-full p-4 text-neutral-100 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>Product Hotspot Tag</span>
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="text-xs font-medium text-white">{activeHotspot.title}</div>
            {activeHotspot.sku && (
              <div className="text-[10px] font-mono text-neutral-400 bg-neutral-950 p-2 rounded">
                SKU: {activeHotspot.sku}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );

  function renderSlot(slot: { slotId: string; assetId: string | null; customCaption?: string; hotspots?: Hotspot[] }) {
    const asset = getAsset(slot.assetId);
    const isSelected = selectedSlotId === slot.slotId;
    const isDragOver = dragOverSlotId === slot.slotId;

    return (
      <div
        key={slot.slotId}
        onClick={() => onSelectSlot(slot.slotId)}
        onDragOver={(e) => handleDragOver(e, slot.slotId)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, slot.slotId)}
        className={`relative w-full h-full rounded-xl overflow-hidden group transition-all duration-200 flex flex-col justify-end p-3 cursor-pointer ${
          asset ? 'bg-neutral-950' : 'bg-current/5 border-2 border-dashed border-current/30 hover:border-current/60'
        } ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black' : ''} ${
          isDragOver ? 'bg-amber-500/20 border-amber-400 scale-[1.01]' : ''
        }`}
      >
        {asset ? (
          <>
            <img
              src={asset.imageUrl}
              alt={asset.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Interactive Hotspots Pins */}
            {slot.hotspots?.map((hp) => (
              <button
                key={hp.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveHotspot(hp);
                }}
                className="absolute w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-emerald-400/90 text-black border border-white shadow-lg flex items-center justify-center text-[10px] font-bold animate-pulse hover:scale-125 transition-transform z-10"
                style={{ left: `${hp.x}%`, top: `${hp.y}%` }}
                title={hp.title}
              >
                +
              </button>
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-between items-center text-white">
                <span className="text-[10px] font-mono bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                  {asset.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDropAssetToSlot(slot.slotId, '');
                  }}
                  className="p-1 rounded bg-rose-950/80 text-rose-300 hover:bg-rose-900 transition-colors"
                  title="Remove look"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Editable Slot Caption */}
              <input
                type="text"
                value={slot.customCaption ?? asset.title}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSlotCaptionChange(slot.slotId, e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded border border-white/20 focus:outline-none focus:border-white font-medium"
                placeholder="Custom Caption..."
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-current/40 group-hover:text-current/70">
            <Plus className="w-6 h-6 stroke-[1.5]" />
            <span className="text-xs font-mono uppercase tracking-wider font-semibold">
              Drop Look Here
            </span>
          </div>
        )}
      </div>
    );
  }
};
