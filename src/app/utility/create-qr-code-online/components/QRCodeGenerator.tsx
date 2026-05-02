"use client";

import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const fieldClass =
  "w-full rounded-[1rem] border border-border bg-background px-4 py-3 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-primary transition-shadow";

export default function QRCodeGenerator() {
  const [value, setValue] = useState("https://findbest.tools");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(true);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<"L" | "M" | "Q" | "H">("H");
  
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;
    
    // Find the canvas inside the ref
    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) return;

    // Create a temporary link to download the image
    const link = document.createElement("a");
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_22rem]">
          {/* Inputs */}
          <div className="space-y-6">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">Content (URL or Text)</span>
              <p className="text-xs text-muted-foreground">Type or paste the web address, text, or contact info.</p>
              <textarea
                rows={3}
                placeholder="https://example.com"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={fieldClass}
                style={{ resize: "none" }}
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Foreground Color</span>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-11 w-12 cursor-pointer appearance-none rounded-[0.5rem] border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Background Color</span>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-11 w-12 cursor-pointer appearance-none rounded-[0.5rem] border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className={fieldClass}
                  />
                </div>
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-foreground">Error Correction</span>
                <p className="text-xs text-muted-foreground">Higher levels make the code denser but more durable.</p>
                <select
                  value={errorCorrectionLevel}
                  onChange={(e) => setErrorCorrectionLevel(e.target.value as any)}
                  className={`${fieldClass} appearance-none cursor-pointer`}
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30% - Best)</option>
                </select>
              </label>
              
              <div className="flex flex-col justify-center pt-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                    <input
                      type="checkbox"
                      checked={margin}
                      onChange={(e) => setMargin(e.target.checked)}
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
                  <span className="text-sm font-medium text-foreground">Include Quiet Zone Margin</span>
                </label>
              </div>
            </div>
          </div>

          {/* Preview & Download */}
          <aside className="rounded-[1.5rem] border border-border bg-card p-5 xl:sticky xl:top-6 flex flex-col items-center justify-center h-fit">
            <h3 className="text-base font-semibold text-foreground tracking-tight mb-6 w-full text-left">Live Preview</h3>
            
            <div 
              ref={qrRef} 
              className="rounded-[1rem] p-4 flex items-center justify-center bg-white shadow-sm border border-border/50 mb-6"
            >
              <QRCodeCanvas
                value={value || "https://findbest.tools"}
                size={220}
                fgColor={fgColor}
                bgColor={bgColor}
                includeMargin={margin}
                level={errorCorrectionLevel}
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-[1rem] text-sm font-semibold transition-all bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-lg shadow-primary/25"
            >
              Download PNG
            </button>
            <p className="text-center mt-4 text-xs text-muted-foreground w-full">
              Clicking download will save a high-resolution PNG image of your QR Code.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
