'use client';

import React, { useState } from 'react';
import { Users, Globe, Plus, Layers, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';
import { Collaborator, LookbookProject } from '../types/lookbook';

interface CollaborationBarProps {
  collaborators: Collaborator[];
  currentProject: LookbookProject;
  onSelectProject: (projId: string) => void;
  onCreateNewProject: () => void;
}

export const CollaborationBar: React.FC<CollaborationBarProps> = ({
  collaborators,
  currentProject,
  onSelectProject,
  onCreateNewProject
}) => {
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  return (
    <div className="flex items-center gap-3 bg-neutral-900/80 border border-neutral-800 px-3 py-1 rounded-xl text-xs">
      {/* Workspace Selector */}
      <div className="relative">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="flex items-center gap-2 hover:text-white transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-neutral-300 font-medium truncate max-w-[120px]">
            {currentProject.brand}
          </span>
          <ChevronDown className="w-3 h-3 text-neutral-500" />
        </button>

        {showWorkspaceMenu && (
          <div className="absolute left-0 mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in">
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-500">
              Active Brand Workspace
            </div>
            <div className="px-2 py-1.5 text-xs font-semibold text-white border-b border-neutral-800 flex items-center justify-between">
              <span>{currentProject.brand}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <button
              onClick={() => {
                onCreateNewProject();
                setShowWorkspaceMenu(false);
              }}
              className="w-full text-left px-2 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 mt-1"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Create New Workspace</span>
            </button>
          </div>
        )}
      </div>

      <div className="h-3 w-[1px] bg-neutral-800" />

      {/* Collaborator Avatars */}
      <div className="flex items-center -space-x-1.5">
        {collaborators.map((col) => (
          <div
            key={col.id}
            className="relative group cursor-pointer"
            title={`${col.name} (${col.role} — ${col.location})`}
          >
            <img
              src={col.avatar}
              alt={col.name}
              className="w-5 h-5 rounded-full border border-neutral-950 object-cover"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-neutral-950"
              style={{ backgroundColor: col.color }}
            />
          </div>
        ))}
      </div>

      <span className="text-[10px] font-mono text-neutral-400 hidden lg:inline">
        {collaborators.length} Studios Syncing Live
      </span>
    </div>
  );
};
