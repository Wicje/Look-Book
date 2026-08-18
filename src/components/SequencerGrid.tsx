'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Plus,
  Copy,
  Trash2,
  Move,
  Sparkles,
  Layout,
  Eye
} from 'lucide-react';
import { SpreadPage, AssetItem } from '../types/lookbook';

interface SequencerGridProps {
  spreads: SpreadPage[];
  assets: AssetItem[];
  activeSpreadIndex: number;
  onSelectSpreadIndex: (idx: number) => void;
  onReorderSpreads: (spreads: SpreadPage[]) => void;
  onAddSpread: () => void;
  onDuplicateSpread: (idx: number) => void;
  onDeleteSpread: (idx: number) => void;
  onOpenAutoSequence: () => void;
}

export const SequencerGrid: React.FC<SequencerGridProps> = ({
  spreads,
  assets,
  activeSpreadIndex,
  onSelectSpreadIndex,
  onReorderSpreads,
  onAddSpread,
  onDuplicateSpread,
  onDeleteSpread,
  onOpenAutoSequence
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const getAsset = (assetId: string | null) => {
    if (!assetId) return null;
    return assets.find((a) => a.id === assetId) || null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = spreads.findIndex((s) => s.id === active.id);
    const newIndex = spreads.findIndex((s) => s.id === over.id);

    const reordered = arrayMove(spreads, oldIndex, newIndex).map((s, idx) => ({
      ...s,
      pageNumber: idx + 1
    }));

    onReorderSpreads(reordered);
  };

  return (
    <div className="flex-1 bg-neutral-950 text-neutral-100 p-8 overflow-y-auto select-none">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <h2 className="text-xl font-serif font-bold tracking-tight text-white flex items-center gap-2">
            <span>Lookbook Page Sequencer</span>
            <span className="text-xs font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-neutral-400">
              {spreads.length} Spreads
            </span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Drag and drop spread thumbnails to compose & sequence your lookbook story.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAutoSequence}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-200 hover:text-amber-300 rounded-xl text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Auto-Sequence</span>
          </button>

          <button
            onClick={onAddSpread}
            className="flex items-center gap-1.5 px-4 py-2 bg-white text-black font-semibold rounded-xl text-xs hover:bg-neutral-200 transition-colors shadow"
          >
            <Plus className="w-4 h-4" />
            <span>New Spread</span>
          </button>
        </div>
      </div>

      {/* Sortable Grid */}
      <div className="max-w-6xl mx-auto pt-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={spreads.map((s) => s.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {spreads.map((spread, index) => (
                <SortableSpreadCard
                  key={spread.id}
                  spread={spread}
                  index={index}
                  isActive={index === activeSpreadIndex}
                  getAsset={getAsset}
                  onSelect={() => onSelectSpreadIndex(index)}
                  onDuplicate={() => onDuplicateSpread(index)}
                  onDelete={() => onDeleteSpread(index)}
                  canDelete={spreads.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};

interface SortableSpreadCardProps {
  spread: SpreadPage;
  index: number;
  isActive: boolean;
  getAsset: (id: string | null) => AssetItem | null;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  canDelete: boolean;
}

function SortableSpreadCard({
  spread,
  index,
  isActive,
  getAsset,
  onSelect,
  onDuplicate,
  onDelete,
  canDelete
}: SortableSpreadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: spread.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  const bgStyle = {
    backgroundColor: spread.bgColor || '#FAF9F6',
    color: spread.textColor || (spread.bgColor === '#121212' ? '#F5F5F5' : '#171717')
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col bg-neutral-900 ${
        isActive
          ? 'border-amber-400 shadow-xl ring-2 ring-amber-400/30'
          : 'border-neutral-800 hover:border-neutral-600'
      }`}
    >
      {/* Thumbnail Card Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-800 bg-neutral-950/80 text-xs">
        <div className="flex items-center gap-2">
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-neutral-500 hover:text-neutral-200 cursor-grab active:cursor-grabbing rounded hover:bg-neutral-800"
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono font-bold text-neutral-300">
            SPREAD #{index + 1}
          </span>
          <span className="text-[10px] font-mono uppercase bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded text-neutral-400">
            {spread.layout}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
            title="Duplicate"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            disabled={!canDelete}
            className="p-1 rounded text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 disabled:opacity-20"
            title="Delete"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Mini Spread Visual Preview */}
      <div
        onClick={onSelect}
        className="aspect-[1.414/1] p-3 cursor-pointer relative overflow-hidden flex flex-col justify-between"
        style={bgStyle}
      >
        <div className="flex justify-between items-start text-[9px] font-mono font-bold opacity-60">
          <span className="truncate max-w-[120px]">{spread.title}</span>
          <span>{spread.lookNumber}</span>
        </div>

        {/* Slot Grid Representation */}
        <div className="grid grid-cols-12 gap-1.5 flex-1 my-1.5">
          {spread.slots.map((slot, idx) => {
            const asset = getAsset(slot.assetId);
            return (
              <div
                key={idx}
                className={`rounded border border-black/10 overflow-hidden bg-black/5 ${
                  spread.slots.length === 1
                    ? 'col-span-12 h-full'
                    : spread.slots.length === 2
                    ? 'col-span-6 h-full'
                    : spread.slots.length === 3
                    ? idx === 0
                      ? 'col-span-7 h-full'
                      : 'col-span-5 h-[calc(50%-3px)]'
                    : 'col-span-3 h-full'
                }`}
              >
                {asset ? (
                  <img
                    src={asset.imageUrl}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[8px] opacity-40">
                    Empty
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[8px] font-mono opacity-50">
          <span>ATELIER</span>
          <span>SELECT TO EDIT</span>
        </div>

        {/* Hover overlay button */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onSelect}
            className="px-3.5 py-1.5 bg-white text-black font-semibold text-xs rounded-lg shadow flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
}
