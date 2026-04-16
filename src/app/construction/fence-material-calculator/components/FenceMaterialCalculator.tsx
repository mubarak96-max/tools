"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, Minus, Ruler, Download, Layout, 
  Trash2, Info, ShoppingCart, TrendingUp, Sparkles, Check, Home, Layers,
  Box, Shield, GripVertical
} from "lucide-react";

const FENCE_TYPES = [
  { id: "privacy", name: "Privacy (Solid)", ratio: 1, rails: 3, icon: <Shield className="w-4 h-4" /> },
  { id: "shadowbox", name: "Shadowbox", ratio: 1.7, rails: 3, icon: <Layers className="w-4 h-4" /> },
  { id: "picket", name: "Spaced Picket", ratio: 0.8, rails: 2, icon: <GripVertical className="w-4 h-4" /> },
  { id: "postrail", name: "Post & Rail", ratio: 0.3, rails: 2, icon: <Box className="w-4 h-4" /> },
];

export function FenceMaterialCalculator() {
  const [length, setLength] = useState(100);
  const [height, setHeight] = useState(6);
  const [postSpacing, setPostSpacing] = useState(8);
  const [picketWidth, setPicketWidth] = useState(5.5);
  const [picketGap, setPicketGap] = useState(0);
  const [selectedType, setSelectedType] = useState("privacy");
  const [pricePerPost, setPricePerPost] = useState(18.00);
  const [pricePerPicket, setPricePerPicket] = useState(3.50);
  const [pricePerRail, setPricePerRail] = useState(12.00);

  const type = FENCE_TYPES.find(t => t.id === selectedType) || FENCE_TYPES[0];

  const results = useMemo(() => {
    const postCount = Math.ceil(length / postSpacing) + 1;
    const railsPerSpan = height > 5 ? 3 : 2;
    const railCount = (postCount - 1) * railsPerSpan;
    
    // Picket calculation
    const picketCoverage = picketWidth + picketGap;
    let picketCount = 0;
    if (selectedType !== "postrail") {
      const lengthInches = length * 12;
      picketCount = Math.ceil(lengthInches / picketCoverage) * type.ratio;
    }

    const matCost = (postCount * pricePerPost) + (railCount * pricePerRail) + (picketCount * pricePerPicket);
    const concreteBags = postCount * 1.5;

    return {
      postCount,
      railCount: Math.ceil(railCount),
      picketCount: Math.ceil(picketCount),
      concreteBags: Math.ceil(concreteBags),
      materialCost: matCost,
      totalCost: matCost + (Math.ceil(concreteBags) * 6.00) // $6 per bag concrete
    };
  }, [length, height, postSpacing, picketWidth, picketGap, selectedType, pricePerPost, pricePerPicket, pricePerRail, type]);

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Fence Material Shopping List", 20, 30);
    doc.setFontSize(12);
    doc.text(`Style: ${type.name}`, 20, 45);
    doc.text(`Length: ${length}ft | Height: ${height}ft`, 20, 52);
    doc.text(`-------------------------------------------`, 20, 59);
    doc.text(`1. Posts (4x4 PT): ${results.postCount}`, 20, 70);
    doc.text(`2. Rails (2x4 PT): ${results.railCount}`, 20, 77);
    doc.text(`3. Pickets: ${results.picketCount}`, 20, 84);
    doc.text(`4. Concrete Bags (80lb): ${results.concreteBags}`, 20, 91);
    doc.text(`-------------------------------------------`, 20, 98);
    doc.text(`Estimated Total Cost: $${results.totalCost.toFixed(2)}`, 20, 105);
    doc.save("fence-material-list.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Workspace */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary" />
              Dimensions & Spacing
            </h3>
          </div>

          <div className="grid gap-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
               <InputBlock label="Total Length" value={length} unit="ft" min={1} max={5000} onChange={setLength} />
               <InputBlock label="Fence Height" value={height} unit="ft" min={1} max={12} onChange={setHeight} />
               <InputBlock label="Post Spacing" value={postSpacing} unit="ft" min={4} max={12} onChange={setPostSpacing} />
            </div>

            <div className="pt-10 border-t border-border">
               <div className="grid sm:grid-cols-2 gap-10">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Fence Style</h4>
                     <div className="grid grid-cols-2 gap-3">
                        {FENCE_TYPES.map(t => (
                          <button 
                            key={t.id}
                            onClick={() => setSelectedType(t.id)}
                            className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${selectedType === t.id ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" : "bg-muted/5 border-border hover:border-primary/50 text-muted-foreground"}`}
                          >
                            <div className="flex items-center gap-2 text-primary">
                               {t.icon}
                               <span className="text-[10px] font-black tracking-widest uppercase">{t.id}</span>
                            </div>
                            <p className="text-xs font-bold leading-tight line-clamp-1">{t.name}</p>
                          </button>
                        ))}
                     </div>
                  </div>

                  {selectedType !== "postrail" && (
                    <div className="space-y-6">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Picket Specifications</h4>
                       <div className="grid grid-cols-2 gap-6">
                          <InputBlock label="Picket Width" value={picketWidth} unit="in" min={1} max={10} onChange={setPicketWidth} />
                          <InputBlock label="Gap Between" value={picketGap} unit="in" min={0} max={6} onChange={setPicketGap} />
                       </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="pt-10 border-t border-border space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">Unit Pricing Adjustment</h4>
               <div className="grid sm:grid-cols-3 gap-6">
                  <PriceInput label="Post (ea)" value={pricePerPost} onChange={setPricePerPost} />
                  <PriceInput label="Rail (ea)" value={pricePerRail} onChange={setPricePerRail} />
                  <PriceInput label="Picket (ea)" value={pricePerPicket} onChange={setPricePerPicket} />
               </div>
            </div>
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10 group">
          <div className="space-y-6">
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Material Summary</h3>
             
             <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-2xl relative overflow-hidden transition-all group-hover:shadow-primary/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest italic">Est. Total Cost</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black italic tracking-tighter">${results.totalCost.toFixed(2)}</span>
                </div>
             </div>

             <div className="grid gap-3">
                <MaterialRow label="Vertical Posts" value={results.postCount} unit="Pieces" icon={<GripVertical className="w-4 h-4" />} />
                <MaterialRow label="Horizontal Rails" value={results.railCount} unit="Pieces" icon={<Box className="w-4 h-4" />} />
                <MaterialRow label="Facade Pickets" value={results.picketCount} unit="Boards" icon={<Layers className="w-4 h-4" />} />
                <MaterialRow label="Concrete Mix" value={results.concreteBags} unit="Bags" icon={<Check className="w-4 h-4" />} />
             </div>
          </div>

          <div className="pt-8 border-t border-border space-y-8">
             <div className="p-6 rounded-[2rem] border border-primary/20 bg-primary/5 space-y-4">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase text-primary tracking-widest italic shadow-sm">Blueprint Scale</span>
                   <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="aspect-video bg-background/50 rounded-2xl border border-primary/10 relative overflow-hidden flex items-end">
                   <FenceVisualizer type={selectedType} count={8} />
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Export Material List
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputBlock({ label, value, unit, min, max, onChange }: { label: string, value: number, unit: string, min: number, max: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase text-muted-foreground block px-1 tracking-tighter">{label}</span>
      <div className="flex items-center gap-3 bg-muted/10 border border-border rounded-2xl p-1 px-4 focus-within:border-primary/30 transition-all">
         <input 
           type="number" value={value} min={min} max={max} onChange={(e) => onChange(Number(e.target.value))}
           className="w-full bg-transparent font-black text-sm outline-none no-spinner py-2.5"
         />
         <span className="text-[10px] font-black uppercase text-muted-foreground opacity-50">{unit}</span>
      </div>
    </div>
  );
}

function PriceInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
       <span className="text-[8px] font-black uppercase text-muted-foreground ml-1">{label}</span>
       <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">$</span>
          <input 
            type="number" value={value} step={0.01} onChange={(e) => onChange(Number(e.target.value))}
            className="w-full pl-6 pr-3 py-2 rounded-xl bg-muted/5 border border-border/50 font-black text-xs outline-none"
          />
       </div>
    </div>
  );
}

function MaterialRow({ label, value, unit, icon }: { label: string, value: number, unit: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-background text-sm">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted/20 flex items-center justify-center text-primary">
           {icon}
        </div>
        <span className="font-bold text-foreground text-xs">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
         <span className="font-black italic text-primary">{value}</span>
         <span className="text-[8px] font-black uppercase text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}

function FenceVisualizer({ type, count }: { type: string, count: number }) {
  return (
    <div className="flex gap-1 items-end px-4 w-full h-full pb-2">
       {Array.from({ length: 12 }).map((_, i) => {
         const isPost = i % 4 === 0;
         if (isPost) {
           return <div key={i} className="w-1.5 h-[80%] bg-muted rounded-t-sm border-r border-background/20" />;
         }
         return (
           <div 
             key={i} 
             className={`flex-1 rounded-t-[1px] border-r border-background/10 transition-all ${type === "privacy" ? "h-[70%] bg-primary/40" : type === "picket" ? "h-[60%] bg-primary/30 mx-0.5" : type === "shadowbox" ? "h-[70%] bg-primary/50 shadow-inner" : "h-[10%] bg-primary/20 my-12"}`}
           />
         );
       })}
       <div className="absolute inset-x-0 top-[40%] h-1 bg-muted/20" />
       <div className="absolute inset-x-0 bottom-[30%] h-1 bg-muted/20" />
    </div>
  );
}
