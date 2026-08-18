'use client';

import React, { useState, useRef } from 'react';
import {
  Search,
  Plus,
  Upload,
  FolderOpen,
  Info,
  Globe,
  Sparkles,
  Loader2
} from 'lucide-react';
import { AssetItem, CategoryType, SupportedLocale } from '../types/lookbook';
import { DICTIONARIES } from '../i18n/dictionaries';

interface AssetLibraryProps {
  assets: AssetItem[];
  selectedSlotId: string | null;
  locale?: SupportedLocale;
  onInsertAssetToSlot: (assetId: string) => void;
  onAddCustomAsset: (asset: AssetItem) => void;
  onAddMultipleAssets?: (assets: AssetItem[]) => void;
  onDragStartAsset?: (e: React.DragEvent, assetId: string) => void;
}

export const AssetLibrary: React.FC<AssetLibraryProps> = ({
  assets,
  selectedSlotId,
  locale = 'en',
  onInsertAssetToSlot,
  onAddCustomAsset,
  onAddMultipleAssets,
  onDragStartAsset
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [hoveredAssetId, setHoveredAssetId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<AssetItem | null>(null);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dict = DICTIONARIES[locale || 'en'];

  const categories: CategoryType[] = [
    'All',
    'Outerwear',
    'Tailoring',
    'Knitwear',
    'Footwear',
    'Accessories',
    'Custom'
  ];

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory =
      selectedCategory === 'All' || asset.category === selectedCategory;
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.fabric && asset.fabric.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (asset.sku && asset.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Real Web API Search (Live Unsplash Photography Search)
  const handleLiveAPISearch = async () => {
    if (!searchQuery) return;
    setIsSearchingAPI(true);

    try {
      const res = await fetch(`/api/assets?query=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (data.assets && data.assets.length > 0 && onAddMultipleAssets) {
        onAddMultipleAssets(data.assets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingAPI(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newAsset: AssetItem = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Custom',
          imageUrl,
          tags: ['Custom', 'Uploaded'],
          colorPalette: ['#2A2A2A', '#8C8C8C', '#E5E5E5'],
          fabric: 'User Uploaded Photography',
          sku: `CUSTOM-${Date.now().toString().slice(-4)}`
        };
        onAddCustomAsset(newAsset);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <aside className="w-80 border-r border-neutral-800 bg-neutral-950 text-neutral-200 flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-neutral-400" />
            <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-300 font-semibold">
              {dict.lookLibrary} ({filteredAssets.length})
            </h2>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-200 hover:text-white rounded-lg text-xs font-medium transition-all"
            title={dict.upload}
          >
            <Upload className="w-3 h-3 text-emerald-400" />
            <span>{dict.upload}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
        </div>

        {/* Search Bar + Live Web API Query Button */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLiveAPISearch()}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
            />
          </div>

          <button
            onClick={handleLiveAPISearch}
            disabled={isSearchingAPI || !searchQuery}
            className="p-2 bg-neutral-900 border border-neutral-800 hover:border-sky-500/50 text-sky-400 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
            title="Search Live Unsplash Photography API"
          >
            {isSearchingAPI ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-neutral-100 text-neutral-950 font-semibold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Slot Notice */}
      {selectedSlotId && (
        <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
          <span className="truncate font-mono text-[11px]">Target Slot: #{selectedSlotId}</span>
          <span className="text-[10px] uppercase font-bold text-amber-400">Ready to Assign</span>
        </div>
      )}

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
        {filteredAssets.map((asset) => {
          return (
            <div
              key={asset.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', asset.id);
                if (onDragStartAsset) onDragStartAsset(e, asset.id);
              }}
              onMouseEnter={() => setHoveredAssetId(asset.id)}
              onMouseLeave={() => setHoveredAssetId(null)}
              className="group relative rounded-xl border border-neutral-800/80 bg-neutral-900/60 overflow-hidden cursor-grab active:cursor-grabbing hover:border-neutral-600 transition-all hover:shadow-lg flex flex-col"
            >
              {/* Image Preview */}
              <div className="aspect-[3/4] relative overflow-hidden bg-neutral-950">
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewAsset(asset);
                      }}
                      className="p-1 rounded bg-black/60 text-neutral-300 hover:text-white backdrop-blur-sm"
                      title="Inspect metadata"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onInsertAssetToSlot(asset.id)}
                    className="w-full py-1.5 bg-white/95 text-neutral-950 font-semibold text-xs rounded-lg shadow hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Look</span>
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-mono uppercase text-neutral-300 border border-white/10">
                  {asset.category}
                </div>
              </div>

              {/* Title & Swatches */}
              <div className="p-2.5 flex flex-col gap-1.5 flex-1 justify-between">
                <p className="text-[11px] font-medium text-neutral-200 line-clamp-1 leading-tight group-hover:text-white">
                  {asset.title}
                </p>

                {/* Dominant Palette Swatches & SKU */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1">
                    {asset.colorPalette.slice(0, 3).map((hex, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shadow-xs"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>

                  {asset.sku && (
                    <span className="text-[9px] font-mono text-neutral-500 truncate max-w-[60px]">
                      {asset.sku}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Upload Dropzone Footer */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border border-dashed border-neutral-800 hover:border-neutral-600 rounded-xl p-2.5 text-center cursor-pointer transition-colors bg-neutral-900/40 hover:bg-neutral-900 flex items-center justify-center gap-2 text-xs text-neutral-400"
        >
          <Upload className="w-3.5 h-3.5 text-neutral-500" />
          <span>{dict.dragDropHint}</span>
        </div>
      </div>

      {/* Asset Info Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-5 text-neutral-100 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-semibold text-sm">{previewAsset.title}</h3>
              <button
                onClick={() => setPreviewAsset(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={previewAsset.imageUrl}
                alt={previewAsset.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Category:</span>
                <span className="font-mono text-white">{previewAsset.category}</span>
              </div>
              {previewAsset.fabric && (
                <div className="flex justify-between py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">Fabric Spec:</span>
                  <span className="font-mono text-neutral-200">{previewAsset.fabric}</span>
                </div>
              )}
              {previewAsset.sku && (
                <div className="flex justify-between py-1 border-b border-neutral-800/60">
                  <span className="text-neutral-400">SKU / Item #:</span>
                  <span className="font-mono text-neutral-300">{previewAsset.sku}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 pt-2">
                <span className="text-neutral-400">Dominant Swatches:</span>
                <div className="flex items-center gap-1 ml-auto">
                  {previewAsset.colorPalette.map((hex, i) => (
                    <span
                      key={i}
                      className="w-4 h-4 rounded border border-neutral-700"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onInsertAssetToSlot(previewAsset.id);
                setPreviewAsset(null);
              }}
              className="w-full py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors mt-2"
            >
              Insert into Lookbook
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
