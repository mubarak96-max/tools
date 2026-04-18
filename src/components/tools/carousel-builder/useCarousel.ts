"use client";

import { useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
    CarouselDocument,
    CarouselSlide,
    CarouselTemplate,
    SlideRole,
    SlideLayout,
    ImageBehavior,
    BackgroundPreset,
} from "@/lib/carousel/types";
import { carouselTemplates, getCarouselTemplateById } from "@/lib/carousel/templates";
import { backgroundPresets, getBackgroundPresetById } from "@/lib/carousel/backgrounds";

type UpdateSlideDataInput = Partial<CarouselSlide["data"]>;

type CreateSlideOverrides = Partial<{
    role: SlideRole;
    layout: SlideLayout;
    imageBehavior: ImageBehavior;
    data: CarouselSlide["data"];
}>;

type UseCarouselOptions = {
    initialTemplateId?: string;
};

type UseCarouselReturn = {
    document: CarouselDocument;
    template: CarouselTemplate | undefined;
    background: BackgroundPreset | undefined;
    templates: CarouselTemplate[];
    backgrounds: BackgroundPreset[];
    activeSlideId: string | null;
    activeSlide: CarouselSlide | undefined;

    setActiveSlide: (slideId: string) => void;
    setTemplate: (templateId: string) => void;
    resetFromTemplate: (templateId?: string) => void;
    setBackground: (backgroundId?: string) => void;

    updateSlideData: (slideId: string, updates: UpdateSlideDataInput) => void;
    updateSlideMeta: (
        slideId: string,
        updates: Partial<Pick<CarouselSlide, "role" | "layout" | "imageBehavior">>
    ) => void;

    addSlide: (overrides?: CreateSlideOverrides, insertAtIndex?: number) => void;
    duplicateSlide: (slideId: string) => void;
    deleteSlide: (slideId: string) => void;
    reorderSlides: (fromIndex: number, toIndex: number) => void;
    slides: CarouselSlide[];
    prevSlide: () => void;
    nextSlide: () => void;
};

const cloneSlideData = (data?: CarouselSlide["data"]): CarouselSlide["data"] => ({
    title: data?.title ?? "",
    body: data?.body ?? "",
    bullets: data?.bullets ? [...data.bullets] : [],
    badge: data?.badge ?? "",
    buttonText: data?.buttonText ?? "",
    image: data?.image ?? "",
});

const presetToEditableSlide = (
    preset: CarouselTemplate["starterSlides"][number]
): CarouselSlide => ({
    id: uuidv4(),
    role: preset.role,
    layout: preset.layout,
    imageBehavior: preset.imageBehavior,
    data: cloneSlideData(preset.dummy),
});

const createSlidesFromTemplate = (template: CarouselTemplate): CarouselSlide[] =>
    template.starterSlides.map(presetToEditableSlide);

const buildDocumentFromTemplate = (template: CarouselTemplate): CarouselDocument => ({
    templateId: template.id,
    slides: createSlidesFromTemplate(template),
    backgroundId: template.background?.presetId,
});

const createBlankSlideFromRole = (role: SlideRole): CarouselSlide => {
    const defaultsByRole: Record<
        SlideRole,
        { layout: SlideLayout; imageBehavior: ImageBehavior; data: CarouselSlide["data"] }
    > = {
        intro: {
            layout: "center",
            imageBehavior: "none",
            data: {
                title: "",
                body: "",
                bullets: [],
                badge: "",
                buttonText: "",
                image: "",
            },
        },
        content: {
            layout: "top",
            imageBehavior: "none",
            data: {
                title: "",
                body: "",
                bullets: [],
                badge: "",
                buttonText: "",
                image: "",
            },
        },
        outro: {
            layout: "center",
            imageBehavior: "none",
            data: {
                title: "",
                body: "",
                bullets: [],
                badge: "",
                buttonText: "",
                image: "",
            },
        },
    };

    const base = defaultsByRole[role];

    return {
        id: uuidv4(),
        role,
        layout: base.layout,
        imageBehavior: base.imageBehavior,
        data: cloneSlideData(base.data),
    };
};

export function useCarousel(options?: UseCarouselOptions): UseCarouselReturn {
    const initialTemplate =
        (options?.initialTemplateId && getCarouselTemplateById(options.initialTemplateId)) ||
        carouselTemplates[0];

    const [document, setDocument] = useState<CarouselDocument>(() =>
        buildDocumentFromTemplate(initialTemplate)
    );

    const [activeSlideId, setActiveSlideId] = useState<string | null>(
        document.slides[0]?.id ?? null
    );

    const template = useMemo(
        () => getCarouselTemplateById(document.templateId),
        [document.templateId]
    );

    const background = useMemo(
        () =>
            document.backgroundId ? getBackgroundPresetById(document.backgroundId) : undefined,
        [document.backgroundId]
    );

    const activeSlide = useMemo(
        () => document.slides.find((slide) => slide.id === activeSlideId),
        [document.slides, activeSlideId]
    );

    const setActiveSlide = useCallback((slideId: string) => {
        setActiveSlideId(slideId);
    }, []);

    const setTemplate = useCallback((templateId: string) => {
        const nextTemplate = getCarouselTemplateById(templateId);
        if (!nextTemplate) return;

        const nextDocument = buildDocumentFromTemplate(nextTemplate);

        setDocument(nextDocument);
        setActiveSlideId(nextDocument.slides[0]?.id ?? null);
    }, []);

    const resetFromTemplate = useCallback(
        (templateId?: string) => {
            const resolvedTemplateId = templateId ?? document.templateId;
            const nextTemplate = getCarouselTemplateById(resolvedTemplateId);
            if (!nextTemplate) return;

            const nextDocument = buildDocumentFromTemplate(nextTemplate);

            setDocument(nextDocument);
            setActiveSlideId(nextDocument.slides[0]?.id ?? null);
        },
        [document.templateId]
    );

    const setBackground = useCallback((backgroundId?: string) => {
        setDocument((prev) => ({
            ...prev,
            backgroundId: backgroundId || undefined,
        }));
    }, []);

    const updateSlideData = useCallback(
        (slideId: string, updates: UpdateSlideDataInput) => {
            setDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((slide) =>
                    slide.id === slideId
                        ? {
                            ...slide,
                            data: {
                                ...slide.data,
                                ...updates,
                                bullets: updates.bullets
                                    ? [...updates.bullets]
                                    : slide.data.bullets ?? [],
                            },
                        }
                        : slide
                ),
            }));
        },
        []
    );

    const updateSlideMeta = useCallback(
        (
            slideId: string,
            updates: Partial<Pick<CarouselSlide, "role" | "layout" | "imageBehavior">>
        ) => {
            setDocument((prev) => ({
                ...prev,
                slides: prev.slides.map((slide) =>
                    slide.id === slideId
                        ? {
                            ...slide,
                            ...updates,
                        }
                        : slide
                ),
            }));
        },
        []
    );

    const addSlide = useCallback(
        (overrides?: CreateSlideOverrides, insertAtIndex?: number) => {
            const role = overrides?.role ?? "content";
            const baseSlide = createBlankSlideFromRole(role);

            const nextSlide: CarouselSlide = {
                ...baseSlide,
                role: overrides?.role ?? baseSlide.role,
                layout: overrides?.layout ?? baseSlide.layout,
                imageBehavior: overrides?.imageBehavior ?? baseSlide.imageBehavior,
                data: {
                    ...baseSlide.data,
                    ...(overrides?.data ?? {}),
                    bullets: overrides?.data?.bullets
                        ? [...overrides.data.bullets]
                        : baseSlide.data.bullets ?? [],
                },
            };

            setDocument((prev) => {
                const slides = [...prev.slides];

                if (
                    typeof insertAtIndex === "number" &&
                    insertAtIndex >= 0 &&
                    insertAtIndex <= slides.length
                ) {
                    slides.splice(insertAtIndex, 0, nextSlide);
                } else {
                    slides.push(nextSlide);
                }

                return {
                    ...prev,
                    slides,
                };
            });

            setActiveSlideId(nextSlide.id);
        },
        []
    );

    const duplicateSlide = useCallback((slideId: string) => {
        const newId = uuidv4();
        setDocument((prev) => {
            const index = prev.slides.findIndex((slide) => slide.id === slideId);
            if (index === -1) return prev;

            const source = prev.slides[index];
            const duplicated: CarouselSlide = {
                ...source,
                id: newId,
                role: (source.role === "intro" || source.role === "outro") ? "content" : source.role,
                data: cloneSlideData(source.data),
            };

            const slides = [...prev.slides];
            slides.splice(index + 1, 0, duplicated);

            return {
                ...prev,
                slides,
            };
        });

        setActiveSlideId(newId);
    }, [setActiveSlideId]);

    const deleteSlide = useCallback(
        (slideId: string) => {
            setDocument((prev) => {
                if (prev.slides.length <= 1) {
                    return prev;
                }

                const index = prev.slides.findIndex((slide) => slide.id === slideId);
                if (index === -1) return prev;

                const slides = prev.slides.filter((slide) => slide.id !== slideId);

                if (activeSlideId === slideId) {
                    const fallbackSlide = slides[index] ?? slides[index - 1] ?? slides[0] ?? null;
                    setActiveSlideId(fallbackSlide?.id ?? null);
                }

                return {
                    ...prev,
                    slides,
                };
            });
        },
        [activeSlideId]
    );

    const reorderSlides = useCallback((fromIndex: number, toIndex: number) => {
        setDocument((prev) => {
            if (
                fromIndex < 0 ||
                toIndex < 0 ||
                fromIndex >= prev.slides.length ||
                toIndex >= prev.slides.length ||
                fromIndex === toIndex
            ) {
                return prev;
            }

            const slides = [...prev.slides];
            const [moved] = slides.splice(fromIndex, 1);
            slides.splice(toIndex, 0, moved);

            return {
                ...prev,
                slides,
            };
        });
    }, []);

    const prevSlide = useCallback(() => {
        setDocument((prev) => {
            const index = prev.slides.findIndex((s) => s.id === activeSlideId);
            if (index > 0) {
                setActiveSlideId(prev.slides[index - 1].id);
            }
            return prev;
        });
    }, [activeSlideId]);

    const nextSlide = useCallback(() => {
        setDocument((prev) => {
            const index = prev.slides.findIndex((s) => s.id === activeSlideId);
            if (index !== -1 && index < prev.slides.length - 1) {
                setActiveSlideId(prev.slides[index + 1].id);
            }
            return prev;
        });
    }, [activeSlideId]);

    return {
        document,
        template,
        background,
        templates: carouselTemplates,
        backgrounds: backgroundPresets,
        activeSlideId,
        activeSlide,

        setActiveSlide,
        setTemplate,
        resetFromTemplate,
        setBackground,

        updateSlideData,
        updateSlideMeta,

        addSlide,
        duplicateSlide,
        deleteSlide,
        reorderSlides,
        slides: document.slides,
        prevSlide,
        nextSlide,
    };
}