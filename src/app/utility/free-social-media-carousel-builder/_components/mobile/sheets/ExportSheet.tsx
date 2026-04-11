'use client';

import React from 'react';
import { useExport } from '../../../_hooks/useExport';

export function ExportSheet() {
    const { exportAllPNG, exportZIP, isExporting } = useExport();

    return (
        <div className="px-4 pb-6 grid grid-cols-2 gap-3">
            <button
                onClick={exportAllPNG}
                disabled={isExporting}
                className="border border-white/10 rounded-2xl p-4 text-left disabled:opacity-50 transition-colors hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.06)' }}
            >
                <div className="text-white font-medium text-sm mb-1">PNG files</div>
                <div className="text-white/40 text-xs">One per slide</div>
            </button>
            <button
                onClick={exportZIP}
                disabled={isExporting}
                className="border border-white/10 rounded-2xl p-4 text-left disabled:opacity-50 transition-colors hover:bg-white/5"
                style={{ background: 'rgba(255,255,255,0.06)' }}
            >
                <div className="text-white font-medium text-sm mb-1">ZIP archive</div>
                <div className="text-white/40 text-xs">All slides zipped</div>
            </button>
            <div className="col-span-2 text-center text-xs text-white/30 mt-1">
                {isExporting ? 'Preparing export…' : 'Exports at 1080×1350px (Instagram portrait)'}
            </div>
        </div>
    );
}