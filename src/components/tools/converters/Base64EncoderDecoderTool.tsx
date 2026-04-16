"use client";

import React, { useState, useMemo, useCallback } from "react";
import { 
  Copy, 
  Trash2, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Upload, 
  AlertCircle,
  CheckCircle2,
  FileCode,
  Layout,
  Type
} from "lucide-react";

type Tab = "text" | "image" | "file";

export default function Base64EncoderDecoderTool() {
  const [tab, setTab] = useState<Tab>("text");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  
  // Text State
  const [textInput, setTextInput] = useState("");
  const [includeLineBreaks, setIncludeLineBreaks] = useState(false);
  
  // Image/File State
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleTextTransform = useCallback(() => {
    if (!textInput) return "";
    try {
      if (mode === "encode") {
        let b64 = btoa(unescape(encodeURIComponent(textInput)));
        if (includeLineBreaks) {
          b64 = b64.match(/.{1,76}/g)?.join("\n") || b64;
        }
        return b64;
      } else {
        const cleaned = textInput.replace(/\s+/g, "");
        return decodeURIComponent(escape(atob(cleaned)));
      }
    } catch (e) {
      return "ERROR: Invalid Base64 or Text representation";
    }
  }, [textInput, mode, includeLineBreaks]);

  const output = useMemo(() => {
    if (tab === "text") return handleTextTransform();
    if (tab === "image" || tab === "file") return fileBase64;
    return "";
  }, [tab, handleTextTransform, fileBase64]);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError("");
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (tab === "image") {
        setFileBase64(result); // Data URL includes prefix
      } else {
        const base64Content = result.split(",")[1];
        setFileBase64(base64Content);
      }
    };
    reader.onerror = () => setError("Failed to read file");
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange(droppedFile);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setStatus("Copied!");
    setTimeout(() => setStatus(""), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `base64-${mode}-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setTextInput("");
    setFile(null);
    setFileBase64("");
    setError("");
    setStatus("");
  };

  const renderBase64Output = (val: string) => {
    if (!val) return <span className="text-muted-foreground/30 italic">Result will appear here...</span>;
    if (val.startsWith("ERROR")) return <span className="text-red-500 font-bold">{val}</span>;

    const parts = val.split(/(==?)$/);
    return (
      <div className="font-mono text-sm leading-relaxed break-all whitespace-pre-wrap">
        {parts[0]}
        {parts[1] && <span className="text-primary font-bold">{parts[1]}</span>}
      </div>
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-4 bg-muted/30 p-2 rounded-3xl border border-border w-fit mx-auto">
        {[
          { id: "text", label: "Text Encoder", icon: Type },
          { id: "image", label: "Image Encoder", icon: ImageIcon },
          { id: "file", label: "File Encoder", icon: FileCode }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { setTab(item.id as Tab); clear(); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${tab === item.id ? "bg-background text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Tool Card */}
      <div className="bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
        {/* Header Toggle */}
        <div className="p-4 bg-muted/50 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2 bg-background border border-border rounded-xl p-1">
             <button
               onClick={() => setMode("encode")}
               className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "encode" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"}`}
             >
               Encode
             </button>
             <button
               onClick={() => setMode("decode")}
               className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "decode" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-muted"}`}
             >
               Decode
             </button>
          </div>
          
          {tab === "text" && mode === "encode" && (
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={includeLineBreaks}
                onChange={(e) => setIncludeLineBreaks(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">Wrap every 76 chars (RFC 2045)</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px] divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Input Panel */}
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Source</h3>
              {file && (
                <div className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
                  {formatSize(file.size)}
                </div>
              )}
            </div>

            {tab === "text" ? (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string to decode..."}
                className="w-full h-[350px] p-4 bg-muted/10 rounded-3xl border border-border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
              />
            ) : (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`w-full h-[350px] rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-8 text-center cursor-pointer ${
                  isDragging ? "border-primary bg-primary/5 scale-[0.98]" : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <input 
                  id="fileInput" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  accept={tab === "image" ? "image/*" : "*/*"}
                />
                
                {file ? (
                  <div className="space-y-4">
                    {tab === "image" && fileBase64 ? (
                      <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border border-border shadow-xl">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fileBase64} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={40} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.type || "Unknown Type"}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-3xl bg-primary/5 flex items-center justify-center text-primary mb-4 shadow-inner">
                      <Upload size={32} />
                    </div>
                    <p className="text-sm font-bold mb-1">Drag and drop your {tab}</p>
                    <p className="text-xs text-muted-foreground">or click to browse from computer</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="p-8 space-y-6 bg-muted/5">
             <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Result</h3>
              {output && !output.startsWith("ERROR") && (
                <div className="flex items-center gap-2">
                   <div className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-full font-bold">
                    {formatSize(new Blob([output]).size)}
                  </div>
                  {file && (
                    <div className="text-[10px] text-muted-foreground font-medium">
                      (+{Math.round((new Blob([output]).size / file.size) * 100 - 100)}% Overhead)
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="w-full h-[350px] p-6 bg-background rounded-3xl border border-border overflow-y-auto relative border-white/5 shadow-inner">
              {renderBase64Output(output)}
            </div>

            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleCopy}
                disabled={!output || output.startsWith("ERROR")}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
              >
                {status === "Copied!" ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                {status || "Copy Result"}
              </button>
              <button 
                onClick={handleDownload}
                disabled={!output || output.startsWith("ERROR")}
                className="px-6 py-4 rounded-2xl bg-muted/50 border border-border font-bold hover:bg-muted transition-all disabled:opacity-50"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={clear}
                className="px-6 py-4 rounded-2xl text-muted-foreground hover:text-red-500 transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <Layout size={20} />
          </div>
          <h4 className="font-bold">Privacy First</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All encoding and decoding happens locally in your browser. Your files and text are <strong>never</strong> uploaded to our servers.
          </p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <AlertCircle size={20} />
          </div>
          <h4 className="font-bold">File Limitations</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Supports files up to 10MB efficiently. Larger files may cause your browser to slow down due to the 33% size overhead of Base64.
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
            <FileCode size={20} />
          </div>
          <h4 className="font-bold">RFC 2045 Wrap</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Enable line wraps for legacy email systems and MIME compliance which require content-transfer-encoding breaks every 76 chars.
          </p>
        </div>
      </div>
    </div>
  );
}
