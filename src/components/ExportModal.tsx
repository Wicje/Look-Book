'use client';

import React, { useState } from 'react';
import { Download, FileCode, Upload, Printer, X, Check, Loader2, FileText } from 'lucide-react';
import { LookbookProject } from '../types/lookbook';
import { exportLookbookToPDF } from '../utils/pdfExport';
import confetti from 'canvas-confetti';

interface ExportModalProps {
  project: LookbookProject;
  onImportProject: (imported: LookbookProject) => void;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  onImportProject,
  onClose,
  onToast
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExportPDF = async () => {
    try {
      setIsExportingPDF(true);
      await exportLookbookToPDF('lookbook-active-spread', project.title);
      confetti({ particleCount: 50, spread: 50 });
      onToast('PDF Lookbook downloaded successfully!', 'success');
      onClose();
    } catch (err) {
      console.error(err);
      onToast('Failed to generate PDF. Make sure layout is loaded.', 'error');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title.toLowerCase().replace(/\s+/g, '-')}-project.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onToast('Project JSON exported!', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.spreads && parsed.title) {
          onImportProject(parsed);
          onToast('Project imported successfully!', 'success');
          onClose();
        } else {
          onToast('Invalid lookbook project JSON format.', 'error');
        }
      } catch (err) {
        onToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-neutral-100 flex flex-col gap-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-white" />
            <h3 className="font-semibold text-base">Export Lookbook</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* PDF Download */}
          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-all text-left flex items-center justify-between group disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Export as PDF Document</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  High-resolution editorial print spread PDF
                </div>
              </div>
            </div>
            {isExportingPDF ? (
              <Loader2 className="w-4 h-4 text-neutral-400 animate-spin" />
            ) : (
              <Download className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
            )}
          </button>

          {/* JSON Export */}
          <button
            onClick={handleExportJSON}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-all text-left flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Save Project (.JSON)</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Export complete lookbook data & layout configuration
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </button>

          {/* JSON Import */}
          <label className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 transition-all cursor-pointer flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Load Saved Project</div>
                <div className="text-[11px] text-neutral-400 mt-0.5">
                  Import previously saved lookbook project file
                </div>
              </div>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
