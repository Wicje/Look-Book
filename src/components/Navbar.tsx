'use client';

import React, { useState } from 'react';
import {
  LayoutTemplate,
  Grid,
  Play,
  Wand2,
  Download,
  BookOpen,
  ChevronDown,
  ShoppingBag,
  Globe,
  Plus
} from 'lucide-react';
import { LookbookProject, SupportedLocale, ThemePreset } from '../types/lookbook';
import { PRESET_PROJECTS } from '../data/presetLookbooks';
import { DICTIONARIES } from '../i18n/dictionaries';
import { CollaborationBar } from './CollaborationBar';

interface NavbarProps {
  project: LookbookProject;
  activeTab: 'editor' | 'sequencer' | 'present';
  setActiveTab: (tab: 'editor' | 'sequencer' | 'present') => void;
  onUpdateTitle: (title: string, season: string, brand: string) => void;
  onSelectPreset: (preset: LookbookProject) => void;
  onOpenAutoSequence: () => void;
  onOpenExport: () => void;
  onOpenCommerceSync: () => void;
  onLocaleChange: (locale: SupportedLocale) => void;
  onThemeChange: (theme: ThemePreset) => void;
  onCreateNewProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  project,
  activeTab,
  setActiveTab,
  onUpdateTitle,
  onSelectPreset,
  onOpenAutoSequence,
  onOpenExport,
  onOpenCommerceSync,
  onLocaleChange,
  onThemeChange,
  onCreateNewProject
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);
  const [seasonInput, setSeasonInput] = useState(project.season);

  const dict = DICTIONARIES[project.locale || 'en'];

  const handleTitleSubmit = () => {
    onUpdateTitle(titleInput, seasonInput, project.brand);
    setIsEditingTitle(false);
  };

  const languages: { id: SupportedLocale; name: string; flag: string }[] = [
    { id: 'en', name: 'English (US)', flag: '🇺🇸' },
    { id: 'fr', name: 'Français (FR)', flag: '🇫🇷' },
    { id: 'it', name: 'Italiano (IT)', flag: '🇮🇹' },
    { id: 'ja', name: '日本語 (JP)', flag: '🇯🇵' },
    { id: 'es', name: 'Español (ES)', flag: '🇪🇸' }
  ];

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-950 text-neutral-100 flex items-center justify-between px-5 select-none shrink-0 z-30">
      {/* Left Branding & Collaboration Bar */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white font-mono font-bold text-sm tracking-wider shadow-inner">
            {dict.appName.substring(0, 2)}
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-neutral-400 hidden xl:inline-block">
            {dict.appName} // {dict.subTitle}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-neutral-800 hidden md:block" />

        {/* Live Collaborators Presence Component */}
        <CollaborationBar
          collaborators={project.collaborators || []}
          currentProject={project}
          onSelectProject={() => {}}
          onCreateNewProject={onCreateNewProject}
        />

        {/* Editable Title Header */}
        <div className="hidden lg:flex items-center gap-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1 text-sm text-white focus:outline-none focus:border-white font-medium"
              />
              <input
                type="text"
                value={seasonInput}
                onChange={(e) => setSeasonInput(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-300 font-mono focus:outline-none focus:border-white"
              />
              <button
                onClick={handleTitleSubmit}
                className="px-2.5 py-1 bg-white text-black text-xs font-semibold rounded hover:bg-neutral-200 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTitleInput(project.title);
                setSeasonInput(project.season);
                setIsEditingTitle(true);
              }}
              className="text-left group flex items-center gap-2 hover:bg-neutral-900 px-2 py-1 rounded transition-colors"
            >
              <span className="font-semibold text-sm tracking-tight text-white group-hover:text-neutral-200 truncate max-w-[140px]">
                {project.title}
              </span>
              <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700">
                {project.season}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Middle Tab Navigation */}
      <div className="flex items-center bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'editor'
              ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{dict.canvas}</span>
        </button>

        <button
          onClick={() => setActiveTab('sequencer')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'sequencer'
              ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{dict.sequencer} ({project.spreads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('present')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'present'
              ? 'bg-neutral-100 text-neutral-950 font-semibold shadow'
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span className="hidden sm:inline">{dict.present}</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-lg text-xs font-mono"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span className="uppercase font-bold">{project.locale || 'en'}</span>
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase">
                {dict.language}
              </div>
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    onLocaleChange(lang.id);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 text-xs rounded-lg transition-colors flex items-center justify-between ${
                    project.locale === lang.id
                      ? 'bg-neutral-800 text-white font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* E-Commerce Sync Button */}
        <button
          onClick={onOpenCommerceSync}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 text-neutral-300 hover:text-emerald-300 rounded-lg text-xs font-medium transition-all hidden md:flex"
          title="Sync Shopify catalog"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">{dict.commerceSync}</span>
        </button>

        {/* Presets Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPresetsMenu(!showPresetsMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden xl:inline">{dict.presets}</span>
            <ChevronDown className="w-3 h-3 text-neutral-500" />
          </button>

          {showPresetsMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase">
                {dict.presets}
              </div>
              {PRESET_PROJECTS.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectPreset(item.project);
                    setShowPresetsMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Auto Sequence Button */}
        <button
          onClick={onOpenAutoSequence}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-amber-300 rounded-lg text-xs font-medium transition-all group"
          title={dict.autoSequence}
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="hidden lg:inline">{dict.autoSequence}</span>
        </button>

        {/* Export / Share Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-semibold rounded-lg text-xs hover:bg-neutral-200 transition-colors shadow"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{dict.export}</span>
        </button>
      </div>
    </header>
  );
};
