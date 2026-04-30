'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';

type PlatformKey = 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'pinterest';

interface SizeSpec {
  width: number;
  height: number;
  label: string;
  description: string;
  safeZone?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    color: string;
    label: string;
  };
}

const PLATFORMS: Record<PlatformKey, { name: string; icon: string; types: Record<string, SizeSpec> }> = {
  instagram: {
    name: 'Instagram',
    icon: '📸',
    types: {
      post_square: { width: 1080, height: 1080, label: 'Feed Post (1:1)', description: 'Classic square post — highest engagement ratio' },
      post_portrait: { width: 1080, height: 1350, label: 'Feed Post (4:5)', description: 'Portrait post — takes more screen real estate' },
      post_landscape: { width: 1080, height: 566, label: 'Feed Post (1.91:1)', description: 'Landscape post — ideal for photography' },
      story: { width: 1080, height: 1920, label: 'Story / Reel (9:16)', description: 'Full-screen vertical story or Reel cover' },
      reel: { width: 1080, height: 1920, label: 'Reel Cover (9:16)', description: 'Dedicated Reel thumbnail' },
      profile: { width: 320, height: 320, label: 'Profile Picture', description: 'Displayed at 110px but upload 320px for retina' },
    },
  },
  twitter: {
    name: 'Twitter / X',
    icon: '𝕏',
    types: {
      post: { width: 1200, height: 675, label: 'Post Image (16:9)', description: 'Standard in-feed tweet image' },
      card: { width: 1200, height: 628, label: 'Summary Card', description: 'Website link preview card' },
      header: {
        width: 1500,
        height: 500,
        label: 'Header Photo',
        description: 'Profile banner — text safe zone recommended',
        safeZone: { top: 0, bottom: 150, left: 0, right: 0, color: 'rgba(239,68,68,0.25)', label: 'Mobile crops bottom 150px' },
      },
      profile: { width: 400, height: 400, label: 'Profile Photo', description: 'Circular avatar — center your face' },
    },
  },
  facebook: {
    name: 'Facebook',
    icon: 'f',
    types: {
      post: { width: 1200, height: 630, label: 'Feed Post / Link', description: 'Shared link or status update image' },
      cover: {
        width: 851,
        height: 315,
        label: 'Cover Photo',
        description: 'Page or personal profile cover',
        safeZone: { top: 0, bottom: 0, left: 0, right: 0, color: 'rgba(59,130,246,0.2)', label: 'Text may shift on mobile' },
      },
      event: { width: 1200, height: 628, label: 'Event Cover', description: 'Facebook event banner image' },
      story: { width: 1080, height: 1920, label: 'Story (9:16)', description: 'Ephemeral full-screen story' },
      profile: { width: 170, height: 170, label: 'Profile Picture', description: 'Page or personal avatar' },
    },
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'in',
    types: {
      banner: {
        width: 1584,
        height: 396,
        label: 'Profile Banner',
        description: 'Personal profile background image',
        safeZone: { top: 0, bottom: 0, left: 300, right: 300, color: 'rgba(16,185,129,0.2)', label: 'Mobile crops 300px each side' },
      },
      company: { width: 1128, height: 191, label: 'Company Banner', description: 'Business / Company page header' },
      post: { width: 1200, height: 627, label: 'Post Image', description: 'Feed update — PDF document cover also works' },
      article: { width: 1200, height: 644, label: 'Article Image', description: 'LinkedIn native article hero' },
      profile: { width: 400, height: 400, label: 'Profile Photo', description: 'Professional headshot' },
    },
  },
  youtube: {
    name: 'YouTube',
    icon: '▶️',
    types: {
      thumbnail: { width: 1280, height: 720, label: 'Video Thumbnail', description: 'Standard HD thumbnail — CTR critical' },
      banner: {
        width: 2560,
        height: 1440,
        label: 'Channel Banner',
        description: 'TV / Desktop / Mobile responsive banner',
        safeZone: { top: 423, bottom: 423, left: 640, right: 640, color: 'rgba(239,68,68,0.2)', label: 'Safe area for all devices' },
      },
      profile: { width: 800, height: 800, label: 'Profile Picture', description: 'Channel icon / logo' },
    },
  },
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    types: {
      video: { width: 1080, height: 1920, label: 'Video (9:16)', description: 'Standard vertical video frame' },
      profile: { width: 200, height: 200, label: 'Profile Photo', description: 'TikTok avatar' },
    },
  },
  pinterest: {
    name: 'Pinterest',
    icon: 'P',
    types: {
      standard: { width: 1000, height: 1500, label: 'Standard Pin (2:3)', description: 'Best performing ratio for saves' },
      square: { width: 1000, height: 1000, label: 'Square Pin (1:1)', description: 'Equal width and height' },
      long: { width: 1000, height: 2100, label: 'Long Pin (1:2.1)', description: 'Maximum recommended length' },
    },
  },
};

export default function SocialImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [platform, setPlatform] = useState<PlatformKey>('instagram');
  const [type, setType] = useState<string>('post_square');
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(90);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0, size: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  const currentSpec = PLATFORMS[platform].types[type];

  const processImage = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width: targetW, height: targetH } = currentSpec;

    canvas.width = targetW;
    canvas.height = targetH;

    // Fill white background (prevents transparent PNGs from turning black on JPEG)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetW, targetH);

    // Cover fit (crop to fill)
    const scale = Math.max(targetW / img.width, targetH / img.height);
    const drawW = img.width * scale;
    const drawH = img.height * scale;
    const offsetX = (targetW - drawW) / 2;
    const offsetY = (targetH - drawH) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

    // Safe zone overlay
    if (showSafeZone && currentSpec.safeZone) {
      const sz = currentSpec.safeZone;
      ctx.fillStyle = sz.color;
      // Draw the cropped areas (inverse of safe zone)
      if (sz.top) ctx.fillRect(0, 0, targetW, sz.top);
      if (sz.bottom) ctx.fillRect(0, targetH - sz.bottom, targetW, sz.bottom);
      if (sz.left) ctx.fillRect(0, 0, sz.left, targetH);
      if (sz.right) ctx.fillRect(targetW - sz.right, 0, sz.right, targetH);

      // Label
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillText(sz.label, 20, targetH - 20);
    }
  }, [currentSpec, showSafeZone]);

  useEffect(() => {
    if (imgSrc) {
      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        processImage();
      };
      img.src = imgSrc;
    }
  }, [imgSrc, processImage]);

  useEffect(() => {
    if (imageObjRef.current) processImage();
  }, [platform, type, format, quality, showSafeZone, processImage]);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    setOriginalSize({ width: 0, height: 0, size: f.size });
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImgSrc(result);
      const img = new Image();
      img.onload = () => {
        setOriginalSize((prev) => ({ ...prev, width: img.width, height: img.height }));
      };
      img.src = result;
    };
    reader.readAsDataURL(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    const q = format === 'png' ? undefined : quality / 100;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${platform}-${type}-${currentSpec.width}x${currentSpec.height}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, mime, q);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="grid lg:grid-cols-12 min-h-[600px]">
        {/* LEFT: Controls */}
        <div className="lg:col-span-4 bg-slate-50 border-r border-slate-200 p-6 space-y-6 overflow-y-auto max-h-[800px]">
          {/* Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">1. Upload Image</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
                isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm text-slate-600 font-medium">Click or drag image here</p>
              <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WebP, GIF</p>
            </div>
            {file && (
              <div className="mt-2 text-xs text-slate-500 flex justify-between">
                <span className="truncate max-w-[70%]">{file.name}</span>
                <span>{originalSize.width > 0 && `${originalSize.width}×${originalSize.height}`}</span>
              </div>
            )}
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">2. Select Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(PLATFORMS) as PlatformKey[]).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPlatform(p);
                    setType(Object.keys(PLATFORMS[p].types)[0]);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    platform === p
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="mr-1">{PLATFORMS[p].icon}</span>
                  {PLATFORMS[p].name}
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">3. Choose Format Type</label>
            <div className="space-y-2">
              {Object.entries(PLATFORMS[platform].types).map(([key, spec]) => (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                    type === key
                      ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-800">{spec.label}</span>
                    <span className="text-xs font-mono text-slate-500">{spec.width}×{spec.height}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{spec.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Output Format</label>
              <div className="flex gap-2">
                {(['jpeg', 'png', 'webp'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-bold uppercase tracking-wide ${
                      format === f ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {format !== 'png' && (
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-sm font-semibold text-slate-700">Quality</label>
                  <span className="text-xs text-slate-500">{quality}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                id="safezone"
                type="checkbox"
                checked={showSafeZone}
                onChange={(e) => setShowSafeZone(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <label htmlFor="safezone" className="text-sm text-slate-700 select-none cursor-pointer">
                Show safe zone guides
              </label>
            </div>
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={!imgSrc}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <span>⬇️</span> Download Resized Image
          </button>

          {currentSpec.safeZone && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              <strong>💡 Tip:</strong> {currentSpec.safeZone.label}. Keep text and faces inside the clear area.
            </p>
          )}
        </div>

        {/* RIGHT: Preview */}
        <div className="lg:col-span-8 bg-slate-100 p-6 flex flex-col items-center justify-center relative min-h-[400px]">
          {!imgSrc ? (
            <div className="text-center text-slate-400">
              <div className="text-6xl mb-4">🖼️</div>
              <p className="text-lg font-medium">Upload an image to see preview</p>
              <p className="text-sm">Your image will be resized to {currentSpec.width} × {currentSpec.height} px</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <div className="bg-white p-2 rounded-xl shadow-lg border border-slate-200 mb-4 overflow-auto max-w-full">
                <canvas
                  ref={canvasRef}
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '60vh' }}
                />
              </div>
              <div className="flex gap-4 text-sm text-slate-600 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <span>Original: <strong>{originalSize.width}×{originalSize.height}</strong></span>
                <span className="text-slate-300">|</span>
                <span>New: <strong className="text-indigo-600">{currentSpec.width}×{currentSpec.height}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Ratio: <strong>{(currentSpec.width / currentSpec.height).toFixed(2)}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
