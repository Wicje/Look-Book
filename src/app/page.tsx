'use client';

import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { AssetLibrary } from '../components/AssetLibrary';
import { CanvasSpread } from '../components/CanvasSpread';
import { Inspector } from '../components/Inspector';
import { SequencerGrid } from '../components/SequencerGrid';
import { PresentationMode } from '../components/PresentationMode';
import { AutoSequenceModal } from '../components/AutoSequenceModal';
import { ExportModal } from '../components/ExportModal';
import { CommerceSyncModal } from '../components/CommerceSyncModal';
import { ToastContainer, ToastMessage } from '../components/Toast';
import { INITIAL_PROJECT, DEFAULT_ASSETS } from '../data/presetLookbooks';
import { LookbookProject, SpreadPage, AssetItem, SupportedLocale, ThemePreset } from '../types/lookbook';

export default function Home() {
  const [project, setProject] = useState<LookbookProject>(INITIAL_PROJECT);
  const [activeTab, setActiveTab] = useState<'editor' | 'sequencer' | 'present'>('editor');
  const [activeSpreadIndex, setActiveSpreadIndex] = useState<number>(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Modals & Toasts
  const [showAutoSequenceModal, setShowAutoSequenceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCommerceModal, setShowCommerceModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const currentSpread = project.spreads[activeSpreadIndex] || project.spreads[0];

  // Handler: Update Current Spread
  const handleUpdateSpread = (updatedSpread: SpreadPage) => {
    const updatedSpreads = project.spreads.map((s, idx) =>
      idx === activeSpreadIndex ? updatedSpread : s
    );
    setProject({ ...project, spreads: updatedSpreads });
  };

  // Handler: Add New Spread
  const handleAddSpread = () => {
    const newPageNum = project.spreads.length + 1;
    const newSpread: SpreadPage = {
      id: `spread-${Date.now()}`,
      pageNumber: newPageNum,
      layout: 'editorial-duo',
      title: `EDITORIAL SPREAD ${String(newPageNum).padStart(2, '0')}`,
      subtitle: 'Modern Minimal Composition',
      lookNumber: `LOOK ${String(newPageNum).padStart(2, '0')}`,
      bgColor: '#FAF9F6',
      textColor: '#171717',
      slots: [
        { slotId: `slot-${Date.now()}-1`, assetId: null },
        { slotId: `slot-${Date.now()}-2`, assetId: null }
      ]
    };

    setProject((prev) => ({
      ...prev,
      spreads: [...prev.spreads, newSpread]
    }));
    setActiveSpreadIndex(project.spreads.length);
    addToast(`Added Spread #${newPageNum}`, 'success');
  };

  // Handler: Duplicate Spread
  const handleDuplicateSpread = (targetIdx: number = activeSpreadIndex) => {
    const target = project.spreads[targetIdx];
    if (!target) return;

    const newSpread: SpreadPage = {
      ...target,
      id: `spread-dup-${Date.now()}`,
      pageNumber: targetIdx + 2,
      title: `${target.title} (COPY)`,
      slots: target.slots.map((s, i) => ({
        ...s,
        slotId: `slot-dup-${Date.now()}-${i}`
      }))
    };

    const newSpreads = [...project.spreads];
    newSpreads.splice(targetIdx + 1, 0, newSpread);
    const renumbered = newSpreads.map((s, idx) => ({ ...s, pageNumber: idx + 1 }));

    setProject((prev) => ({ ...prev, spreads: renumbered }));
    setActiveSpreadIndex(targetIdx + 1);
    addToast(`Duplicated Spread #${targetIdx + 1}`, 'success');
  };

  // Handler: Delete Spread
  const handleDeleteSpread = (targetIdx: number = activeSpreadIndex) => {
    if (project.spreads.length <= 1) {
      addToast('Cannot delete the only spread in lookbook', 'error');
      return;
    }

    const filtered = project.spreads.filter((_, idx) => idx !== targetIdx);
    const renumbered = filtered.map((s, idx) => ({ ...s, pageNumber: idx + 1 }));

    setProject((prev) => ({ ...prev, spreads: renumbered }));
    setActiveSpreadIndex(Math.max(0, targetIdx - 1));
    addToast('Spread deleted', 'info');
  };

  // Handler: Drop / Assign Asset to Slot
  const handleAssignAssetToSlot = (slotId: string, assetId: string) => {
    const updatedSlots = currentSpread.slots.map((slot) => {
      if (slot.slotId === slotId) {
        const asset = project.assets.find((a) => a.id === assetId);
        return {
          ...slot,
          assetId: assetId || null,
          customCaption: asset ? asset.title : undefined
        };
      }
      return slot;
    });

    handleUpdateSpread({ ...currentSpread, slots: updatedSlots });
    if (assetId) {
      addToast('Look assigned to slot', 'success');
    }
  };

  // Handler: Insert Asset from Library
  const handleInsertAssetToSelectedSlot = (assetId: string) => {
    let targetSlotId = selectedSlotId;

    if (!targetSlotId) {
      const emptySlot = currentSpread.slots.find((s) => !s.assetId);
      if (emptySlot) {
        targetSlotId = emptySlot.slotId;
      } else {
        targetSlotId = currentSpread.slots[0]?.slotId;
      }
    }

    if (targetSlotId) {
      handleAssignAssetToSlot(targetSlotId, assetId);
    }
  };

  // Handler: Add Custom Uploaded Asset
  const handleAddCustomAsset = (newAsset: AssetItem) => {
    setProject((prev) => ({
      ...prev,
      assets: [newAsset, ...prev.assets]
    }));
    addToast(`Uploaded custom look: ${newAsset.title}`, 'success');
  };

  // Handler: Add Multiple Assets (from Real API calls)
  const handleAddMultipleAssets = (newAssets: AssetItem[]) => {
    setProject((prev) => ({
      ...prev,
      assets: [...newAssets, ...prev.assets]
    }));
    addToast(`Loaded ${newAssets.length} live assets from API`, 'success');
  };

  // Handler: Locale Change (i18n)
  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setProject((prev) => ({ ...prev, locale: newLocale }));
    addToast(`Switched language to ${newLocale.toUpperCase()}`, 'info');
  };

  // Handler: Create New Blank Project
  const handleCreateNewProject = () => {
    const newBlank: LookbookProject = {
      id: `proj-${Date.now()}`,
      title: 'NEW BRAND COLLECTION',
      season: 'SEASON 2027',
      brand: 'ATELIER NEW',
      designer: 'Studio',
      year: '2027',
      locale: project.locale || 'en',
      themePreset: 'minimal-light',
      assets: DEFAULT_ASSETS,
      spreads: [
        {
          id: `spread-new-1`,
          pageNumber: 1,
          layout: 'cover-spread',
          title: 'NEW BRAND COLLECTION',
          subtitle: 'Editorial Lookbook Overview',
          lookNumber: 'COVER',
          bgColor: '#FAF9F6',
          textColor: '#171717',
          slots: [{ slotId: 'new-cover-slot', assetId: 'look-01' }]
        }
      ]
    };
    setProject(newBlank);
    setActiveSpreadIndex(0);
    addToast('Created new brand workspace', 'success');
  };

  return (
    <div className="h-screen w-screen bg-neutral-950 text-neutral-100 flex flex-col overflow-hidden font-sans select-none">
      {/* Top Navbar */}
      <Navbar
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUpdateTitle={(title, season, brand) =>
          setProject((prev) => ({ ...prev, title, season, brand }))
        }
        onSelectPreset={(preset) => {
          setProject(preset);
          setActiveSpreadIndex(0);
          addToast(`Loaded ${preset.title} preset`, 'success');
        }}
        onOpenAutoSequence={() => setShowAutoSequenceModal(true)}
        onOpenExport={() => setShowExportModal(true)}
        onOpenCommerceSync={() => setShowCommerceModal(true)}
        onLocaleChange={handleLocaleChange}
        onThemeChange={(theme) => setProject((prev) => ({ ...prev, themePreset: theme }))}
        onCreateNewProject={handleCreateNewProject}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === 'editor' && (
          <>
            {/* Left Asset Drawer */}
            <AssetLibrary
              assets={project.assets}
              selectedSlotId={selectedSlotId}
              locale={project.locale}
              onInsertAssetToSlot={handleInsertAssetToSelectedSlot}
              onAddCustomAsset={handleAddCustomAsset}
              onAddMultipleAssets={handleAddMultipleAssets}
            />

            {/* Center Canvas Composition Sheet */}
            <CanvasSpread
              spread={currentSpread}
              spreadIndex={activeSpreadIndex}
              totalSpreads={project.spreads.length}
              assets={project.assets}
              selectedSlotId={selectedSlotId}
              locale={project.locale}
              onSelectSlot={setSelectedSlotId}
              onUpdateSpread={handleUpdateSpread}
              onSelectSpreadIndex={setActiveSpreadIndex}
              onAddSpread={handleAddSpread}
              onDuplicateSpread={() => handleDuplicateSpread(activeSpreadIndex)}
              onDeleteSpread={() => handleDeleteSpread(activeSpreadIndex)}
              onDropAssetToSlot={handleAssignAssetToSlot}
            />

            {/* Right Inspector Drawer */}
            <Inspector
              spread={currentSpread}
              selectedSlotId={selectedSlotId}
              assets={project.assets}
              locale={project.locale}
              onUpdateSpread={handleUpdateSpread}
              onSelectSlot={setSelectedSlotId}
              onAssignAssetToSlot={handleAssignAssetToSlot}
            />
          </>
        )}

        {activeTab === 'sequencer' && (
          <SequencerGrid
            spreads={project.spreads}
            assets={project.assets}
            activeSpreadIndex={activeSpreadIndex}
            onSelectSpreadIndex={(idx) => {
              setActiveSpreadIndex(idx);
              setActiveTab('editor');
            }}
            onReorderSpreads={(reordered) => setProject({ ...project, spreads: reordered })}
            onAddSpread={handleAddSpread}
            onDuplicateSpread={handleDuplicateSpread}
            onDeleteSpread={handleDeleteSpread}
            onOpenAutoSequence={() => setShowAutoSequenceModal(true)}
          />
        )}

        {activeTab === 'present' && (
          <PresentationMode
            project={project}
            initialIndex={activeSpreadIndex}
            onClose={() => setActiveTab('editor')}
          />
        )}
      </div>

      {/* Modals & Overlay Portals */}
      {showAutoSequenceModal && (
        <AutoSequenceModal
          project={project}
          onApplySequence={(newSpreads) => {
            setProject((prev) => ({ ...prev, spreads: newSpreads }));
            setActiveSpreadIndex(0);
            addToast('Smart auto-sequence generated!', 'success');
          }}
          onClose={() => setShowAutoSequenceModal(false)}
        />
      )}

      {showExportModal && (
        <ExportModal
          project={project}
          onImportProject={(imported) => {
            setProject(imported);
            setActiveSpreadIndex(0);
          }}
          onClose={() => setShowExportModal(false)}
          onToast={addToast}
        />
      )}

      {showCommerceModal && (
        <CommerceSyncModal
          onSyncProducts={(products) => {
            handleAddMultipleAssets(products);
          }}
          onClose={() => setShowCommerceModal(false)}
          onToast={addToast}
        />
      )}

      {/* Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
