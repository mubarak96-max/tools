"use client";

import React, { useState, useMemo } from "react";
import { FileDown, FileJson, Settings2, Code2, Copy, CheckCircle2, ChevronRight, FileSpreadsheet, ListTree } from "lucide-react";

type ExportFormat = "json" | "xml" | "tsv";

function detectDelimiter(text: string): string {
  const delimiters = [",", ";", "\t", "|"];
  const lines = text.split("\n").filter(l => l.trim().length > 0).slice(0, 5);
  if (lines.length === 0) return ",";
  
  let bestDelimiter = ",";
  let maxWeight = -1;

  for (const d of delimiters) {
    let weights = lines.map(line => (line.match(new RegExp(`\\${d === '|' ? '\\|' : d === '\t' ? '\\t' : d}`, "g")) || []).length);
    const avg = weights.reduce((a, b) => a + b, 0) / weights.length;
    // Standard deviation to check consistency
    const variance = weights.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / weights.length;
    
    // Delimiter should appear in every line and have low variance
    if (avg > 0) {
      const weight = avg - variance;
      if (weight > maxWeight) {
        maxWeight = weight;
        bestDelimiter = d;
      }
    }
  }
  return bestDelimiter;
}

function parseCsv(csv: string, delimiter: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentVal = "";

  if (!csv.trim()) return [];

  // Handle Tab delimiter escaped string
  const actualDelimiter = delimiter === "\\t" ? "\t" : delimiter;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentVal += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === actualDelimiter && !inQuotes) {
      row.push(currentVal);
      currentVal = "";
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(currentVal);
      if (row.length > 1 || row[0] !== "") {
        result.push(row);
      }
      row = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }

  if (currentVal || csv[csv.length - 1] === actualDelimiter) {
    row.push(currentVal);
  }
  if (row.length > 0 && (row.length > 1 || row[0] !== "")) {
    result.push(row);
  }

  return result;
}

export function CsvConverter() {
  const [csvInput, setCsvInput] = useState<string>("id,name,age,email\n1,John Doe,28,john@example.com\n2,\"Smith, Jane\",32,jane@example.com\n3,Bob,45,bob@test.com");
  const [delimiter, setDelimiter] = useState<string>(",");
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [format, setFormat] = useState<ExportFormat>("json");
  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvInput(text);
        const d = detectDelimiter(text);
        setDelimiter(d);
      };
      reader.readAsText(file);
    }
  };

  const lineCount = csvInput.split("\n").length;


  const parsedData = useMemo(() => {
    return parseCsv(csvInput, delimiter);
  }, [csvInput, delimiter]);

  const convertedData = useMemo(() => {
    if (parsedData.length === 0) return "";

    let headers: string[] = [];
    let rows = parsedData;

    if (hasHeader && rows.length > 0) {
      headers = rows[0].map(h => h.trim().replace(/[^a-zA-Z0-9_]/g, '') || 'column');
      rows = rows.slice(1);
    } else {
      headers = Array.from({ length: Math.max(...rows.map(r => r.length)) }, (_, i) => `column_${i + 1}`);
    }

    if (format === "json") {
      const jsonArr = rows.map(row => {
        const obj: Record<string, string | number | null> = {};
        for (let i = 0; i < headers.length; i++) {
          let val = row[i] !== undefined ? row[i] : null;
          // Attempt number parsing
          if (val && !isNaN(Number(val)) && val.trim() !== "") {
            obj[headers[i]] = Number(val);
          } else {
            obj[headers[i]] = val;
          }
        }
        return obj;
      });
      return JSON.stringify(jsonArr, null, 2);
    } 
    
    if (format === "xml") {
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<dataset>\n`;
      rows.forEach(row => {
        xml += `  <record>\n`;
        for (let i = 0; i < headers.length; i++) {
          const val = row[i] !== undefined ? escapeXml(row[i]) : "";
          xml += `    <${headers[i]}>${val}</${headers[i]}>\n`;
        }
        xml += `  </record>\n`;
      });
      xml += `</dataset>`;
      return xml;
    }

    if (format === "tsv") {
      let tsv = "";
      if (hasHeader) {
        tsv += parsedData[0].join("\t") + "\n";
      }
      rows.forEach(row => {
        tsv += row.join("\t") + "\n";
      });
      return tsv;
    }

    return "";
  }, [parsedData, hasHeader, format]);

  const escapeXml = (unsafe: string) => {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([convertedData], { type: format === 'json' ? 'application/json' : format === 'xml' ? 'application/xml' : 'text/tab-separated-values' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data.${format === 'tsv' ? 'txt' : format}`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="tool-frame p-4 sm:p-8 md:p-12 rounded-[3.5rem] bg-white border border-border/50 shadow-2vw relative overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* Input Settings & Viewer */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <FileSpreadsheet className="w-4 h-4 text-primary" />
               Raw CSV Input
             </h3>
             <div className="flex items-center gap-4">
                <select 
                  value={delimiter} 
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="bg-muted px-4 py-1.5 rounded-lg text-xs font-bold border-none outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-center"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="\t">Tab</option>
                  <option value="|">Pipe (|)</option>
                </select>

                <label className="flex items-center gap-2 text-xs font-bold select-none cursor-pointer">
                  <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} className="accent-primary" />
                  First Row is Header
                </label>
             </div>
          </div>
          
          <div className="relative group rounded-3xl border border-border shadow-inner bg-muted/10 overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 w-12 bg-muted/20 border-r border-border pointer-events-none flex flex-col items-center py-6 gap-0 opacity-50 font-mono text-[10px] overflow-hidden">
                {Array.from({length: Math.min(lineCount, 50)}).map((_, i) => <span key={i} className="h-[21px] leading-[21px]">{i+1}</span>)}
                {lineCount > 50 && <span>...</span>}
             </div>
             <textarea 
                className="w-full h-[500px] bg-transparent pl-16 pr-6 py-6 font-mono text-sm leading-[21px] outline-none resize-none placeholder-foreground/20 text-foreground whitespace-pre overflow-auto"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="Paste your CSV data here..."
                spellCheck="false"
             />
             <div className="absolute bottom-4 right-4 flex gap-2">
                <input type="file" id="csv-upload" className="hidden" accept=".csv,.txt,.tsv" onChange={handleFileUpload} />
                <label htmlFor="csv-upload" className="cursor-pointer px-4 py-2 bg-background border border-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-muted transition-all shadow-sm">
                   Upload File
                </label>
             </div>
          </div>

          <div className="flex justify-between items-center px-4 py-3 rounded-2xl bg-muted/20 border border-border">
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Diagnostics</span>
             <div className="flex gap-4">
                <span className="text-xs font-bold text-foreground">{parsedData.length} Rows</span>
                <span className="text-xs font-bold text-foreground">{(parsedData[0] || []).length} Columns</span>
             </div>
          </div>
        </div>

        {/* Action Center - Separator in MD/LG */}
        <div className="flex flex-row lg:flex-col items-center justify-center gap-4 w-full lg:w-32 pt-8 lg:pt-24 shrink-0">
           <FormatButton label="JSON" icon={<FileJson className="w-5 h-5 mb-2" />} active={format === "json"} onClick={() => setFormat("json")} />
           <FormatButton label="XML" icon={<Code2 className="w-5 h-5 mb-2" />} active={format === "xml"} onClick={() => setFormat("xml")} />
           <FormatButton label="TSV" icon={<ListTree className="w-5 h-5 mb-2" />} active={format === "tsv"} onClick={() => setFormat("tsv")} />
        </div>

        {/* Output Viewer */}
        <div className="flex-1 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
               <Settings2 className="w-4 h-4 text-primary" />
               Parsed Output
             </h3>
             <div className="flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="px-4 py-1.5 rounded-lg bg-muted text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all flex items-center gap-2"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button 
                  onClick={downloadFile}
                  className="px-4 py-1.5 rounded-lg bg-primary text-[10px] text-white font-black uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                >
                  <FileDown className="w-3 h-3" /> Download
                </button>
             </div>
          </div>

          <div className="relative group rounded-3xl border border-border shadow-inner bg-[#1e1e1e] overflow-hidden text-[#d4d4d4]">
             {showPreview ? (
                <div className="w-full h-[500px] overflow-auto p-6 bg-white text-foreground font-sans">
                   <table className="w-full text-left border-collapse text-xs">
                      <thead>
                         <tr className="bg-muted border-b border-border">
                            {parsedData[0]?.map((h, i) => (
                               <th key={i} className="px-3 py-2 font-bold whitespace-nowrap">{h || `Col ${i+1}`}</th>
                            ))}
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                         {parsedData.slice(1, 10).map((row, ri) => (
                            <tr key={ri} className="hover:bg-muted/30">
                               {row.map((cell, ci) => (
                                  <td key={ci} className="px-3 py-2 whitespace-nowrap">{cell}</td>
                               ))}
                            </tr>
                         ))}
                      </tbody>
                   </table>
                   {parsedData.length > 10 && (
                      <p className="text-[10px] text-muted-foreground mt-4 text-center italic">Only first 10 rows shown in preview</p>
                   )}
                </div>
             ) : (
                <pre className="w-full h-[500px] overflow-auto p-6 font-mono text-sm leading-relaxed hide-scrollbar">
                   <code>{convertedData}</code>
                </pre>
             )}
             <div className="absolute top-4 right-4 flex gap-2">
                <button 
                   onClick={() => setShowPreview(!showPreview)}
                   className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                >
                   {showPreview ? "Show Code" : "Show Preview"}
                </button>
                <div className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full">
                  {format.toUpperCase()} Render
                </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function FormatButton({ label, icon, active, onClick }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-24 h-24 rounded-3xl border transition-all ${
        active 
          ? "bg-foreground text-background border-foreground shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] scale-[1.05]" 
          : "bg-background border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/10 hover:text-primary"
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
