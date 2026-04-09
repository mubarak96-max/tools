"use client";

import { useRef, useState } from "react";
import Barcode from "react-barcode";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

export default function BarcodeGenerator() {
  const [value, setValue] = useState("123456789012");
  const [format, setFormat] = useState("CODE128");
  const [lineColor, setLineColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [displayValue, setDisplayValue] = useState(true);
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);

  const barcodeRef = useRef<HTMLDivElement>(null);

  // Different formats have different character restrictions.
  // We use CODE128 as default because it supports alphanumeric chars.
  
  const handleDownload = () => {
    if (!barcodeRef.current) return;
    
    // With `renderer="canvas"`, react-barcode renders a canvas inside our wrapper
    const canvas = barcodeRef.current.querySelector("canvas");
    if (!canvas) {
      alert("Could not generate barcode image. Please make sure your text is valid for this format.");
      return;
    }

    const link = document.createElement("a");
    link.download = `barcode-${format.toLowerCase()}-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_24rem]">
          {/* Inputs */}
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Barcode Data</span>
              <p className="text-xs text-muted-foreground">The text or numerical value you want to encode.</p>
              <input
                type="text"
                placeholder="123456789012"
                value={value}
                onChange={(e) => setValue(e.target.value.trim())}
                className={fieldClass}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Barcode Format</span>
              <p className="text-xs text-muted-foreground">Select the standard code format (UPC and EAN strictly require specific number lengths).</p>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className={`${fieldClass} appearance-none cursor-pointer`}
              >
                <option value="CODE128">CODE 128 (Most universal, alphanumeric)</option>
                <option value="CODE39">CODE 39 (Alphanumeric uppercase)</option>
                <option value="UPC">UPC (11-12 digits - Retail products)</option>
                <option value="EAN13">EAN-13 (12-13 digits - International retail)</option>
                <option value="EAN8">EAN-8 (7-8 digits)</option>
                <option value="ITF14">ITF-14 (14 digits - Shipping boxes)</option>
                <option value="MSI">MSI (Numbers only)</option>
                <option value="codabar">Codabar (Numbers and USD/-/:)</option>
              </select>
            </label>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Line Width</span>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Bar Height</span>
                <input
                  type="number"
                  min={30}
                  max={200}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className={fieldClass}
                />
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Line Color</span>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className="h-11 w-12 cursor-pointer appearance-none rounded-[0.5rem] border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={lineColor}
                    onChange={(e) => setLineColor(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Background Color</span>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="h-11 w-12 cursor-pointer appearance-none rounded-[0.5rem] border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </label>
            </div>
            
            <div className="flex flex-col justify-center pt-2">
              <label className="flex cursor-pointer items-center gap-3">
                <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={displayValue}
                    onChange={(e) => setDisplayValue(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border bg-background checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <svg
                    className="pointer-events-none absolute hidden h-3 w-3 text-white peer-checked:block"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">Show Text Value Below Barcode</span>
              </label>
            </div>
          </div>

          {/* Preview & Download */}
          <aside className="rounded-[1.5rem] border border-border bg-card p-5 xl:sticky xl:top-6 flex flex-col items-center justify-center h-fit">
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-6 w-full text-left">Live Preview</h3>
            
            <div 
              ref={barcodeRef} 
              className="w-full overflow-hidden rounded-[1rem] p-4 flex items-center justify-center bg-white shadow-sm border border-border/50 mb-6 min-h-[140px]"
            >
              {value ? (
                <Barcode
                  value={value}
                  format={format as any}
                  lineColor={lineColor}
                  background={background}
                  width={width}
                  height={height}
                  displayValue={displayValue}
                  margin={10}
                  renderer="canvas"
                />
              ) : (
                <span className="text-muted-foreground text-sm font-medium text-center">Type something to generate a barcode</span>
              )}
            </div>

            <button
              onClick={handleDownload}
              disabled={!value}
              className={`w-full py-3 px-4 rounded-[1rem] text-sm font-semibold transition-all ${
                !value 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg shadow-primary/25"
              }`}
            >
              Download PNG
            </button>
            <p className="text-center mt-4 text-xs text-muted-foreground w-full">
              Clicking download will save a high-resolution PNG image of your barcode.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
