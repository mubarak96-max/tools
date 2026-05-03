"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { 
  ShieldCheck, 
  Zap, 
  Image as ImageIcon, 
  Edit3, 
  FileText, 
  Clock, 
  CheckCircle2,
  Copy,
  Download,
  FileSearch,
  RefreshCw
} from "lucide-react";

// Uses Tesseract.js for 100% local, in-browser OCR — no API calls, no data leaves the device

type ExtractMode = "eng" | "fast" | "best";
type OutputFormat = "plain" | "markdown" | "lines";

interface HistoryItem {
  id: string;
  filename: string;
  preview: string;
  text: string;
  timestamp: Date;
  wordCount: number;
}

const newId = () => Math.random().toString(36).slice(2, 9);

const FORMAT_OPTIONS: { id: OutputFormat; label: string }[] = [
  { id: "plain", label: "Plain text" },
  { id: "markdown", label: "Markdown" },
  { id: "lines", label: "Clean lines" },
];

export default function ScanTextTool() {
  const [file,        setFile]      = useState<File | null>(null);
  const [preview,     setPreview]   = useState<string>("");
  const [text,        setText]      = useState<string>("");
  const [loading,     setLoading]   = useState(false);
  const [progress,    setProgress]  = useState(0);
  const [status,      setStatus]    = useState<string>("");
  const [error,       setError]     = useState<string>("");
  const [mode,        setMode]      = useState<ExtractMode>("eng");
  const [format,      setFormat]    = useState<OutputFormat>("plain");
  const [copied,      setCopied]    = useState(false);
  const [dragging,    setDragging]  = useState(false);
  const [history,     setHistory]   = useState<HistoryItem[]>([]);
  const [tab,         setTab]       = useState<"tool" | "history">("tool");
  const [tesseractReady, setTesseractReady] = useState(true);

  const fileRef = useRef<HTMLInputElement>(null);

  // ── File handling ─────────────────────────────────────────────

  const processFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, GIF, WebP, BMP, TIFF).");
      return;
    }
    setFile(f);
    setError("");
    setText("");
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  }, [processFile]);

  // ── OCR ───────────────────────────────────────────────────────

  const runOcr = useCallback(async () => {
    if (!file || !preview || !tesseractReady) return;
    setLoading(true);
    setError("");
    setProgress(0);
    setText("");

    try {
      const worker = await createWorker("eng", 1, {
        logger: (m: any) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
            setStatus("Recognising text…");
          } else if (m.status === "loading tesseract core") {
            setStatus("Loading OCR engine…");
          } else if (m.status === "initializing tesseract") {
            setStatus("Initialising…");
          } else if (m.status === "loading language traineddata") {
            setStatus("Loading language model…");
          } else if (m.status === "initializing api") {
            setStatus("Preparing…");
          }
        },
      });

      setStatus("Analysing image…");
      const result = await worker.recognize(preview);
      await worker.terminate();

      const rawText: string = result.data.text.trim();
      let output = rawText;

      if (format === "markdown") {
        // Attempt basic structure: lines that are short and followed by longer ones = headings
        const lines = rawText.split("\n");
        output = lines.map((line: string, i: number) => {
          const trimmed = line.trim();
          if (!trimmed) return "";
          const nextLine = lines[i + 1]?.trim() ?? "";
          if (trimmed.length < 50 && nextLine.length > 60 && !trimmed.endsWith(".")) {
            return `## ${trimmed}`;
          }
          if (trimmed.match(/^[\d\-\*\•]\s/)) return `- ${trimmed.slice(2)}`;
          return trimmed;
        }).join("\n");
      } else if (format === "lines") {
        // Clean up: remove blank lines, one sentence per line
        output = rawText
          .split("\n")
          .map((l: string) => l.trim())
          .filter((l: string) => l.length > 0)
          .join("\n");
      }

      setText(output);
      setProgress(100);
      setStatus("Done!");

      // Add to history
      const wc = output.split(/\s+/).filter((w: string) => w.length > 0).length;
      setHistory(prev => [{
        id: newId(),
        filename: file.name,
        preview,
        text: output,
        timestamp: new Date(),
        wordCount: wc,
      }, ...prev.slice(0, 9)]);

    } catch (err: any) {
      setError("OCR failed: " + (err?.message ?? "Unknown error. Please try a clearer image."));
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 2000);
    }
  }, [file, preview, tesseractReady, format]);

  // ── Copy ─────────────────────────────────────────────────────

  const copyText = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  const downloadText = useCallback(() => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = (file?.name.replace(/\.[^.]+$/, "") ?? "extracted") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [text, file]);

  const wordCount = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
  const charCount = text.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

        .scan-tool-root {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          color: #1C1C1C;
          box-sizing: border-box;
        }

        .scan-tool-root * { box-sizing: border-box; }

        .page-tool {
          max-width: 1100px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* Header */
        .hero { margin-bottom: 48px; }
        .badge {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase;
          color: #3D6B4F; background: #EAF4EE; border: 1px solid #C6E2CE;
          border-radius: 100px; padding: 5px 12px; margin-bottom: 20px;
        }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #3D6B4F; }
        .hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.1;
          color: #111;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }
        .hero h1 em { font-style: italic; color: #3D6B4F; }
        .hero p { font-size: 16px; color: #666; line-height: 1.7; max-width: 560px; }

        /* Tabs */
        .tabs {
          display: flex; gap: 0; border-bottom: 2px solid #E8E8E4;
          margin-bottom: 36px;
        }
        .tab-btn {
          padding: 12px 24px; font-size: 14px; font-weight: 500;
          background: none; border: none; cursor: pointer; color: #888;
          border-bottom: 2px solid transparent; margin-bottom: -2px;
          transition: all .2s;
        }
        .tab-btn.active { color: #111; border-bottom-color: #111; }
        .tab-btn:hover:not(.active) { color: #444; }

        /* Main grid */
        .tool-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        @media (max-width: 760px) {
          .tool-grid { grid-template-columns: 1fr; }
        }

        /* Panel */
        .panel {
          background: #fff;
          border: 1.5px solid #E8E8E4;
          border-radius: 16px;
          overflow: hidden;
        }
        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1.5px solid #E8E8E4;
          background: #FAFAF8;
        }
        .panel-title {
          font-size: 12px; font-weight: 600; text-transform: uppercase;
          letter-spacing: .08em; color: #888;
        }
        .panel-body { padding: 20px; }

        /* Drop zone */
        .dropzone {
          border: 2px dashed #D5D5CE;
          border-radius: 12px;
          padding: 48px 32px;
          text-align: center;
          cursor: pointer;
          transition: all .2s;
          background: #FAFAF8;
        }
        .dropzone:hover, .dropzone.dragging {
          border-color: #3D6B4F;
          background: #EAF4EE;
        }
        .dropzone-icon {
          width: 52px; height: 52px;
          background: #F0F0EB; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 16px;
          font-size: 24px;
        }
        .dropzone-title {
          font-size: 15px; font-weight: 600; color: #111; margin-bottom: 6px;
        }
        .dropzone-sub { font-size: 13px; color: #888; line-height: 1.6; }
        .dropzone-sub strong { color: #3D6B4F; cursor: pointer; }
        .dropzone-sub strong:hover { text-decoration: underline; }

        /* Image preview */
        .img-preview {
          width: 100%; border-radius: 10px;
          object-fit: contain; max-height: 320px;
          background: #F5F5F2;
        }
        .img-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 12px; font-size: 12px; color: #888;
        }
        .img-name { font-weight: 500; color: #444; }
        .btn-change {
          font-size: 12px; color: #3D6B4F; background: none; border: none;
          cursor: pointer; font-weight: 500; text-decoration: underline;
        }

        /* Options row */
        .options-row {
          display: flex; gap: 12px; flex-wrap: wrap; margin-top: 16px;
        }
        .opt-label { font-size: 11px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
        .seg-group { display: flex; background: #F0F0EB; border-radius: 8px; padding: 3px; gap: 2px; }
        .seg-btn {
          flex: 1; padding: 7px 12px; font-size: 12px; font-weight: 500;
          background: none; border: none; cursor: pointer; color: #666;
          border-radius: 6px; transition: all .15s; white-space: nowrap;
        }
        .seg-btn.active { background: #fff; color: #111; box-shadow: 0 1px 3px rgba(0,0,0,.1); }

        /* Extract button */
        .extract-btn {
          width: 100%; margin-top: 16px;
          padding: 14px; font-size: 14px; font-weight: 600;
          background: #111; color: #fff; border: none;
          border-radius: 12px; cursor: pointer; transition: all .2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .extract-btn:hover:not(:disabled) { background: #3D6B4F; transform: translateY(-1px); }
        .extract-btn:disabled { background: #CCC; cursor: not-allowed; transform: none; }

        /* Progress */
        .progress-wrap { margin-top: 16px; }
        .progress-bar-bg {
          height: 4px; background: #E8E8E4; border-radius: 4px; overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%; background: #3D6B4F; border-radius: 4px;
          transition: width .3s ease;
        }
        .progress-status { font-size: 12px; color: #888; margin-top: 6px; }

        /* Output panel */
        .output-textarea {
          width: 100%; min-height: 300px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.7;
          color: #1C1C1C; background: #FAFAF8;
          border: 1.5px solid #E8E8E4; border-radius: 10px;
          padding: 16px; resize: vertical;
          outline: none; transition: border-color .2s;
        }
        .output-textarea:focus { border-color: #3D6B4F; }
        .output-placeholder {
          min-height: 300px; display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 8px;
          color: #AAA; font-size: 14px; text-align: center;
          background: #FAFAF8; border: 1.5px dashed #E0E0DA;
          border-radius: 10px; padding: 32px;
        }
        .output-placeholder svg { opacity: .3; }

        /* Stats + actions */
        .output-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 12px; flex-wrap: wrap; gap: 8px;
        }
        .stats { font-size: 12px; color: #AAA; }
        .stats strong { color: #666; }
        .actions { display: flex; gap: 8px; }
        .icon-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 14px; font-size: 12px; font-weight: 500;
          background: #F0F0EB; border: 1px solid #E0E0DA;
          border-radius: 8px; cursor: pointer; color: #444;
          transition: all .15s;
        }
        .icon-btn:hover { background: #E8E8E4; }
        .icon-btn.primary { background: #111; color: #fff; border-color: #111; }
        .icon-btn.primary:hover { background: #3D6B4F; border-color: #3D6B4F; }

        /* Error */
        .error-box {
          margin-top: 12px; padding: 12px 16px;
          background: #FEF2F2; border: 1px solid #FECACA;
          border-radius: 10px; font-size: 13px; color: #DC2626;
        }

        /* History */
        .history-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
        .history-card {
          border: 1.5px solid #E8E8E4; border-radius: 12px; overflow: hidden;
          cursor: pointer; transition: all .15s;
          background: #fff;
        }
        .history-card:hover { border-color: #3D6B4F; transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.06); }
        .history-img { width: 100%; height: 120px; object-fit: cover; background: #F5F5F2; }
        .history-body { padding: 12px; }
        .history-name { font-size: 13px; font-weight: 600; color: #111; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .history-meta { font-size: 11px; color: #AAA; margin-bottom: 8px; }
        .history-excerpt { font-size: 12px; color: #666; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .empty-history { text-align: center; padding: 80px 32px; color: #AAA; }
        .empty-history h3 { font-size: 16px; font-weight: 600; color: #888; margin-bottom: 8px; }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        /* Features strip */
        .features {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px; margin-top: 48px;
        }
        .feature {
          background: #fff; border: 1.5px solid #E8E8E4; border-radius: 14px;
          padding: 20px; transition: border-color .2s;
        }
        .feature:hover { border-color: #3D6B4F; }
        .feature-icon { font-size: 24px; margin-bottom: 10px; }
        .feature-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 4px; }
        .feature-desc { font-size: 12px; color: #888; line-height: 1.5; }
      `}</style>

      <div className="scan-tool-root">
        <div className="page-tool">

          {/* Hero */}
          <div className="hero">
            <div className="badge">
              <span className="badge-dot" />
              100% local · no upload · no server
            </div>
            <h1>Scan Text <em>from Image</em></h1>
            <p>
              The fastest photo to text converter — paste, drag, or upload any image
              and extract all readable text instantly. Works entirely in your browser.
              Your images never leave your device.
            </p>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab-btn ${tab === "tool" ? "active" : ""}`} onClick={() => setTab("tool")}>
              Image to text converter
            </button>
            <button className={`tab-btn ${tab === "history" ? "active" : ""}`} onClick={() => setTab("history")}>
              History ({history.length})
            </button>
          </div>

          {/* ── Tool tab ─────────────────────────────────────── */}
          {tab === "tool" && (
            <div className="tool-grid">

              {/* Left — upload */}
              <div>
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Upload image</span>
                    {file && (
                      <span style={{ fontSize: 11, color: "#3D6B4F", fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Image ready
                      </span>
                    )}
                  </div>
                  <div className="panel-body">
                    {!preview ? (
                      <div
                        className={`dropzone ${dragging ? "dragging" : ""}`}
                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileRef.current?.click()}
                      >
                        <div className="dropzone-icon">
                          <ImageIcon size={28} color="#888" />
                        </div>
                        <div className="dropzone-title">Drop your image here</div>
                        <div className="dropzone-sub">
                          or <strong onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>browse to upload</strong>
                          <br />JPG, PNG, WebP, GIF, BMP, TIFF supported
                        </div>
                      </div>
                    ) : (
                      <>
                        <img src={preview} alt="Uploaded" className="img-preview" />
                        <div className="img-meta">
                          <span className="img-name">{file?.name}</span>
                          <button className="btn-change" onClick={() => { setFile(null); setPreview(""); setText(""); setError(""); }}>
                            Change image
                          </button>
                        </div>
                      </>
                    )}

                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {/* Output format */}
                    <div style={{ marginTop: 20 }}>
                      <div className="opt-label">Output format</div>
                      <div className="seg-group">
                        {FORMAT_OPTIONS.map(f => (
                          <button
                            key={f.id}
                            className={`seg-btn ${format === f.id ? "active" : ""}`}
                            onClick={() => setFormat(f.id)}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Extract button */}
                    <button
                      className="extract-btn"
                      disabled={!preview || loading || !tesseractReady}
                      onClick={runOcr}
                    >
                      {loading ? (
                        <><div className="spinner" />{status || "Extracting…"}</>
                      ) : !tesseractReady ? (
                        "Loading OCR engine…"
                      ) : (
                        <>
                        <FileSearch size={16} />
                        Get text from image
                      </>
                    )}
                  </button>

                    {/* Progress */}
                    {loading && (
                      <div className="progress-wrap">
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="progress-status">{status} {progress > 0 && progress < 100 ? `${progress}%` : ""}</div>
                      </div>
                    )}

                    {error && <div className="error-box">{error}</div>}
                  </div>
                </div>
              </div>

              {/* Right — output */}
              <div>
                <div className="panel" style={{ height: "100%" }}>
                  <div className="panel-header">
                    <span className="panel-title">Extracted text</span>
                    {text && (
                      <span style={{ fontSize: 11, color: "#888" }}>
                        {wordCount} words · {charCount} chars
                      </span>
                    )}
                  </div>
                  <div className="panel-body">
                    {text ? (
                      <>
                        <textarea
                          className="output-textarea"
                          value={text}
                          onChange={e => setText(e.target.value)}
                          spellCheck={false}
                        />
                        <div className="output-footer">
                          <span className="stats">
                            <strong>{wordCount}</strong> words · <strong>{charCount}</strong> characters
                          </span>
                          <div className="actions">
                          <button className="icon-btn" onClick={downloadText}>
                            <Download size={14} />
                            Download .txt
                          </button>
                          <button className={`icon-btn primary`} onClick={copyText}>
                            {copied ? (
                              <>
                                <CheckCircle2 size={14} /> Copied!
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                Copy text
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="output-placeholder">
                      <FileText size={48} strokeWidth={1} />
                      <span>Extracted text will appear here</span>
                      <span style={{ fontSize: 12, color: "#CCC" }}>Upload an image and click "Get text from image"</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── History tab ──────────────────────────────────── */}
        {tab === "history" && (
          history.length === 0 ? (
            <div className="empty-history">
              <h3>No history yet</h3>
              <p style={{ fontSize: 13 }}>Extracted images will appear here</p>
            </div>
          ) : (
            <div className="history-grid">
              {history.map(item => (
                <div
                  key={item.id}
                  className="history-card"
                  onClick={() => {
                    setPreview(item.preview);
                    setText(item.text);
                    setFile(null);
                    setTab("tool");
                  }}
                >
                  <img src={item.preview} alt={item.filename} className="history-img" />
                  <div className="history-body">
                    <div className="history-name">{item.filename}</div>
                    <div className="history-meta">
                      {item.wordCount} words · {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="history-excerpt">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Features strip */}
        <div className="features">
          {[
            { icon: <ShieldCheck size={24} />, title: "100% private", desc: "Your images are processed locally in the browser. Nothing is uploaded to any server." },
            { icon: <Zap size={24} />, title: "Fast extraction", desc: "Powered by Tesseract.js, a proven OCR engine used by millions of developers worldwide." },
            { icon: <ImageIcon size={24} />, title: "All image types", desc: "Works with JPG, PNG, WebP, BMP, GIF, TIFF — any photo to text conversion you need." },
            { icon: <Edit3 size={24} />, title: "Edit after scan", desc: "The extracted text is fully editable. Fix OCR mistakes before copying or downloading." },
            { icon: <FileText size={24} />, title: "Multiple formats", desc: "Export as plain text, Markdown with structure, or clean line-by-line output." },
            { icon: <Clock size={24} />, title: "Session history", desc: "Every extraction is saved in your session history so you can revisit previous scans." },
          ].map(f => (
            <div key={f.title} className="feature">
              <div className="feature-icon" style={{ color: '#3D6B4F' }}>{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </>
  );
}
