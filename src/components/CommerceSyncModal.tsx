'use client';

import React, { useState } from 'react';
import { ShoppingBag, RefreshCw, Check, Upload, X, ShieldCheck, Link2, AlertCircle } from 'lucide-react';
import { AssetItem } from '../types/lookbook';
import confetti from 'canvas-confetti';

interface CommerceSyncModalProps {
  onSyncProducts: (products: AssetItem[]) => void;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CommerceSyncModal: React.FC<CommerceSyncModalProps> = ({
  onSyncProducts,
  onClose,
  onToast
}) => {
  const [storeDomain, setStoreDomain] = useState('kith.com');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleStores = ['kith.com', 'allbirds.com', 'gymshark.com', 'koparibeauty.com'];

  const handleRunSync = async (domainToSync: string = storeDomain) => {
    if (!domainToSync) {
      onToast('Please enter a valid store domain', 'error');
      return;
    }

    setIsSyncing(true);
    setErrorMessage(null);

    try {
      // Real API call to serverless endpoint /api/shopify
      const res = await fetch(`/api/shopify?domain=${encodeURIComponent(domainToSync)}`);
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch catalog from store');
      }

      if (data.products && data.products.length > 0) {
        onSyncProducts(data.products);
        setSyncedCount(data.products.length);
        confetti({ particleCount: 60, spread: 60 });
        onToast(`Successfully imported ${data.products.length} live products from ${domainToSync}`, 'success');
      } else {
        setErrorMessage(`No products with valid images found on ${domainToSync}`);
        onToast(`No products found on ${domainToSync}`, 'error');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error connecting to real Shopify Storefront API');
      onToast(err.message || 'Storefront API connection failed', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-neutral-100 flex flex-col gap-5 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Live Storefront API Sync</h3>
              <p className="text-xs text-neutral-400">
                Connect real Shopify stores & pull live catalog data.
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

        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono uppercase text-neutral-400">Target Shopify Store Domain</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Link2 className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
              <input
                type="text"
                value={storeDomain}
                onChange={(e) => setStoreDomain(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="store-name.com or store.myshopify.com"
              />
            </div>
          </div>

          {/* Quick Real Sample Stores */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-mono text-neutral-500">Live Stores:</span>
            {sampleStores.map((store) => (
              <button
                key={store}
                onClick={() => {
                  setStoreDomain(store);
                  handleRunSync(store);
                }}
                className="px-2 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-emerald-300 transition-colors"
              >
                {store}
              </button>
            ))}
          </div>

          <div className="p-3 bg-neutral-950/60 border border-neutral-800 rounded-xl text-xs text-neutral-400 flex items-center gap-2 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Connects directly to target store's live `/products.json` API endpoint.</span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {syncedCount !== null && !errorMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between font-mono">
              <span>Status: Live Catalog Synced</span>
              <span className="font-bold text-emerald-400">{syncedCount} Real Items Imported</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
          >
            Close
          </button>
          <button
            onClick={() => handleRunSync()}
            disabled={isSyncing}
            className="px-5 py-2 bg-emerald-400 text-black font-bold text-xs rounded-xl hover:bg-emerald-300 transition-colors flex items-center gap-1.5 shadow disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Fetching Live API...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Sync Live Store</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
