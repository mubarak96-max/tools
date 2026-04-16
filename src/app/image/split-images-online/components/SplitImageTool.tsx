"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, Grid3X3, Download, Trash2, LayoutGrid, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

export function SplitImageTool() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tiles, setTiles] = useState<string[]>([]);
  const [isSplitting, setIsSplitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name.split(".")[0]);
      const reader = new FileReader();
      reader.onload = (event) => setImage(event.target?.result as string);
      reader.readAsDataURL(file);
      setTiles([]);
      setIsDone(false);
    }
  };

  const splitImage = useCallback(() => {
    if (!image) return;
    setIsSplitting(true);
    setTiles([]);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = image;

    img.onload = () => {
      const tileWidth = img.width / cols;
      const tileHeight = img.height / rows;
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const newTiles: string[] = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          canvas.width = tileWidth;
          canvas.height = tileHeight;
          ctx?.drawImage(
            img,
            c * tileWidth, r * tileHeight, tileWidth, tileHeight,
            0, 0, tileWidth, tileHeight
          );
          newTiles.push(canvas.toDataURL("image/png"));
        }
      }

      setTiles(newTiles);
      setIsSplitting(false);
      setIsDone(true);
    };
  }, [image, rows, cols]);

  const downloadAll = async () => {
    // In a real production app with many tiles, we might use JSZip
    // For this demonstration, we'll trigger multiple downloads
    tiles.forEach((dataUrl, idx) => {
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}_tile_${idx + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const clear = () => {
    setImage(null);
    setTiles([]);
    setIsDone(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
        
        {/* Controls Panel */}
        <div className="space-y-8">
          <div className="p-8 rounded-[2.5rem] bg-muted/5 border border-border/50 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" /> 1. Upload Image
            </h3>
            
            {!image ? (
              <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-[2rem] bg-background hover:bg-muted/10 transition-all cursor-pointer group">
                <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors mb-4" />
                <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Drop Image Here</span>
                <span className="text-[10px] text-muted-foreground mt-2 opacity-60">PNG, JPG, WEBP</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </label>
            ) : (
              <div className="relative rounded-[2rem] overflow-hidden border border-border ring-4 ring-muted/20">
                <img src={image} alt="Preview" className="w-full aspect-video object-cover" />
                <button onClick={clear} className="absolute top-4 right-4 p-3 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="p-8 rounded-[2.5rem] bg-muted/5 border border-border/50 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-primary" /> 2. Grid Settings
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Rows</label>
                <div className="flex items-center gap-2 bg-background border-2 border-border rounded-2xl p-2">
                  <button onClick={() => setRows(Math.max(1, rows - 1))} className="p-2 rounded-xl hover:bg-muted/50 transition-all"><ChevronDown className="w-4 h-4" /></button>
                  <span className="flex-1 text-center font-black text-xl italic">{rows}</span>
                  <button onClick={() => setRows(Math.min(10, rows + 1))} className="p-2 rounded-xl hover:bg-muted/50 transition-all"><ChevronUp className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Columns</label>
                <div className="flex items-center gap-2 bg-background border-2 border-border rounded-2xl p-2">
                  <button onClick={() => setCols(Math.max(1, cols - 1))} className="p-2 rounded-xl hover:bg-muted/50 transition-all"><ChevronDown className="w-4 h-4" /></button>
                  <span className="flex-1 text-center font-black text-xl italic">{cols}</span>
                  <button onClick={() => setCols(Math.min(10, cols + 1))} className="p-2 rounded-xl hover:bg-muted/50 transition-all"><ChevronUp className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            <button
              onClick={splitImage}
              disabled={!image || isSplitting}
              className="w-full py-5 rounded-full bg-foreground text-background font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              {isSplitting ? "Splitting..." : "Split Image Now"}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-muted/5 rounded-[3rem] border border-border/50 p-8 flex flex-col justify-center items-center relative overflow-hidden">
          {!isDone ? (
            <div className="text-center space-y-6 max-w-sm">
              <div className="relative mx-auto w-24 h-24">
                <Grid3X3 className="w-24 h-24 text-muted-foreground/20" />
                <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                  <CheckCircle2 className="w-8 h-8 text-primary/40" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-black italic text-foreground">Split Preview</h4>
                <p className="text-sm text-muted-foreground mt-2">Upload an image and choose your grid size to see the generated tiles here.</p>
              </div>
            </div>
          ) : (
            <div className="w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center">
                <h4 className="text-2xl font-black italic tracking-tighter text-foreground">Tiles Ready ({tiles.length})</h4>
                <p className="text-sm text-muted-foreground mt-1">Images have been cut to perfect {rows}x{cols} dimensions.</p>
              </div>

              <div 
                className="grid gap-2 border-4 border-muted/20 bg-muted/10 p-2 rounded-2xl"
                style={{ 
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  gridTemplateRows: `repeat(${rows}, 1fr)`
                }}
              >
                {tiles.map((tile, idx) => (
                  <div key={idx} className="aspect-square bg-white border border-border/50 overflow-hidden rounded-sm hover:scale-[1.05] transition-transform">
                    <img src={tile} alt={`Tile ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={downloadAll}
                  className="flex-1 py-4 rounded-full bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" /> Download All Tiles
                </button>
                <button
                  onClick={clear}
                  className="px-8 py-4 rounded-full bg-background border border-border text-foreground font-black uppercase tracking-widest text-xs hover:bg-muted/50 transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
