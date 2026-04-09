"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FilePicker } from "@/components/image/shared";

export default function BarcodeScanner() {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "barcode-reader-container";

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.error("Error stopping camera", e);
      }
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(containerId);
      }
      setIsScanning(true);
      
      // We pass an empty configuration for supported formats to allow it to scan ALL barcodes, including UPC/EAN/CODE128.
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 300, height: 150 }, // Wider box for 1D barcodes
        },
        (decodedText) => {
          setScanResult(decodedText);
          stopCamera(); 
          setIsScanning(false);
        },
        (errorMessage) => {
          // Ignore routine scanning errors
        }
      );
    } catch (err: any) {
      setIsScanning(false);
      setCameraError(err?.message || "Failed to access camera. Please ensure camera permissions are granted.");
    }
  };

  useEffect(() => {
    if (activeTab === "camera") {
      setScanResult(null);
      startCamera();
    } else {
      stopCamera();
      setIsScanning(false);
    }

    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFileUpload = async (file: File) => {
    try {
      setScanResult(null);
      setCameraError(null);
      
      const html5QrCode = new Html5Qrcode(containerId);
      const result = await html5QrCode.scanFile(file, true);
      setScanResult(result);
    } catch (err) {
      setCameraError("Could not find a valid barcode in this image. Ensure the barcode runs horizontally and has high contrast.");
    }
  };

  const handleCopy = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      alert("Barcode value copied to clipboard!");
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setCameraError(null);
    if (activeTab === "camera") {
      startCamera();
    }
  };

  return (
    <div className="space-y-6">
      <section className="tool-frame p-4 sm:p-6">
        
        <div className="mx-auto flex w-full max-w-sm items-center rounded-[1rem] border border-border bg-muted/30 p-1 mb-8">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 rounded-[0.75rem] py-2.5 text-sm font-medium transition-colors ${
              activeTab === "camera" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Use Webcam / Phone
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 rounded-[0.75rem] py-2.5 text-sm font-medium transition-colors ${
              activeTab === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload Photo
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-2 max-w-6xl mx-auto">
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {activeTab === "camera" ? "1. Scan Barcode" : "1. Upload Barcode Photo"}
            </h2>
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-black min-h-[350px] flex items-center justify-center shadow-inner">
              
              {activeTab === "camera" ? (
                <>
                  {cameraError ? (
                    <div className="p-6 text-center text-white space-y-4 z-10 w-full">
                      <p className="text-red-400 font-medium">Camera Error</p>
                      <p className="text-sm">{cameraError}</p>
                      <button onClick={startCamera} className="mt-4 rounded-full bg-white/20 px-4 py-2 text-sm font-medium hover:bg-white/30 transition">
                        Retry Camera
                      </button>
                    </div>
                  ) : scanResult ? (
                    <div className="p-6 text-center text-white z-10 w-full space-y-4">
                       <p className="text-emerald-400 font-medium text-lg">Barcode Scanned!</p>
                       <button onClick={resetScanner} className="rounded-full bg-white/20 px-6 py-3 text-sm font-medium hover:bg-white/30 transition">
                        Scan Another Barcode
                      </button>
                    </div>
                  ) : null}
                  <div id={containerId} className={`w-full overflow-hidden ${scanResult ? 'hidden' : 'block'}`}></div>
                </>
              ) : (
                <div className="w-full h-full p-6 bg-card border-none flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <FilePicker
                      label="Select Barcode Photo"
                      accept="image/*"
                      onFile={handleFileUpload}
                    />
                    {cameraError && (
                      <p className="mt-4 text-center text-sm text-red-500 font-medium">{cameraError}</p>
                    )}
                  </div>
                  <div id={containerId} style={{ display: 'none' }}></div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 h-full flex flex-col">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">2. Details</h2>
            <div className="flex-1 rounded-[1.5rem] border border-border bg-card p-6 flex flex-col">
              
              {!scanResult ? (
                <div className="flex flex-1 items-center justify-center rounded-[1rem] border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Align the barcode horizontally inside the camera square, or upload an image to extract the numerical value.
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-between h-full">
                  <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-semibold text-emerald-600">Barcode Identifier</h3>
                    <div className="w-full rounded-[1rem] bg-muted/50 p-5 font-mono text-2xl text-center text-foreground shadow-inner border border-border/50">
                      {scanResult}
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-4">
                      You can use this sequence to look up product inventory or verify a UPC code.
                    </p>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={handleCopy}
                      className="w-full py-3 px-4 rounded-[1rem] bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-all"
                    >
                      Copy Numeric Value
                    </button>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(scanResult)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center mt-3 py-3 px-4 rounded-[1rem] bg-slate-50 text-slate-700 font-semibold border border-slate-200 hover:bg-slate-100 transition-all"
                    >
                      Search Product on Google
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
