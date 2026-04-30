"use client";

import React, { useState, useCallback, useRef } from "react";
import { 
  Copy, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Image as ImageIcon, 
  Monitor, 
  Smartphone, 
  Tv, 
  Camera,
  Check,
  Upload,
  Maximize2,
  Info,
  ChevronDown,
  X
} from "lucide-react";

interface PresetRatio {
  name: string;
  ratio: [number, number];
  category: string;
  icon: React.ReactNode;
  description: string;
  commonResolutions: string[];
}

const PRESETS: PresetRatio[] = [
  {
    name: "16:9 Widescreen",
    ratio: [16, 9],
    category: "Video & Display",
    icon: <Tv className="w-4 h-4" />,
    description: "Standard for HD video, YouTube, modern TVs",
    commonResolutions: ["1920×1080", "2560×1440", "3840×2160", "1280×720"],
  },
  {
    name: "4:3 Standard",
    ratio: [4, 3],
    category: "Classic",
    icon: <Monitor className="w-4 h-4" />,
    description: "Classic TV, iPad, presentations, retro gaming",
    commonResolutions: ["1024×768", "1600×1200", "2048×1536", "800×600"],
  },
  {
    name: "1:1 Square",
    ratio: [1, 1],
    category: "Social Media",
    icon: <Maximize2 className="w-4 h-4" />,
    description: "Instagram posts, profile pictures, album art",
    commonResolutions: ["1080×1080", "512×512", "2048×2048"],
  },
  {
    name: "21:9 Ultrawide",
    ratio: [21, 9],
    category: "Cinema & Gaming",
    icon: <Monitor className="w-4 h-4" />,
    description: "Cinema scope, ultrawide monitors, immersive gaming",
    commonResolutions: ["2560×1080", "3440×1440", "5120×2160"],
  },
  {
    name: "9:16 Vertical",
    ratio: [9, 16],
    category: "Social Media",
    icon: <Smartphone className="w-4 h-4" />,
    description: "TikTok, Instagram Reels, YouTube Shorts, Stories",
    commonResolutions: ["1080×1920", "720×1280", "1440×2560"],
  },
  {
    name: "3:2 Photography",
    ratio: [3, 2],
    category: "Photography",
    icon: <Camera className="w-4 h-4" />,
    description: "35mm film, DSLR cameras, standard photo prints",
    commonResolutions: ["6000×4000", "5184×3456", "5472×3648"],
  },
  {
    name: "2.39:1 Cinema",
    ratio: [239, 100],
    category: "Cinema",
    icon: <Tv className="w-4 h-4" />,
    description: "Anamorphic widescreen, theatrical releases",
    commonResolutions: ["1920×803", "2560×1074", "3840×1607"],
  },
  {
    name: "4:5 Instagram Portrait",
    ratio: [4, 5],
    category: "Social Media",
    icon: <Smartphone className="w-4 h-4" />,
    description: "Instagram feed portrait, maximum vertical space",
    commonResolutions: ["1080×1350", "800×1000", "1200×1500"],
  },
  {
    name: "1.91:1 Facebook",
    ratio: [191, 100],
    category: "Social Media",
    icon: <Smartphone className="w-4 h-4" />,
    description: "Facebook shared images, LinkedIn posts",
    commonResolutions: ["1200×630", "1080×566"],
  },
  {
    name: "2:3 Pinterest",
    ratio: [2, 3],
    category: "Social Media",
    icon: <Smartphone className="w-4 h-4" />,
    description: "Pinterest standard pins, tall graphics",
    commonResolutions: ["1000×1500", "600×900"],
  },
  {
    name: "16:10 Productivity",
    ratio: [16, 10],
    category: "Display",
    icon: <Monitor className="w-4 h-4" />,
    description: "MacBooks, productivity monitors, extra vertical space",
    commonResolutions: ["1920×1200", "2560×1600", "1680×1050"],
  },
  {
    name: "32:9 Super Ultrawide",
    ratio: [32, 9],
    category: "Gaming",
    icon: <Monitor className="w-4 h-4" />,
    description: "Dual-monitor equivalent, trading setups, simulation",
    commonResolutions: ["5120×1440", "3840×1080"],
  },
];

const UNITS = [
  { value: "px", label: "Pixels (px)", factor: 1 },
  { value: "in", label: "Inches (in)", factor: 96 },
  { value: "cm", label: "Centimeters (cm)", factor: 37.7952755906 },
  { value: "mm", label: "Millimeters (mm)", factor: 3.77952755906 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplifyRatio(w: number, h: number): [number, number] {
  if (w === 0 || h === 0) return [0, 0];
  const divisor = gcd(Math.round(w), Math.round(h));
  return [Math.round(w) / divisor, Math.round(h) / divisor];
}

function formatNumber(num: number): string {
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(2).replace(/\.?0+$/, "");
}

export function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState<number>(16);
  const [ratioH, setRatioH] = useState<number>(9);
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [unit, setUnit] = useState<string>("px");
  const [lockWidth, setLockWidth] = useState(false);
  const [lockHeight, setLockHeight] = useState(false);
  const [activeTab, setActiveTab] = useState<"preset" | "custom" | "image">("preset");
  const [selectedPreset, setSelectedPreset] = useState<string>("16:9 Widescreen");
  const [copied, setCopied] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{w: number, h: number} | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [scalingMode, setScalingMode] = useState<"fit" | "fill" | "stretch">("fit");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUnit = UNITS.find(u => u.value === unit) || UNITS[0];
  const simplified = simplifyRatio(ratioW, ratioH);
  const aspectRatio = ratioW / ratioH;
  const orientation = aspectRatio > 1 ? "Landscape" : aspectRatio < 1 ? "Portrait" : "Square";

  const handleRatioChange = (w: number, h: number) => {
    setRatioW(w);
    setRatioH(h);
    if (lockWidth && width > 0) {
      setHeight(width / (w / h));
    } else if (lockHeight && height > 0) {
      setWidth(height * (w / h));
    } else if (width > 0) {
      setHeight(width / (w / h));
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (!lockHeight && ratioH > 0) {
      setHeight(val * (ratioH / ratioW));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (!lockWidth && ratioW > 0) {
      setWidth(val * (ratioW / ratioH));
    }
  };

  const handlePresetSelect = (preset: PresetRatio) => {
    setSelectedPreset(preset.name);
    setRatioW(preset.ratio[0]);
    setRatioH(preset.ratio[1]);
    setWidth(preset.commonResolutions[0] ? parseInt(preset.commonResolutions[0].split("×")[0]) : 1920);
    setHeight(preset.commonResolutions[0] ? parseInt(preset.commonResolutions[0].split("×")[1]) : 1080);
    setShowPresets(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(event.target?.result as string);
        setImageDimensions({ w: img.width, h: img.height });
        setRatioW(img.width);
        setRatioH(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setActiveTab("image");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (format: "plain" | "css" | "html" = "plain") => {
    let text = "";
    const w = formatNumber(width);
    const h = formatNumber(height);
    
    switch (format) {
      case "css":
        text = `aspect-ratio: ${ratioW} / ${ratioH};\nwidth: ${w}${unit};\nheight: ${h}${unit};`;
        break;
      case "html":
        text = `<img src="image.jpg" width="${Math.round(width)}" height="${Math.round(height)}" alt="Description" />`;
        break;
      default:
        text = `${w} × ${h} ${unit}`;
    }
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setRatioW(16);
    setRatioH(9);
    setWidth(1920);
    setHeight(1080);
    setUnit("px");
    setLockWidth(false);
    setLockHeight(false);
    setUploadedImage(null);
    setImageDimensions(null);
    setSelectedPreset("16:9 Widescreen");
    setScalingMode("fit");
  };

  const previewMaxW = 400;
  const previewMaxH = 300;
  let previewW: number, previewH: number;
  
  if (aspectRatio > previewMaxW / previewMaxH) {
    previewW = previewMaxW;
    previewH = previewMaxW / aspectRatio;
  } else {
    previewH = previewMaxH;
    previewW = previewMaxH * aspectRatio;
  }

  const categories = [...new Set(PRESETS.map(p => p.category))];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Calculator Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 rounded-t-2xl overflow-x-auto">
          <div className="flex min-w-full">
            {[
              { id: "preset", label: "Presets", icon: <Monitor className="w-4 h-4" /> },
              { id: "custom", label: "Custom", icon: <Maximize2 className="w-4 h-4" /> },
              { id: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-blue-600 bg-white"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-5 md:p-8">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Inputs */}
            <div className="space-y-4 sm:space-y-6">
              {/* Preset Selector */}
              {activeTab === "preset" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Select Preset Ratio
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowPresets(!showPresets)}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-3 bg-white border border-slate-300 rounded-lg hover:border-blue-400 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0">
                          {PRESETS.find(p => p.name === selectedPreset)?.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 text-sm sm:text-base truncate">{selectedPreset}</div>
                          <div className="text-[10px] sm:text-xs text-slate-500 truncate">
                            {PRESETS.find(p => p.name === selectedPreset)?.description}
                          </div>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${showPresets ? "rotate-180" : ""}`} />
                    </button>
                    
                    {showPresets && (
                      <div className="absolute z-[9999] w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
                        {categories.map(category => (
                          <div key={category}>
                            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                              {category}
                            </div>
                            {PRESETS.filter(p => p.category === category).map(preset => (
                              <button
                                key={preset.name}
                                onClick={() => handlePresetSelect(preset)}
                                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left ${
                                  selectedPreset === preset.name ? "bg-blue-50 border-l-2 border-blue-600" : ""
                                }`}
                              >
                                <div className="mt-0.5 text-slate-400">{preset.icon}</div>
                                <div className="flex-1">
                                  <div className="font-medium text-slate-900 text-sm">{preset.name}</div>
                                  <div className="text-xs text-slate-500 mt-0.5">{preset.description}</div>
                                  <div className="flex gap-2 mt-1.5">
                                    {preset.commonResolutions.slice(0, 2).map(res => (
                                      <span key={res} className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                                        {res}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Custom Ratio Inputs */}
              {activeTab === "custom" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Enter Custom Ratio
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={ratioW || ""}
                        onChange={(e) => handleRatioChange(Number(e.target.value), ratioH)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-mono"
                        placeholder="Width"
                        min="1"
                      />
                    </div>
                    <span className="text-2xl font-bold text-slate-400">:</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={ratioH || ""}
                        onChange={(e) => handleRatioChange(ratioW, Number(e.target.value))}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-lg font-mono"
                        placeholder="Height"
                        min="1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              {activeTab === "image" && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Upload Image to Detect Ratio
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-5 sm:p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    {uploadedImage ? (
                      <div className="relative">
                        <img 
                          src={uploadedImage} 
                          alt="Uploaded" 
                          className="max-h-48 mx-auto rounded-lg object-contain"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setUploadedImage(null);
                            setImageDimensions(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {imageDimensions && (
                          <div className="mt-2 text-sm text-slate-600">
                            Detected: {imageDimensions.w} × {imageDimensions.h} pixels
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-10 h-10 mx-auto text-slate-400" />
                        <p className="text-slate-600 font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-slate-400">JPG, PNG, WEBP, GIF up to 10MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-700">Dimensions</label>
                  <select
                    value={unit}
                    onChange={(e) => {
                      const newUnit = UNITS.find(u => u.value === e.target.value)!;
                      const factor = newUnit.factor / currentUnit.factor;
                      setWidth(width * factor);
                      setHeight(height * factor);
                      setUnit(e.target.value);
                    }}
                    className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {UNITS.map(u => (
                      <option key={u.value} value={u.value}>{u.label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Width</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formatNumber(width)}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm sm:text-base"
                        min="1"
                        step="any"
                      />
                      <button
                        onClick={() => {
                          setLockWidth(!lockWidth);
                          if (!lockWidth) setLockHeight(false);
                        }}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                          lockWidth ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                        title={lockWidth ? "Unlock width" : "Lock width"}
                      >
                        {lockWidth ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Height</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formatNumber(height)}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm sm:text-base"
                        min="1"
                        step="any"
                      />
                      <button
                        onClick={() => {
                          setLockHeight(!lockHeight);
                          if (!lockHeight) setLockWidth(false);
                        }}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                          lockHeight ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600"
                        }`}
                        title={lockHeight ? "Unlock height" : "Lock height"}
                      >
                        {lockHeight ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Summary */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Simplified Ratio</span>
                  <span className="font-mono font-bold text-slate-900 text-lg">
                    {simplified[0]}:{simplified[1]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Orientation</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    orientation === "Landscape" ? "bg-green-100 text-green-700" :
                    orientation === "Portrait" ? "bg-blue-100 text-blue-700" :
                    "bg-purple-100 text-purple-700"
                  }`}>
                    {orientation}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Aspect Ratio Value</span>
                  <span className="font-mono text-slate-900">{aspectRatio.toFixed(4)}</span>
                </div>
                {unit === "px" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Pixels</span>
                    <span className="font-mono text-slate-900">
                      {(width * height).toLocaleString()} ({((width * height) / 1000000).toFixed(2)} MP)
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard("plain")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() => copyToClipboard("css")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  CSS
                </button>
                <button
                  onClick={() => copyToClipboard("html")}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
                >
                  HTML
                </button>
                <button
                  onClick={reset}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm sm:ml-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>

            {/* Right Column - Visual Preview */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Live Preview</h3>
                <select
                  value={scalingMode}
                  onChange={(e) => setScalingMode(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="fit">Fit</option>
                  <option value="fill">Fill</option>
                  <option value="stretch">Stretch</option>
                </select>
              </div>

              {/* Preview Box — labels are INSIDE, no overflow */}
              <div className="bg-slate-100 rounded-xl flex flex-col items-center justify-center gap-2 p-4 min-h-[200px] sm:min-h-[280px]">
                {/* Width label above */}
                <div className="text-[10px] sm:text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border shadow-sm">
                  {formatNumber(width)} {unit} wide
                </div>
                <div className="flex items-center gap-2 w-full justify-center">
                  {/* Height label left */}
                  <div className="text-[10px] sm:text-xs font-mono text-slate-500 bg-white px-1.5 py-0.5 rounded border shadow-sm writing-vertical-lr rotate-180 whitespace-nowrap hidden xs:block">
                    {formatNumber(height)} {unit}
                  </div>
                  <div
                    className="relative bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg shadow-xl flex items-center justify-center transition-all duration-300"
                    style={{
                      width: `${Math.min(previewW, 280)}px`,
                      height: `${Math.min(previewH, 210)}px`,
                      maxWidth: "100%",
                    }}
                  >
                    {uploadedImage && scalingMode !== "stretch" ? (
                      <img
                        src={uploadedImage}
                        alt="Preview"
                        className={`w-full h-full rounded-lg ${
                          scalingMode === "fit" ? "object-contain" : "object-cover"
                        }`}
                      />
                    ) : (
                      <div className="text-white text-center p-2">
                        <div className="text-lg sm:text-2xl font-bold font-mono">
                          {simplified[0]}:{simplified[1]}
                        </div>
                        <div className="text-xs sm:text-sm opacity-80 mt-1">
                          {formatNumber(width)} × {formatNumber(height)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Height label below on xs */}
                <div className="text-[10px] sm:text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border shadow-sm xs:hidden">
                  {formatNumber(height)} {unit} tall
                </div>
              </div>

              {/* Common Resolutions for Selected Ratio */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Common Resolutions</h4>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.find(p => p.name === selectedPreset)?.commonResolutions.map(res => {
                    const [w, h] = res.split("×").map(Number);
                    return (
                      <button
                        key={res}
                        onClick={() => {
                          setWidth(w);
                          setHeight(h);
                        }}
                        className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors text-slate-600 font-mono"
                      >
                        {res}
                      </button>
                    );
                  }) || ["1920×1080", "1280×720", "2560×1440", "3840×2160"].map(res => (
                    <button
                      key={res}
                      onClick={() => {
                        const [w, h] = res.split("×").map(Number);
                        setWidth(w);
                        setHeight(h);
                      }}
                      className="text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors text-slate-600 font-mono"
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Pro Tip</h4>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Lock one dimension (width or height) to automatically calculate the other while maintaining your selected ratio. 
                      This is perfect when you need content to fit a specific container size.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg border border-slate-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Quick Reference: All Preset Ratios</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-3 sm:px-6 py-3 text-left font-semibold text-slate-700">Ratio</th>
                <th className="px-3 sm:px-6 py-3 text-left font-semibold text-slate-700 hidden sm:table-cell">Category</th>
                <th className="px-3 sm:px-6 py-3 text-left font-semibold text-slate-700">Common Use</th>
                <th className="px-3 sm:px-6 py-3 text-left font-semibold text-slate-700 hidden lg:table-cell">Popular Resolutions</th>
                <th className="px-3 sm:px-6 py-3 text-left font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PRESETS.map((preset) => (
                <tr key={preset.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 sm:w-8 h-4 sm:h-5 border-2 border-slate-400 rounded-sm flex-shrink-0" style={{
                        aspectRatio: `${preset.ratio[0]}/${preset.ratio[1]}`
                      }} />
                      <span className="font-mono font-medium text-slate-900 text-xs sm:text-sm">
                        {preset.ratio[0]}:{preset.ratio[1]}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 text-slate-600 hidden sm:table-cell">{preset.category}</td>
                  <td className="px-3 sm:px-6 py-4 text-slate-600 text-xs sm:text-sm">{preset.description}</td>
                  <td className="px-3 sm:px-6 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {preset.commonResolutions.map(res => (
                        <span key={res} className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono">
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4">
                    <button
                      onClick={() => handlePresetSelect(preset)}
                      className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors whitespace-nowrap"
                    >
                      Use
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
