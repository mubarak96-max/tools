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
    Check
} from "lucide-react";
import { useCarousel } from "./useCarousel";
import { cn } from "@/lib/utils";
import { CarouselSlide, CarouselTemplate } from "@/lib/carousel/types";
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
        setActiveSlideId,
        template,
        setTemplate,
        prevSlide,
        nextSlide,
    } = useCarousel(initialTemplateId);

    const activeSlide = slides.find((s) => s.id === activeSlideId) || slides[0];
    const currentIndex = slides.findIndex((s) => s.id === activeSlide.id);

    return (
        <div className="flex flex-col gap-8 max-w-[560px] mx-auto pb-20">
            {/* Top Preview Canvas */}
            <div className="flex flex-col gap-6">
                <div 
                    className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-gray-200 bg-white shadow-2xl"
                    style={{ background: template.styles.colors.background }}
                >
                    <SlideRenderer 
                        slide={activeSlide} 
                        template={template} 
                        slideIndex={currentIndex}
                        totalSlides={slides.length}
                    />
                </div>

                {/* Main Navigation Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={prevSlide}
                            disabled={currentIndex === 0}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="flex h-10 items-center px-4 rounded-xl bg-gray-50 text-[11px] font-black uppercase tracking-widest text-gray-400">
                            Slide {currentIndex + 1} / {slides.length}
                        </div>
                        <button 
                            onClick={nextSlide}
                            disabled={currentIndex === slides.length - 1}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500 transition hover:bg-gray-100 disabled:opacity-30"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={addSlide}
                            className="flex h-10 gap-2 items-center px-4 rounded-xl bg-violet-600 text-white transition hover:bg-violet-700 shadow-sm shadow-violet-200"
                        >
                            <Plus className="h-4 w-4" />
                            <span className="text-xs font-bold uppercase">ADD SLIDE</span>
                        </button>

                        <button
                            onClick={() => duplicateSlide(activeSlide.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                            title="Duplicate Slide"
                        >
                            <Copy className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => deleteSlide(activeSlide.id)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            title="Delete Slide"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Workstation */}
            <div className="rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-xl">
                <EditorFields 
                    activeSlide={activeSlide} 
                    updateSlideData={updateSlideData} 
                    updateSlideMeta={updateSlideMeta}
                    template={template}
                />
            </div>

            {/* Template & Visual Style Picker (RESORED) */}
            <div className="space-y-8 rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-xl">
                {/* Template Selection */}
                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <Palette className="h-4 w-4" />
                        Choose Template Style
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {carouselTemplates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id)}
                                className={cn(
                                    "group relative flex flex-col gap-2 rounded-2xl border-2 p-3 text-left transition",
                                    template.id === t.id 
                                        ? "border-violet-600 bg-violet-50/50" 
                                        : "border-gray-100 bg-gray-50/30 hover:border-gray-200"
                                )}
                            >
                                <div 
                                    className="aspect-video w-full rounded-lg shadow-sm"
                                    style={{ background: t.styles.colors.background }}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-600">{t.name}</span>
                                {template.id === t.id && (
                                    <div className="absolute right-2 top-2 rounded-full bg-violet-600 p-1 text-white shadow-lg">
                                        <Check className="h-3 w-3" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Background Pattern Selection */}
                <div className="space-y-4 pt-8 border-t border-gray-100">
                    <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
                        <Shapes className="h-4 w-4" />
                        Background Effect
                    </h3>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                        {backgroundPresets.map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => {
                                    // Implementation of setBackground would go here if exposed by hook
                                    // For now, template determines background, but we can allow overrides
                                }}
                                className={cn(
                                    "relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border transition",
                                    "border-gray-100 bg-gray-50/50 hover:border-gray-300"
                                )}
                                title={bg.name}
                            >
                                <div className="text-[14px]">🎨</div>
                                <span className="text-[8px] font-bold uppercase text-gray-400">{bg.name.split(' ')[0]}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
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
        <div className="space-y-6">
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
                                            ? "bg-white text-[#7C3AED] shadow-sm ring-1 ring-black/5" 
                                            : "text-gray-400 hover:bg-white/50 hover:text-gray-600"
                                    )}
                                >
                                    <tab.icon className="h-4 w-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Intro Specific Controls */}
                    {activeSlide.layout === "intro-emoji" && (
                        <div className="space-y-2 py-4 border-y border-violet-100 bg-violet-50/30 px-3 -mx-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-violet-500">Choose your Hook Emoji</label>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {['🚀', '💡', '🔥', '👀', '✨', '✅', '📈', '📣', '💎', '🎯'].map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => updateSlideData(activeSlide.id, { emoji: e })}
                                        className={cn(
                                            "flex h-11 w-11 items-center justify-center rounded-xl border-2 text-xl transition active:scale-90",
                                            activeSlide.data.emoji === e ? "border-[#7C3AED] bg-white shadow-md scale-110" : "border-gray-100 bg-white hover:border-gray-200"
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
                                                activeSlide.data.imagePosition === pos ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
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
            )}

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
                                        ? "bg-white text-[#7C3AED] shadow-sm ring-1 ring-black/5" 
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
                <div className="mt-4 space-y-4 rounded-2xl border border-violet-100 bg-violet-50/20 p-4">
                    <ImageUploadSection activeSlide={activeSlide} updateSlideData={updateSlideData} label="Slide Image" />
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        Role
                    </label>
                    <select
                        value={activeSlide.role}
                        onChange={(e) =>
                            updateSlideMeta(activeSlide.id, {
                                role: e.target.value as "intro" | "content" | "outro",
                            })
                        }
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                    >
                        <option value="intro">Intro</option>
                        <option value="content">Content</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>

                {(activeSlide.role !== "intro" || activeSlide.layout === "intro-standard" || activeSlide.layout === "top") && (
                    <div>
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            Specific Layout
                        </label>
                        <select
                            value={activeSlide.layout}
                            onChange={(e) =>
                                updateSlideMeta(activeSlide.id, {
                                    layout: e.target.value as any,
                                })
                            }
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                        >
                            {activeSlide.role === "intro" ? (
                                <>
                                    <option value="intro-standard">Standard (Center)</option>
                                    <option value="top">Top Aligned</option>
                                </>
                            ) : (
                                <>
                                    {["center", "top", "dual-column"].map(l => (
                                        <option key={l} value={l}>{l.replace('-', ' ')}</option>
                                    ))}
                                    {["split-left", "split-right", "image-top", "image-left", "image-right"].map(l => (
                                        <option key={l} value={l}>{l.replace('-', ' ')}</option>
                                    ))}
                                    <option value="full-image">full image</option>
                                </>
                            )}
                        </select>
                    </div>
                )}
            </div>

            {/* Tagline / Badge */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FieldToggle 
                        checked={activeSlide.data.badge !== ""} 
                        onChange={(val) => updateSlideData(activeSlide.id, { badge: val ? "Main Tagline" : "" })}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
                        {activeSlide.role === "intro" ? "Tagline" : "Badge"}
                    </span>
                </div>
                {activeSlide.data.badge !== "" && (
                    <input
                        type="text"
                        value={activeSlide.data.badge ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { badge: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
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
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">Title</span>
                </div>
                {activeSlide.data.title !== "" && (
                    <textarea
                        rows={2}
                        value={activeSlide.data.title ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { title: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-bold outline-none focus:border-gray-500"
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
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
                         {activeSlide.role === "intro" ? "Paragraph" : "Body"}
                    </span>
                </div>
                {activeSlide.data.body !== "" && (
                     <textarea
                        rows={3}
                        value={activeSlide.data.body ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { body: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
                        placeholder="Explain further..."
                    />
                )}
            </div>

            {/* Swipe / Button */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <FieldToggle 
                        checked={activeSlide.data.buttonText !== ""} 
                        onChange={(val) => updateSlideData(activeSlide.id, { buttonText: val ? "Swipe" : "" })}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">
                         {activeSlide.role === "intro" ? "Swipe Indicator" : "Button Text"}
                    </span>
                </div>
                {activeSlide.data.buttonText !== "" && (
                    <input
                        type="text"
                        value={activeSlide.data.buttonText ?? ""}
                        onChange={(e) => updateSlideData(activeSlide.id, { buttonText: e.target.value })}
                        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500"
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
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">{label}</span>
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
