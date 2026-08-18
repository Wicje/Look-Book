'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  Layout,
  Type,
  Trash2,
  Tag,
  Plus
} from 'lucide-react';
import { SpreadPage, AssetItem, SpreadLayoutType, SupportedLocale } from '../types/lookbook';
import { DICTIONARIES } from '../i18n/dictionaries';

interface InspectorProps {
  spread: SpreadPage;
  selectedSlotId: string | null;
  assets: AssetItem[];
  locale?: SupportedLocale;
  onUpdateSpread: (updated: SpreadPage) => void;
  onSelectSlot: (slotId: string | null) => void;
  onAssignAssetToSlot: (slotId: string, assetId: string) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  spread,
  selectedSlotId,
  assets,
  locale = 'en',
  onUpdateSpread,
  onSelectSlot,
  onAssignAssetToSlot
}) => {
  const [newHotspotTitle, setNewHotspotTitle] = useState('');

  const dict = DICTIONARIES[locale || 'en'];
  const getAsset = (id: string | null) => (id ? assets.find((a) => a.id === id) || null : null);

  const selectedSlot = selectedSlotId
    ? spread.slots.find((s) => s.slotId === selectedSlotId) || null
    : null;

  const activeAsset = selectedSlot ? getAsset(selectedSlot.assetId) : null;

  const handleFieldChange = (field: keyof SpreadPage, val: any) => {
    onUpdateSpread({ ...spread, [field]: val });
  };

  const handleSlotChange = (slotId: string, updates: Partial<typeof spread.slots[0]>) => {
    const updated = spread.slots.map((s) => (s.slotId === slotId ? { ...s, ...updates } : s));
    onUpdateSpread({ ...spread, slots: updated });
  };

  const handleAddHotspotToSlot = () => {
    if (!selectedSlot || !newHotspotTitle) return;
    const existing = selectedSlot.hotspots || [];
    const newHotspot = {
      id: `hp-${Date.now()}`,
      x: 50,
      y: 50,
      title: newHotspotTitle,
      sku: activeAsset?.sku || 'SKU-ITEM'
    };

    handleSlotChange(selectedSlot.slotId, {
      hotspots: [...existing, newHotspot]
    });
    setNewHotspotTitle('');
  };

  const colorPresets = [
    { bg: '#FAF9F6', text: '#171717', label: 'Studio Off-White' },
    { bg: '#F5F3EF', text: '#1C1917', label: 'Warm Stone' },
    { bg: '#121212', text: '#F5F5F5', label: 'Noir Dark' },
    { bg: '#0F172A', text: '#F8FAFC', label: 'Midnight Navy' },
    { bg: '#EAE8E3', text: '#262626', label: 'Archival Canvas' }
  ];

  return (
    <aside className="w-80 border-l border-neutral-800 bg-neutral-950 text-neutral-200 flex flex-col h-full shrink-0 select-none overflow-y-auto">
      {/* Inspector Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-neutral-400" />
          <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
            {dict.inspector}
          </h2>
        </div>
        <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400">
          {dict.page} #{spread.pageNumber}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Slot Specific Controls */}
        {selectedSlot ? (
          <div className="flex flex-col gap-4 border border-amber-900/40 bg-amber-950/20 rounded-xl p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-300">
              <span className="font-mono">Selected Frame: #{selectedSlot.slotId}</span>
              <button
                onClick={() => onSelectSlot(null)}
                className="text-[10px] font-mono text-neutral-400 hover:text-white"
              >
                Deselect
              </button>
            </div>

            {activeAsset ? (
              <div className="flex flex-col gap-3">
                <div className="aspect-[3/4] rounded-lg overflow-hidden border border-neutral-800 relative bg-neutral-900">
                  <img
                    src={activeAsset.imageUrl}
                    alt={activeAsset.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300">
                    {activeAsset.category}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-neutral-400">Custom Frame Caption</label>
                  <input
                    type="text"
                    value={selectedSlot.customCaption ?? activeAsset.title}
                    onChange={(e) =>
                      handleSlotChange(selectedSlot.slotId, { customCaption: e.target.value })
                    }
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>

                {activeAsset.fabric && (
                  <div className="text-[11px] text-neutral-400 bg-neutral-900/60 p-2 rounded border border-neutral-800 font-mono">
                    <span className="text-neutral-500">Fabric:</span> {activeAsset.fabric}
                  </div>
                )}

                {/* Add Hotspot Pin */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-amber-900/40">
                  <label className="text-[10px] font-mono text-amber-300 uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>{dict.addHotspot}</span>
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Tag details..."
                      value={newHotspotTitle}
                      onChange={(e) => setNewHotspotTitle(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white"
                    />
                    <button
                      onClick={handleAddHotspotToSlot}
                      className="px-2.5 py-1 bg-amber-400 text-black font-semibold text-xs rounded-lg hover:bg-amber-300"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onAssignAssetToSlot(selectedSlot.slotId, '')}
                  className="w-full py-1.5 bg-rose-950/60 border border-rose-900/60 text-rose-300 hover:bg-rose-900 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 mt-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Look from Frame</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 flex flex-col gap-2">
                <p>No look assigned to this frame.</p>
                <p className="text-[11px] text-amber-300 font-mono">
                  Select a look from the left library drawer to assign it to this slot.
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Spread Layout Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5" />
            <span>{dict.templateLayout}</span>
          </label>
          <select
            value={spread.layout}
            onChange={(e) => handleFieldChange('layout', e.target.value as SpreadLayoutType)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-neutral-600"
          >
            <option value="cover-spread">Cover Spread Layout</option>
            <option value="single-hero">Single Hero Page</option>
            <option value="editorial-duo">Editorial Duo (2 Columns)</option>
            <option value="triptych-grid">Triptych Showcase (3 Frames)</option>
            <option value="catalogue-quad">Catalogue Quad (4 Frames)</option>
            <option value="quote-accent">Manifesto & Quote Accent</option>
          </select>
        </div>

        {/* Color Palette Theme */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" />
            <span>{dict.bgCanvas}</span>
          </label>

          <div className="grid grid-cols-1 gap-1.5">
            {colorPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleFieldChange('bgColor', preset.bg);
                  handleFieldChange('textColor', preset.text);
                }}
                className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                  spread.bgColor === preset.bg
                    ? 'border-amber-400 bg-neutral-900 shadow'
                    : 'border-neutral-800 hover:border-neutral-700 bg-neutral-900/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: preset.bg }}
                  />
                  <span className="text-neutral-200">{preset.label}</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-500">{preset.bg}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text Metadata Controls */}
        <div className="flex flex-col gap-3">
          <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5" />
            <span>{dict.typography}</span>
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-neutral-500">{dict.spreadTitle}</span>
            <input
              type="text"
              value={spread.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600 font-medium"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-neutral-500">{dict.subtitle}</span>
            <input
              type="text"
              value={spread.subtitle}
              onChange={(e) => handleFieldChange('subtitle', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-neutral-500">{dict.lookBadge}</span>
            <input
              type="text"
              value={spread.lookNumber}
              onChange={(e) => handleFieldChange('lookNumber', e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
