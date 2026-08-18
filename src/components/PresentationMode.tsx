'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Info,
  Tag
} from 'lucide-react';
import { LookbookProject, AssetItem } from '../types/lookbook';
import { DICTIONARIES } from '../i18n/dictionaries';

interface PresentationModeProps {
  project: LookbookProject;
  initialIndex?: number;
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  project,
  initialIndex = 0,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inspectedAsset, setInspectedAsset] = useState<AssetItem | null>(null);

  const dict = DICTIONARIES[project.locale || 'en'];
  const spreads = project.spreads;
  const currentSpread = spreads[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(spreads.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spreads.length, onClose]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spreads.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, spreads.length]);

  const getAsset = (assetId: string | null) => {
    if (!assetId) return null;
    return project.assets.find((a) => a.id === assetId) || null;
  };

  const bgStyle = {
    backgroundColor: currentSpread?.bgColor || '#FAF9F6',
    color: currentSpread?.textColor || (currentSpread?.bgColor === '#121212' ? '#F5F5F5' : '#171717')
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col justify-between select-none overflow-hidden animate-in fade-in duration-300">
      {/* Top Presentation Bar */}
      <div className="h-16 px-8 flex items-center justify-between border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-white">
            {dict.appName.substring(0, 2)}
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white">
              {project.title}
            </h1>
            <span className="text-[10px] font-mono text-neutral-400">
              {project.season} • {project.brand}
            </span>
          </div>
        </div>

        {/* Center Navigation Controls */}
        <div className="flex items-center gap-4 bg-neutral-900/90 border border-neutral-800 px-4 py-1.5 rounded-full shadow-lg">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="font-mono text-xs text-neutral-200">
            {currentIndex + 1} / {spreads.length}
          </span>

          <button
            onClick={() => setCurrentIndex((prev) => Math.min(spreads.length - 1, prev + 1))}
            disabled={currentIndex === spreads.length - 1}
            className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-3 w-[1px] bg-neutral-800" />

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Auto Play</span>
              </>
            )}
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Exit Preview</span>
        </button>
      </div>

      {/* Main Full-Bleed Lookbook Canvas */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden bg-neutral-950">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSpread.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-5xl aspect-[1.414/1] rounded-2xl shadow-2xl overflow-hidden p-10 flex flex-col justify-between relative border border-neutral-800"
            style={bgStyle}
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-current/15 pb-4">
              <div>
                <h2 className="font-serif text-3xl font-bold tracking-tight">
                  {currentSpread.title}
                </h2>
                <p className="font-sans text-xs uppercase tracking-widest opacity-60 mt-1">
                  {currentSpread.subtitle}
                </p>
              </div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-80">
                {currentSpread.lookNumber}
              </div>
            </div>

            {/* Layout Slot Render */}
            <div className="flex-1 my-6 grid grid-cols-12 gap-6 items-center">
              {currentSpread.layout === 'cover-spread' && (
                <>
                  <div className="col-span-5 flex flex-col justify-center gap-4">
                    <span className="text-xs font-mono opacity-60">
                      {currentSpread.lookNumber}
                    </span>
                    <h1 className="font-serif text-5xl font-black leading-tight">
                      {currentSpread.title}
                    </h1>
                    <p className="text-sm opacity-75 font-sans">
                      {currentSpread.subtitle}
                    </p>
                  </div>
                  <div className="col-span-7 h-full">
                    {renderPresSlot(currentSpread.slots[0])}
                  </div>
                </>
              )}

              {currentSpread.layout === 'single-hero' && (
                <div className="col-span-12 h-full max-w-xl mx-auto w-full">
                  {renderPresSlot(currentSpread.slots[0])}
                </div>
              )}

              {currentSpread.layout === 'editorial-duo' && (
                <>
                  <div className="col-span-6 h-full">
                    {renderPresSlot(currentSpread.slots[0])}
                  </div>
                  <div className="col-span-6 h-full">
                    {renderPresSlot(currentSpread.slots[1])}
                  </div>
                </>
              )}

              {currentSpread.layout === 'triptych-grid' && (
                <>
                  <div className="col-span-7 h-full">
                    {renderPresSlot(currentSpread.slots[0])}
                  </div>
                  <div className="col-span-5 h-full grid grid-rows-2 gap-4">
                    {renderPresSlot(currentSpread.slots[1])}
                    {renderPresSlot(currentSpread.slots[2])}
                  </div>
                </>
              )}

              {currentSpread.layout === 'catalogue-quad' && (
                <>
                  <div className="col-span-3 h-full">
                    {renderPresSlot(currentSpread.slots[0])}
                  </div>
                  <div className="col-span-3 h-full">
                    {renderPresSlot(currentSpread.slots[1])}
                  </div>
                  <div className="col-span-3 h-full">
                    {renderPresSlot(currentSpread.slots[2])}
                  </div>
                  <div className="col-span-3 h-full">
                    {renderPresSlot(currentSpread.slots[3])}
                  </div>
                </>
              )}

              {currentSpread.layout === 'quote-accent' && (
                <>
                  <div className="col-span-5 h-full">
                    {renderPresSlot(currentSpread.slots[0])}
                  </div>
                  <div className="col-span-7 flex flex-col justify-center pl-6 gap-4">
                    <p className="font-serif italic text-3xl leading-relaxed">
                      {currentSpread.quote ||
                        '"Design is the reduction of unnecessary form until pure intention remains."'}
                    </p>
                    <span className="font-mono text-xs opacity-60">
                      — {project.brand} DIRECTIVE
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-current/15 pt-3 text-[10px] font-mono opacity-50">
              <span>{project.brand}</span>
              <span>
                {dict.page} {currentIndex + 1} {dict.of} {spreads.length}
              </span>
              <span>{project.season}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="h-20 bg-neutral-950 border-t border-neutral-900 px-8 flex items-center justify-center gap-3 overflow-x-auto">
        {spreads.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentIndex(idx)}
            className={`h-12 aspect-[1.414/1] rounded-lg overflow-hidden border transition-all relative ${
              idx === currentIndex
                ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                : 'border-neutral-800 opacity-60 hover:opacity-100'
            }`}
            style={{ backgroundColor: s.bgColor || '#FAF9F6' }}
          >
            <div className="w-full h-full flex items-center justify-center font-mono text-[9px] font-bold text-neutral-950">
              {idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Asset Metadata Modal */}
      {inspectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-5 text-neutral-100 flex flex-col gap-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{inspectedAsset.title}</h3>
              <button
                onClick={() => setInspectedAsset(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950">
              <img
                src={inspectedAsset.imageUrl}
                alt={inspectedAsset.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs font-mono text-neutral-300 flex flex-col gap-1.5">
              <div><span className="text-neutral-500">Fabric:</span> {inspectedAsset.fabric || 'N/A'}</div>
              <div><span className="text-neutral-500">SKU:</span> {inspectedAsset.sku || 'N/A'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function renderPresSlot(slot?: { slotId: string; assetId: string | null; customCaption?: string }) {
    if (!slot) return null;
    const asset = getAsset(slot.assetId);

    return (
      <div
        onClick={() => asset && setInspectedAsset(asset)}
        className="relative w-full h-full rounded-xl overflow-hidden bg-neutral-950 cursor-pointer group"
      >
        {asset ? (
          <>
            <img
              src={asset.imageUrl}
              alt={asset.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
              <span className="text-white text-xs font-medium truncate">
                {slot.customCaption || asset.title}
              </span>
              {asset.fabric && (
                <span className="text-[10px] text-neutral-300 font-mono">
                  {asset.fabric}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-30 font-mono text-xs">
            Empty Frame
          </div>
        )}
      </div>
    );
  }
};
