"use client";

import React, { useState, useMemo, useRef } from "react";
import {
    Plus,
    Trash2,
    Copy,
    ChevronLeft,
    ChevronRight,
    Type,
    Smile,
    User,
    ImageIcon,
    Layout,
    Sparkles,
    Palette,
    Shapes,
    Settings,
    Check,
    Download,
    FileDown,
    Loader2
} from "lucide-react";
import { useCarousel } from "./useCarousel";
import { cn } from "@/lib/utils";
import { CarouselSlide, CarouselTemplate, CarouselAspectRatio } from "@/lib/carousel/types";
import { carouselTemplates } from "@/lib/carousel/templates";
import { backgroundPresets } from "@/lib/carousel/backgrounds";
import SlideRenderer from "./SlideRenderer";

type CarouselEditorProps = {
    initialTemplateId?: string;
};

export default function CarouselEditor({ initialTemplateId }: CarouselEditorProps) {
    const {
        slides,
        activeSlideId,
        addSlide,
        deleteSlide,
        duplicateSlide,
        updateSlideData,
        updateSlideMeta,
        setActiveSlide,
        template,
        setTemplate,
        prevSlide,
        nextSlide,
        background,
        setBackground,
        document,
        setAspectRatio,
        reorderSlides,
    } = useCarousel({ initialTemplateId });

    const activeSlide = slides.find((s) => s.id === activeSlideId) || slides[0];
    const currentIndex = slides.findIndex((s) => s.id === activeSlide.id);
    const [showTextSettings, setShowTextSettings] = useState(true);
    const [exportingFormat, setExportingFormat] = useState<'pdf' | 'images' | null>(null);
    const exportRef = useRef<HTMLDivElement>(null);

    const handleExport = async (format: 'pdf' | 'images') => {
        if (!exportRef.current) {
            console.error("Export ref not found");
            return;
        }
        
        setExportingFormat(format);
        console.log(`Starting ${format} export for ${slides.length} slides...`);

        try {
            const [
                { toPng },
                jspdfModule,
                jszipModule
            ] = await Promise.all([
                import("html-to-image"),
                import("jspdf"),
                import("jszip")
            ]);

            const jsPDF = jspdfModule.jsPDF || (jspdfModule as any).default;
            const JSZip = (jszipModule as any).default || jszipModule;

            const slideNodes = Array.from(exportRef.current.children) as HTMLElement[];

            if (slideNodes.length === 0) {
                throw new Error("No slides found in export container");
            }

            const images: string[] = [];

            // Wait for fonts and styles to settle
            await new Promise(r => setTimeout(r, 500));

            for (let i = 0; i < slideNodes.length; i++) {
                const node = slideNodes[i];
                console.log(`Capturing slide ${i + 1}/${slideNodes.length}...`);
                
                try {
                    const dataUrl = await toPng(node, { 
                        pixelRatio: 2,
                        cacheBust: true,
                        skipFonts: false,
                        includeQueryParams: true
                    });
                    
                    if (!dataUrl || dataUrl.length < 100) {
                        throw new Error(`Slide ${i+1} capture returned empty data`);
                    }
                    
                    images.push(dataUrl);
                } catch (nodeErr) {
                    console.error(`Error capturing slide ${i+1}:`, nodeErr);
                    throw nodeErr;
                }
            }

            console.log("All slides captured, generating file...");

            const canvasWidth = 1080;
            const canvasHeight = document.aspectRatio === '1/1' 
                ? 1080 
                : document.aspectRatio === '9/16' 
                    ? 1920 
                    : 1350;

            if (format === 'pdf') {
                const pdf = new jsPDF({
                    orientation: canvasHeight > canvasWidth ? 'p' : 'l',
                    unit: 'px',
                    format: [canvasWidth, canvasHeight]
                });

                images.forEach((img, i) => {
                    if (i > 0) pdf.addPage([canvasWidth, canvasHeight], canvasHeight > canvasWidth ? 'p' : 'l');
                    pdf.addImage(img, 'PNG', 0, 0, canvasWidth, canvasHeight, undefined, 'FAST');
                });
                pdf.save(`carousel-${Date.now()}.pdf`);
            } else {
                const zip = new JSZip();
                images.forEach((img, i) => {
                    const data = img.split(',')[1];
                    zip.file(`slide-${i + 1}.png`, data, { base64: true });
                });
                const content = await zip.generateAsync({ type: 'blob' });
                const link = window.document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = `carousel-${Date.now()}-images.zip`;
                link.click();
            }
            console.log("Export complete!");
        } catch (err) {
            console.error("Export process failed:", err);
            alert("Export failed: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setExportingFormat(null);
        }
    };

    // Fallback so editor never goes blank if a saved templateId no longer exists
    const resolvedTemplate = template ?? carouselTemplates[0];
    if (!resolvedTemplate || !activeSlide) return null;

    const ratioClass = document.aspectRatio === "1/1"
        ? "aspect-square"
        : document.aspectRatio === "9/16"
            ? "aspect-[9/16]"
            : "aspect-[4/5]";

    return (
        <div className="flex flex-col gap-4 max-w-[560px] mx-auto pb-12">
            {/* Hidden Export Renderer (Must be rendered to be captured) */}
            <div 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '1080px', 
                    height: '0px', 
                    overflow: 'hidden', 
                    pointerEvents: 'none', 
                    opacity: 0, 
                    zIndex: -100 
                }} 
                aria-hidden="true"
            >
                <div ref={exportRef}>
                    {slides.map((s, i) => (
                        <div 
                            key={s.id} 
                            style={{ 
                                width: '540px', 
                                height: document.aspectRatio === '1/1' ? '540px' : document.aspectRatio === '9/16' ? '960px' : '675px',
                                position: 'relative',
                                overflow: 'hidden',
                                background: 'white'
                            }}
                        >
                            <SlideRenderer
                                slide={s}
                                template={resolvedTemplate}
                                background={background}
                                slideIndex={i}
                                totalSlides={slides.length}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Global Toolbar */}
            <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-center gap-3">
                    {/* Templates Dropdown/Toggle */}
                    <div className="flex-[1.2] flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400"><Palette className="inline h-3 w-3 mr-1" />Template</label>
                        <select
                            value={resolvedTemplate.id}
                            onChange={(e) => setTemplate(e.target.value)}
                            className="h-8 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 text-xs font-bold text-gray-700 outline-none focus:border-violet-500"
                        >
                            {carouselTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>

                    {/* Backgrounds Dropdown */}
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400"><Shapes className="inline h-3 w-3 mr-1" />Background</label>
                        <select
                            value={background?.id || ""}
                            onChange={(e) => setBackground(e.target.value || undefined)}
                            className="h-8 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 text-xs font-bold text-gray-700 outline-none focus:border-violet-500"
                        >
                            <option value="">Default Match</option>
                            {backgroundPresets.map(bg => <option key={bg.id} value={bg.id}>{bg.name}</option>)}
                        </select>
                    </div>

                    {/* Platform / Aspect Ratio */}
                    <div className="flex-1 flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-gray-400"><Layout className="inline h-3 w-3 mr-1" />Platform</label>
                        <select
                            value={document.aspectRatio || "4/5"}
                            onChange={(e) => setAspectRatio(e.target.value as any)}
                            className="h-8 w-full rounded-lg border border-gray-200 bg-gray-50 px-2 text-[10px] font-bold text-gray-700 outline-none focus:border-violet-500"
                        >
                            <option value="4/5">Instagram / LinkedIn (4:5)</option>
                            <option value="1/1">Instagram / LinkedIn (1:1)</option>
                            <option value="9/16">TikTok / Story (9:16)</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    {/* Text Settings / Editor Toggle */}
                    <button
                        onClick={() => setShowTextSettings(!showTextSettings)}
                        className={cn(
                            "flex h-8 items-center gap-1.5 rounded-lg border px-3 text-[10px] font-bold uppercase transition",
                            showTextSettings ? "bg-gray-800 border-gray-800 text-white" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <Settings className="h-3 w-3" />
                        Text Settings
                    </button>
                </div>
            </div>

            {/* Export Toolbar */}
            <div className="flex items-center gap-2 px-1">
                <div className="flex items-center gap-1.5 mr-auto">
                    <Download className="h-4 w-4 text-violet-600" />
                    <span className="text-[10px] font-black uppercase tracking-wide text-gray-500 italic">Download Carousel</span>
                </div>

                <button
                    onClick={() => handleExport('pdf')}
                    disabled={exportingFormat !== null}
                    className="flex h-8 items-center gap-2 rounded-lg bg-gray-50 border border-gray-100 px-3 text-[10px] font-bold uppercase text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                    {exportingFormat === 'pdf' ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileDown className="h-3 w-3" />}
                    LinkedIn PDF
                </button>

                <button
                    onClick={() => handleExport('images')}
                    disabled={exportingFormat !== null}
                    className="flex h-8 items-center gap-2 rounded-lg bg-violet-600 px-3 text-[10px] font-bold uppercase text-white transition hover:bg-violet-700 disabled:opacity-50 shadow-sm"
                >
                    {exportingFormat === 'images' ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                    Insta/TikTok ZIP
                </button>
            </div>

            {/* Top Preview Canvas */}
            <div className="flex flex-col gap-4">
                <div
                    className={cn(
                        "relative w-full overflow-hidden border border-gray-200 bg-white transition-all duration-300 mx-auto",
                        ratioClass,
                        document.aspectRatio === "9/16" ? "max-w-[340px]" : ""
                    )}
                    style={{ background: resolvedTemplate.styles.colors.background }}
                >
                    <SlideRenderer
                        slide={activeSlide}
                        template={resolvedTemplate}
                        background={background}
                        slideIndex={currentIndex}
                        totalSlides={slides.length}
                    />
                </div>

                {/* Segmented Navigation Bar */}
                <div className="flex w-full items-stretch border-t border-gray-100 divide-x divide-gray-100 bg-white h-11">
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#7C3AED] transition hover:bg-gray-50 disabled:opacity-30"
                    >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        PREV
                    </button>

                    <div className="flex flex-1 divide-x divide-gray-100">
                        <button
                            onClick={() => reorderSlides(currentIndex, currentIndex - 1)}
                            disabled={currentIndex <= 1}
                            className="flex-1 flex items-center justify-center text-[#7C3AED] transition hover:bg-gray-50 disabled:opacity-20"
                            title="Move Left"
                        >
                            <ChevronLeft className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => reorderSlides(currentIndex, currentIndex + 1)}
                            disabled={currentIndex === 0 || currentIndex >= slides.length - 2}
                            className="flex-1 flex items-center justify-center text-[#7C3AED] transition hover:bg-gray-50 disabled:opacity-20"
                            title="Move Right"
                        >
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="flex flex-1 divide-x divide-gray-100">
                        <button
                            onClick={() => duplicateSlide(activeSlide.id)}
                            className="flex-1 flex items-center justify-center text-[#7C3AED] transition hover:bg-gray-50"
                            title="Duplicate"
                        >
                            <Copy className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => deleteSlide(activeSlide.id)}
                            className="flex-1 flex items-center justify-center text-[#7C3AED] transition hover:bg-gray-50 text-red-400 hover:text-red-500"
                            title="Delete"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={nextSlide}
                        disabled={currentIndex === slides.length - 1}
                        className="flex-1 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#7C3AED] transition hover:bg-gray-50 disabled:opacity-30"
                    >
                        NEXT
                        <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>



            </div>

            {/* Content Workstation */}
            {showTextSettings && (
                <div className="border border-gray-200 bg-white p-3">
                    <EditorFields
                        activeSlide={activeSlide}
                        updateSlideData={updateSlideData}
                        updateSlideMeta={updateSlideMeta}
                        template={resolvedTemplate}
                    />
                </div>
            )}


        </div>
    );
}

interface EditorFieldsProps {
    activeSlide: CarouselSlide;
    updateSlideData: (id: string, data: Partial<CarouselSlide["data"]>) => void;
    updateSlideMeta: (id: string, meta: Partial<Omit<CarouselSlide, "id" | "data">>) => void;
    template: CarouselTemplate;
}

function FieldToggle({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                checked ? "bg-[#7C3AED]" : "bg-gray-200"
            )}
        >
            <span
                className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    checked ? "translate-x-4" : "translate-x-0"
                )}
            />
        </button>
    );
}

function EditorFields({
    activeSlide,
    updateSlideData,
    updateSlideMeta,
}: EditorFieldsProps) {

    const layoutSupportsImage = useMemo(() => {
        const imageLayouts = [
            "split-left",
            "split-right",
            "image-top",
            "image-left",
            "image-right",
            "full-image",
            "intro-headshot",
            "intro-image"
        ];
        return imageLayouts.includes(activeSlide.layout);
    }, [activeSlide.layout]);

    return (
        <div className="space-y-3">
            {/* Intro Sub-Layout Tabs */}
            {activeSlide.role === "intro" && (
                <div className="space-y-4">
                    <div className="flex w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 p-1">
                        {[
                            { id: 'intro-standard', label: 'Standard', icon: Type },
                            { id: 'intro-emoji', label: 'Emoji', icon: Smile },
                            { id: 'intro-headshot', label: 'Headshot', icon: User },
                            { id: 'intro-image', label: 'Image', icon: ImageIcon },
                        ].map((tab) => {
                            const isActive = activeSlide.layout === tab.id || (activeSlide.layout === "top" && tab.id === "intro-standard");
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => updateSlideMeta(activeSlide.id, { layout: tab.id as any })}
                                    className={cn(
                                        "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-2 transition",
                                        isActive
                                            ? "bg-white text-[#7C3AED] ring-1 ring-black/5"
                                            : "text-gray-400 hover:bg-white/50 hover:text-gray-600"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Outro Sub-Layout Tabs */}
            {activeSlide.role === "outro" && (
                <div className="space-y-4">
                    <div className="flex w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 p-1">
                        {[
                            { id: 'intro-standard', label: 'Standard', icon: Type },
                            { id: 'intro-headshot', label: 'Headshot', icon: User },
                            { id: 'intro-image', label: 'Image', icon: ImageIcon },
                        ].map((tab) => {
                            const isActive = activeSlide.layout === tab.id || (activeSlide.layout === "center" && tab.id === "intro-standard");
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => updateSlideMeta(activeSlide.id, { layout: tab.id as any })}
                                    className={cn(
                                        "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-2 transition",
                                        isActive
                                            ? "bg-white text-[#7C3AED] ring-1 ring-black/5"
                                            : "text-gray-400 hover:bg-white/50 hover:text-gray-600"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Layout Specific Advanced Controls (Shared between Intro/Outro) */}
            <div className="space-y-4">
                {activeSlide.layout === "intro-emoji" && activeSlide.role === "intro" && (
                    <div className="space-y-2 py-4 border-y border-violet-100 bg-violet-50/30 px-3 -mx-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-violet-500">Choose your Hook Emoji</label>
                        <div className="flex flex-wrap gap-2 pt-2 max-h-[220px] overflow-y-auto no-scrollbar">
                            {[
                                '🚀', '💡', '🔥', '👀', '✨', '✅', '📈', '📣', '💎', '🎯',
                                '😀', '😃', '😄', '😁', '😆', '😅', '😂', '😭', '😉', '😊',
                                '😇', '😍', '😘', '😋', '😛', '🤪', '🤫', '🤔', '🤐', '🤨',
                                '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🥱', '😴', '😷',
                                '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳',
                                '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😱', '😖', '😣',
                                '😞', '😓', '😩', '😫', '😤', '😡', '😠', '🤬', '😈', '👿',
                                '💀', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺',
                                '🙋', '🤦', '🤷', '🙎', '🙍', '💪', '🤙', '👇', '👆', '👈',
                                '👉', '👊', '👋', '👌', '👍', '👎', '👏', '🙌', '👐', '🤲', '🙏', '🤝',
                                '🧠', '🗣', '👤', '👥', '🫂', '⚡️', '🌟', '💥', '💯', '🏆',
                                '💰', '💸', '💳', '🧾', '📊', '📉', '💼', '📅', '📝', '🔒', '🔑', '🛠'
                            ].map((e) => (
                                <button
                                    key={e}
                                    type="button"
                                    onClick={() => updateSlideData(activeSlide.id, { emoji: e })}
                                    className={cn(
                                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 text-xl transition active:scale-90",
                                        activeSlide.data.emoji === e ? "border-[#7C3AED] bg-white scale-110" : "border-gray-100 bg-white hover:border-gray-200"
                                    )}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeSlide.layout === "intro-headshot" && (
                    <div className="space-y-4 rounded-2xl border border-violet-100 bg-violet-50/20 p-4">
                        <div className="flex items-center justify-between border-b border-violet-100 pb-3">
                            <span className="text-[11px] font-bold uppercase text-violet-400">Positioning</span>
                            <div className="flex gap-1 rounded-lg bg-gray-200 p-1">
                                {['top', 'bottom'].map((pos) => (
                                    <button
                                        key={pos}
                                        type="button"
                                        onClick={() => updateSlideData(activeSlide.id, { imagePosition: pos as any })}
                                        className={cn(
                                            "px-4 py-1.5 text-[10px] font-bold uppercase rounded-md transition",
                                            activeSlide.data.imagePosition === pos ? "bg-white text-gray-900" : "text-gray-500"
                                        )}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <ImageUploadSection activeSlide={activeSlide} updateSlideData={updateSlideData} label="Profile Headshot" isHeadshot />
                    </div>
                )}

                {activeSlide.layout === "intro-image" && (
                    <div className="space-y-4 rounded-2xl border border-violet-100 bg-violet-50/20 p-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-bold uppercase text-violet-400">Image Scale</label>
                                <span className="text-[10px] font-bold text-violet-600">{(activeSlide.data.imageScale || 1).toFixed(1)}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.4"
                                max="2.5"
                                step="0.05"
                                value={activeSlide.data.imageScale || 1}
                                onChange={(e) => updateSlideData(activeSlide.id, { imageScale: parseFloat(e.target.value) })}
                                className="h-1.5 w-full appearance-none rounded-lg bg-violet-200 accent-[#7C3AED]"
                            />
                        </div>
                        <ImageUploadSection activeSlide={activeSlide} updateSlideData={updateSlideData} label="Decorative Image" />
                    </div>
                )}
            </div>


            {/* Content Slide Specific Tabs */}
            {activeSlide.role === "content" && (
                <div className="flex w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50 p-1 mb-2">
                    {[
                        { id: 'text', label: 'Text', icon: Type },
                        { id: 'text-image', label: 'Text + Image', icon: Layout },
                        { id: 'image', label: 'Image', icon: ImageIcon },
                    ].map((tab) => {
                        const textLayouts = ["center", "top", "dual-column"];
                        const textImageLayouts = ["split-left", "split-right", "image-top", "image-left", "image-right"];
                        const imageLayouts = ["full-image"];

                        let isActive = false;
                        if (tab.id === 'text') isActive = textLayouts.includes(activeSlide.layout);
                        if (tab.id === 'text-image') isActive = textImageLayouts.includes(activeSlide.layout);
                        if (tab.id === 'image') isActive = imageLayouts.includes(activeSlide.layout);

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    if (tab.id === 'text') updateSlideMeta(activeSlide.id, { layout: 'center' });
                                    if (tab.id === 'text-image') updateSlideMeta(activeSlide.id, { layout: 'split-left' });
                                    if (tab.id === 'image') updateSlideMeta(activeSlide.id, { layout: 'full-image' });
                                }}
                                className={cn(
                                    "flex flex-1 flex-col items-center justify-center gap-1.5 rounded-lg py-2 transition",
                                    isActive
                                        ? "bg-white text-[#7C3AED] ring-1 ring-black/5"
                                        : "text-gray-400 hover:bg-white/50 hover:text-gray-600"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Content Mode Image Uploader */}
            {activeSlide.role === "content" && layoutSupportsImage && (
                <div className="mt-2 space-y-3 rounded-xl border border-violet-100 bg-violet-50/20 p-3">
                    <ImageUploadSection activeSlide={activeSlide} updateSlideData={updateSlideData} label="Slide Image" />
                </div>
            )}

            {activeSlide.role === "content" && (
                <div className="space-y-1">
                    <label className="mb-0.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Detailed Layout
                    </label>
                    <select
                        value={activeSlide.layout}
                        onChange={(e) =>
                            updateSlideMeta(activeSlide.id, {
                                layout: e.target.value as any,
                            })
                        }
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 h-8 text-[11px] text-gray-900 outline-none focus:border-gray-500"
                    >

                        {["center", "dual-column"].map(l => (
                            <option key={l} value={l}>{l.replace('-', ' ')}</option>
                        ))}
                        {["split-left", "split-right", "image-top", "image-left", "image-right"].map(l => (
                            <option key={l} value={l}>{l.replace('-', ' ')}</option>
                        ))}
                        <option value="full-image">full image</option>
                    </select>
                </div>
            )}

            {/* Tagline / Badge */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FieldToggle
                        checked={activeSlide.data.badge !== ""}
                        onChange={(val) => updateSlideData(activeSlide.id, { badge: val ? "Main Tagline" : "" })}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                        {activeSlide.role === "intro" ? "Tagline" : "Badge"}
                    </span>
                </div>
                {activeSlide.data.badge !== "" && (
                    <input
                        type="text"
                        value={activeSlide.data.badge ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { badge: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-500"
                        placeholder="e.g. Tips for growth"
                    />
                )}
            </div>

            {/* Title */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FieldToggle
                        checked={activeSlide.data.title !== ""}
                        onChange={(val) => updateSlideData(activeSlide.id, { title: val ? "Big Catchy Title" : "" })}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                        {activeSlide.layout === "dual-column" ? "Left Title" : "Title"}
                    </span>
                </div>
                {activeSlide.data.title !== "" && (
                    <textarea
                        rows={2}
                        value={activeSlide.data.title ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { title: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 font-bold outline-none focus:border-gray-500"
                        placeholder="Hook sentences go here..."
                    />
                )}
            </div>

            {/* Paragraph / Body */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FieldToggle
                        checked={activeSlide.data.body !== ""}
                        onChange={(val) => updateSlideData(activeSlide.id, { body: val ? "Additional value description..." : "" })}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                        {activeSlide.layout === "dual-column" ? "Left Body" : (activeSlide.role === "intro" ? "Paragraph" : "Body")}
                    </span>
                </div>
                {activeSlide.data.body !== "" && (
                    <textarea
                        rows={3}
                        value={activeSlide.data.body ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { body: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-500"
                        placeholder="Explain further..."
                    />
                )}
            </div>

            {/* Column 2 Content (Dual Column ONLY) */}
            {activeSlide.layout === "dual-column" && (
                <div className="space-y-4 pt-4 border-t border-violet-100 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-4 w-1 bg-[#7C3AED] rounded-full" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#7C3AED]">Right Column</span>
                    </div>

                    {/* Right Title */}
                    <div className="space-y-3 pl-3 border-l-2 border-violet-50">
                        <div className="flex items-center gap-3">
                            <FieldToggle
                                checked={(activeSlide.data.title2?.length ?? 0) > 0}
                                onChange={(val) => updateSlideData(activeSlide.id, { title2: val ? "Right Side Title" : "" })}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Right Title</span>
                        </div>
                        {(activeSlide.data.title2?.length ?? 0) > 0 && (
                            <textarea
                                rows={2}
                                value={activeSlide.data.title2 ?? ""}
                                onChange={(e) => updateSlideData(activeSlide.id, { title2: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 font-bold outline-none focus:border-gray-500"
                                placeholder="Right side heading..."
                            />
                        )}
                    </div>

                    {/* Right Body */}
                    <div className="space-y-3 pl-3 border-l-2 border-violet-50">
                        <div className="flex items-center gap-3">
                            <FieldToggle
                                checked={(activeSlide.data.body2?.length ?? 0) > 0}
                                onChange={(val) => updateSlideData(activeSlide.id, { body2: val ? "Right side description..." : "" })}
                            />
                            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">Right Body</span>
                        </div>
                        {(activeSlide.data.body2?.length ?? 0) > 0 && (
                            <textarea
                                rows={3}
                                value={activeSlide.data.body2 ?? ""}
                                onChange={(e) => updateSlideData(activeSlide.id, { body2: e.target.value })}
                                className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-500"
                                placeholder="Explain right side..."
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Swipe / Button */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FieldToggle
                        checked={activeSlide.data.buttonText !== ""}
                        onChange={(val) => updateSlideData(activeSlide.id, { buttonText: val ? "Swipe" : "" })}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">
                        {activeSlide.role === "intro" ? "Swipe Indicator" : "Button Text"}
                    </span>
                </div>
                {activeSlide.data.buttonText !== "" && (
                    <input
                        type="text"
                        value={activeSlide.data.buttonText ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { buttonText: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 bg-white px-2 py-1 text-xs text-gray-900 outline-none focus:border-gray-500"
                        placeholder="Swipe ->"
                    />
                )}
            </div>
        </div>
    );
}

function ImageUploadSection({
    activeSlide,
    updateSlideData,
    label,
    isHeadshot = false
}: {
    activeSlide: CarouselSlide;
    updateSlideData: (id: string, data: Partial<CarouselSlide["data"]>) => void;
    label: string;
    isHeadshot?: boolean;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-700">{label}</span>
                {activeSlide.data.image && (
                    <button
                        type="button"
                        onClick={() => updateSlideData(activeSlide.id, { image: "" })}
                        className="text-[10px] font-bold text-red-500 uppercase hover:underline"
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5">
                {activeSlide.data.image ? (
                    <img src={activeSlide.data.image} alt="Preview" className="h-full w-full rounded-2xl object-cover" />
                ) : (
                    <>
                        {isHeadshot ? (
                            <User className="mb-2 h-10 w-10 text-violet-300" />
                        ) : (
                            <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                        )}
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                            {isHeadshot ? "UPLOAD HEADSHOT" : "UPLOAD IMAGE"}
                        </span>
                    </>
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => updateSlideData(activeSlide.id, { image: ev.target?.result as string });
                        reader.readAsDataURL(file);
                    }}
                />
            </div>
        </div>
    );
}
