"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, Minus, Ruler, Download, Layout, 
  Trash2, Info, ShoppingCart, TrendingUp, Sparkles, Check, Truck, Weight
} from "lucide-react";

interface LandscapeArea {
  id: string;
  name: string;
  length: number;
  width: number;
  depth: number;
}

const MATERIALS = [
  { id: "pea-gravel", name: "Pea Gravel", density: 2800, color: "#94a3b8", price: 45.00 },
  { id: "crushed-stone", name: "Crushed Stone (#57)", density: 2950, color: "#64748b", price: 38.00 },
  { id: "river-rock", name: "River Rock (Large)", density: 3000, color: "#475569", price: 65.00 },
  { id: "topsoil", name: "Screened Topsoil", density: 2200, color: "#451a03", price: 32.00 },
  { id: "mulch-brown", name: "Shredded Mulch (Brown)", density: 800, color: "#78350f", price: 28.00 },
  { id: "mulch-black", name: "Shredded Mulch (Black)", density: 800, color: "#1c1917", price: 30.00 },
  { id: "sand", name: "Sharp Sand (Concrete)", density: 2700, color: "#fde047", price: 35.00 },
];

export function GravelMulchVolumeCalculator() {
  const [areas, setAreas] = useState<LandscapeArea[]>([
    { id: "1", name: "Main Garden Bed", length: 10, width: 8, depth: 3 }
  ]);
  const [selectedMaterialId, setSelectedMaterialId] = useState("mulch-brown");
  const [waste, setWaste] = useState(10);
  const [deliveryFee, setDeliveryFee] = useState(75.00);

  const selectedMaterial = MATERIALS.find(m => m.id === selectedMaterialId) || MATERIALS[0];

  const totals = useMemo(() => {
    let totalCubicFeet = 0;
    areas.forEach(area => {
      totalCubicFeet += area.length * area.width * (area.depth / 12);
    });

    const cubicYards = totalCubicFeet / 27;
    const withWaste = cubicYards * (1 + waste / 100);
    const weightLbs = withWaste * selectedMaterial.density;
    const weightTons = weightLbs / 2000;
    const cost = withWaste * selectedMaterial.price;

    return {
      cubicYards: withWaste,
      weightTons,
      cost,
      totalCost: cost + deliveryFee
    };
  }, [areas, waste, selectedMaterial, deliveryFee]);

  const addArea = () => {
    setAreas([...areas, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: `Area ${areas.length + 1}`, 
      length: 10, 
      width: 10, 
      depth: 3 
    }]);
  };

  const updateArea = (id: string, field: keyof LandscapeArea, value: any) => {
    setAreas(areas.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeArea = (id: string) => {
    if (areas.length > 1) {
      setAreas(areas.filter(a => a.id !== id));
    }
  };

  const exportPDF = async () => {
    const { jsPDF } = await import("jspdf/dist/jspdf.es.min.js");
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Landscaping Material Estimate", 20, 30);
    doc.setFontSize(12);
    doc.text(`Material: ${selectedMaterial.name}`, 20, 45);
    doc.text(`Total Volume: ${totals.cubicYards.toFixed(2)} Cubic Yards`, 20, 52);
    doc.text(`Total Weight: ${totals.weightTons.toFixed(2)} Tons`, 20, 59);
    doc.text(`Estimated Cost: $${totals.totalCost.toFixed(2)}`, 20, 66);
    doc.save("landscape-estimate.pdf");
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="grid lg:grid-cols-[1fr_400px] gap-0 border border-border rounded-[3rem] overflow-hidden bg-background shadow-2xl">
        {/* Main Workspace */}
        <div className="p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary" />
              Project Areas
            </h3>
            <button 
              onClick={addArea}
              className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-3 h-3" /> Add Section
            </button>
          </div>

          <div className="space-y-6">
            {areas.map((area, idx) => (
              <div key={area.id} className="p-8 rounded-[2.5rem] bg-muted/5 border border-border group relative transition-all hover:bg-muted/10">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex-1 min-w-[200px] space-y-2">
                    <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">Area Name</span>
                    <input 
                      value={area.name} onChange={(e) => updateArea(area.id, "name", e.target.value)}
                      className="w-full bg-transparent font-black text-xl italic tracking-tighter outline-none text-foreground border-b border-transparent focus:border-primary/30"
                    />
                  </div>
                  <div className="flex flex-wrap gap-8">
                    <AreaInput label="Length (ft)" value={area.length} onChange={(v) => updateArea(area.id, "length", v)} />
                    <AreaInput label="Width (ft)" value={area.width} onChange={(v) => updateArea(area.id, "width", v)} />
                    <AreaInput label="Depth (in)" value={area.depth} onChange={(v) => updateArea(area.id, "depth", v)} />
                  </div>
                  <button 
                    onClick={() => removeArea(area.id)}
                    className="p-3 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-border">
             <div className="grid sm:grid-cols-2 gap-10">
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <Sparkles className="w-3 h-3 text-primary" /> Select Material
                   </h4>
                   <div className="grid grid-cols-2 gap-3">
                      {MATERIALS.map(m => (
                        <button 
                          key={m.id}
                          onClick={() => setSelectedMaterialId(m.id)}
                          className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${selectedMaterialId === m.id ? "bg-foreground text-background border-foreground shadow-lg scale-[1.02]" : "bg-muted/5 border-border hover:border-primary/50 text-muted-foreground"}`}
                        >
                          <div className="w-4 h-4 rounded-full border border-current shadow-inner" style={{ backgroundColor: m.color }} />
                          <p className="text-[10px] font-black leading-tight uppercase tracking-tighter">{m.name}</p>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-8">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Adjustments</h4>
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-baseline px-1">
                          <span className="text-[10px] font-black uppercase text-muted-foreground">Waste & Settlement Factor</span>
                          <span className="text-sm font-black italic">{waste}%</span>
                        </div>
                        <input 
                          type="range" min={0} max={30} value={waste} onChange={(e) => setWaste(Number(e.target.value))}
                          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">Delivery Fee</span>
                            <div className="relative">
                               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                               <input 
                                 type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value))}
                                 className="w-full pl-8 pr-4 py-3 rounded-2xl bg-muted/10 border border-border font-black text-sm outline-none"
                               />
                            </div>
                         </div>
                         <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-muted-foreground ml-1">Price per Yard</span>
                            <div className="relative">
                               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                               <input 
                                 type="number" value={selectedMaterial.price} readOnly
                                 className="w-full pl-8 pr-4 py-3 rounded-2xl bg-muted/10 border border-border font-black text-sm outline-none opacity-50"
                               />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="p-6 sm:p-10 bg-muted/10 space-y-10">
          <div className="space-y-6">
             <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-2">Volume Analysis</h3>
             
             <div className="p-10 rounded-[3rem] bg-foreground text-background shadow-2xl space-y-2 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <span className="text-[10px] font-black uppercase opacity-60 tracking-widest italic flex items-center gap-2">
                  <Truck className="w-3 h-3" /> Total Volume
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black italic tracking-tighter">{totals.cubicYards.toFixed(2)}</span>
                  <span className="text-xl font-bold uppercase opacity-50">Yards³</span>
                </div>
             </div>

             <div className="grid gap-4">
                <ResultItem 
                  label="Estimated Weight" 
                  value={totals.weightTons.toFixed(2)} 
                  unit="Tons (US)" 
                  icon={<Weight className="w-5 h-5" />}
                  subtext={`~${(totals.weightTons * 2000).toLocaleString()} lbs`}
                />
                <ResultItem 
                  label="Surface Coverage" 
                  value={areas.reduce((acc, a) => acc + a.length * a.width, 0)} 
                  unit="Sq Ft" 
                  icon={<Ruler className="w-5 h-5" />}
                  subtext={`Averaging ${Math.round(areas.reduce((acc, a) => acc + a.depth, 0) / areas.length)}" depth`}
                />
             </div>
          </div>

          <div className="pt-8 border-t border-border space-y-8">
             <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <span className="text-[10px] font-black uppercase text-muted-foreground">Material Cost</span>
                   <span className="font-bold">${totals.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                   <span className="text-[10px] font-black uppercase text-muted-foreground">Delivery</span>
                   <span className="font-bold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between items-center px-2">
                   <span className="text-lg font-black italic tracking-tighter text-foreground">Total Project</span>
                   <span className="text-2xl font-black text-primary">${totals.totalCost.toFixed(2)}</span>
                </div>
             </div>

             <button 
                onClick={exportPDF}
                className="w-full py-5 rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <Download className="w-5 h-5" /> Download Estimate
             </button>

             <p className="text-[10px] text-muted-foreground text-center italic opacity-60">
               *Calculation accounts for {waste}% material expansion/waste. Prices are local estimates.
             </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase text-muted-foreground block text-center">{label}</span>
      <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1 px-3">
         <input 
           type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
           className="w-12 bg-transparent font-black text-sm text-center outline-none no-spinner"
         />
      </div>
    </div>
  );
}

function ResultItem({ label, value, unit, icon, subtext }: { label: string, value: string | number, unit: string, icon: React.ReactNode, subtext?: string }) {
  return (
    <div className="p-6 rounded-[2.5rem] bg-background border border-border flex items-center gap-6 group hover:shadow-xl transition-all">
       <div className="w-14 h-14 rounded-2xl bg-muted/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-all">
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-black italic tracking-tighter">{value}</span>
             <span className="text-[10px] font-black uppercase text-muted-foreground">{unit}</span>
          </div>
          {subtext && <p className="text-[10px] text-muted-foreground italic font-semibold">{subtext}</p>}
       </div>
    </div>
  );
}
