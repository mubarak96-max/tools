"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

function FilePicker({
  label,
  accept,
  onFile,
}: {
  label: string;
  accept: string;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.currentTarget.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-[1.35rem] border border-dashed border-border bg-background/80 p-5 text-left transition hover:border-primary/25 hover:bg-primary-soft/30 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
        <span className="mt-1 block text-sm font-semibold text-foreground">Drop an image here or browse</span>
        <span className="mt-1 block text-xs text-muted-foreground">PNG, JPG, WEBP, and more</span>
      </button>
    </div>
  );
}

export default function QRCodeScanner() {
  const [activeTab, setActiveTab] = useState<"camera" | "upload">("camera");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "qr-reader-container";

  // Stop camera helper
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

  // Start camera helper
  const startCamera = async () => {
    try {
      setCameraError(null);
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(containerId, {
          verbose: false,
          formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        });
      }
      setIsScanning(true);
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          setScanResult(decodedText);
          stopCamera(); // Stop automatically on success
          setIsScanning(false);
        },
        (errorMessage) => {
          // Continuous minor errors when nothing is found. We ignore these.
        }
      );
    } catch (err: any) {
      setIsScanning(false);
      setCameraError(err?.message || "Failed to access camera. Please ensure camera permissions are granted.");
    }
  };

  // Handle Tab Switching
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

  // Handle File Upload
  const handleFileUpload = async (file: File) => {
    try {
      setScanResult(null);
      setCameraError(null);
      
      const html5QrCode = new Html5Qrcode(containerId);
      const result = await html5QrCode.scanFile(file, true);
      setScanResult(result);
    } catch (err) {
      setCameraError("Could not find a valid QR code in this image. Make sure the code is clear and well-lit.");
    }
  };

  const handleCopy = () => {
    if (scanResult) {
      navigator.clipboard.writeText(scanResult);
      alert("Results copied to clipboard!");
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
        
        {/* Toggle between Camera and Upload */}
        <div className="mx-auto flex w-full max-w-sm items-center rounded-[1rem] border border-border bg-muted/30 p-1 mb-8">
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 rounded-[0.75rem] py-2.5 text-sm font-medium transition-colors ${
              activeTab === "camera" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Use Camera
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 rounded-[0.75rem] py-2.5 text-sm font-medium transition-colors ${
              activeTab === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Upload Image
          </button>
        </div>

        <div className="grid gap-8 xl:grid-cols-2 max-w-6xl mx-auto">
          
          {/* Left Column: Scanner Source */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {activeTab === "camera" ? "1. Scan using Camera" : "1. Upload an Image"}
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
                       <p className="text-emerald-400 font-medium text-lg">Scan Successful!</p>
                       <button onClick={resetScanner} className="rounded-full bg-white/20 px-6 py-3 text-sm font-medium hover:bg-white/30 transition">
                        Scan Another Default
                      </button>
                    </div>
                  ) : null}
                  <div id={containerId} className={`w-full overflow-hidden ${scanResult ? 'hidden' : 'block'}`}></div>
                </>
              ) : (
                <div className="w-full h-full p-6 bg-card border-none flex items-center justify-center">
                  <div className="w-full max-w-sm">
                    <FilePicker
                      label="Select QR Image"
                      accept="image/*"
                      onFile={handleFileUpload}
                    />
                    {cameraError && (
                      <p className="mt-4 text-center text-sm text-red-500 font-medium">{cameraError}</p>
                    )}
                  </div>
                  {/* Invisible div needed for Html5Qrcode instantiation when scanning files */}
                  <div id={containerId} style={{ display: 'none' }}></div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-4 h-full flex flex-col">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">2. Results</h2>
            <div className="flex-1 rounded-[1.5rem] border border-border bg-card p-6 flex flex-col">
              
              {!scanResult ? (
                <div className="flex flex-1 items-center justify-center rounded-[1rem] border border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Point your camera at a QR code or upload an image to see the decoded results here.
                  </p>
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-between h-full">
                  <div className="space-y-4">
                    <h3 className="text-sm uppercase tracking-wider font-semibold text-emerald-600">Successfully Decoded</h3>
                    <div className="w-full rounded-[1rem] bg-muted/50 p-5 break-all max-h-[300px] overflow-y-auto font-mono text-sm text-foreground shadow-inner border border-border/50">
                      {scanResult}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={handleCopy}
                      className="w-full py-3 px-4 rounded-[1rem] bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-all"
                    >
                      Copy Value
                    </button>
                    {(scanResult.startsWith("http://") || scanResult.startsWith("https://")) && (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center py-3 px-4 rounded-[1rem] bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 hover:bg-emerald-100 transition-all"
                      >
                        Open Website
                      </a>
                    )}
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
