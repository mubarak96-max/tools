import { CarouselTemplate } from "./types";

export const carouselTemplates: CarouselTemplate[] = [
    {
        id: "split-hero-rocket",
        name: "Split Hero Rocket",
        description: "Bold split intro with numbered content slides and CTA.",
        styles: {
            colors: {
                background: "#F4A62A",
                text: "#FFFFFF",
                primary: "#2B6BFF",
                accent: "#1D3E8A",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 48,
                bodySize: 18,
                lineHeight: 1.4,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 40,
                gap: 18,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "split-hero-orbit",
            },
        },
        background: {
            presetId: "round-arrows",
            opacity: 0.14,
            scale: 1,
        },
        starterSlides: [
            {
                id: "split-hero-rocket-intro",
                role: "intro",
                layout: "split-left",
                imageBehavior: "hero-right",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Unlock Your Potential",
                    body: "Start with a bold opening, strong hierarchy, and a clear visual anchor.",
                    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800",
                },
                placeholders: {
                    title: "Add your main headline",
                    body: "Add a short supporting intro",
                },
                constraints: {
                    maxTitleChars: 60,
                    maxBodyLines: 3,
                },
            },
            {
                id: "split-hero-rocket-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "01",
                    title: "Define the first step",
                    body: "Use a short heading and a compact explanation that is easy to scan on mobile.",
                },
                placeholders: {
                    badge: "01",
                    title: "Add step title",
                    body: "Add step description",
                },
                constraints: {
                    maxTitleChars: 42,
                    maxBodyLines: 4,
                },
                meta: {
                    showStepNumber: true,
                    stepIndex: 1,
                },
            },
            {
                id: "split-hero-rocket-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "02",
                    title: "Build momentum",
                    body: "Repeat the structure so the carousel feels coherent, polished, and easy to follow.",
                },
                placeholders: {
                    badge: "02",
                    title: "Add step title",
                    body: "Add step description",
                },
                constraints: {
                    maxTitleChars: 42,
                    maxBodyLines: 4,
                },
                meta: {
                    showStepNumber: true,
                    stepIndex: 2,
                },
            },
            {
                id: "split-hero-rocket-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Launch Your Next Carousel",
                    buttonText: "Get Started",
                },
                placeholders: {
                    title: "Add your closing message",
                    buttonText: "Add CTA",
                },
                constraints: {
                    maxTitleChars: 58,
                },
            },
        ],
    },

    {
        id: "editorial-fashion-showcase",
        name: "Editorial Fashion Showcase",
        description: "Image-led editorial carousel with stylish typography.",
        styles: {
            colors: {
                background: "#F4EADB",
                text: "#1D1D1D",
                primary: "#E0865D",
                accent: "#3A2A22",
            },
            typography: {
                fontTitle: "Playfair Display",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 16,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "soft-editorial-arrows",
            },
        },
        background: {
            presetId: "arrows",
            opacity: 0.18,
            scale: 1.05,
        },
        starterSlides: [
            {
                id: "editorial-fashion-showcase-intro",
                role: "intro",
                layout: "split-right",
                imageBehavior: "hero-left",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Top Trends This Season",
                    body: "Pair an elegant title with a fashion-led visual to create an editorial first impression.",
                    image: "https://images.unsplash.com/photo-1483985988355-661f046ae9b1?q=80&w=800",
                },
                placeholders: {
                    title: "Add cover title",
                    body: "Add intro text",
                },
            },
            {
                id: "editorial-fashion-showcase-content-1",
                role: "content",
                layout: "image-left",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Minimal Statement Pieces",
                    body: "Use supporting visuals inside content slides when the product itself carries the message.",
                    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
                },
                placeholders: {
                    title: "Add content title",
                    body: "Add supporting copy",
                },
            },
            {
                id: "editorial-fashion-showcase-content-2",
                role: "content",
                layout: "image-left",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Refined Everyday Looks",
                    body: "Keep the same composition so the carousel feels consistent from slide to slide.",
                    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800",
                },
                placeholders: {
                    title: "Add content title",
                    body: "Add supporting copy",
                },
            },
            {
                id: "editorial-fashion-showcase-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Save This Style Board",
                    buttonText: "Explore More",
                },
                placeholders: {
                    title: "Add closing statement",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "soft-wellness-minimal",
        name: "Soft Wellness Minimal",
        description: "Clean, calm, centered template for gentle self-improvement content.",
        styles: {
            colors: {
                background: "#F8F2EA",
                text: "#2B2B2B",
                primary: "#C49A6C",
                accent: "#8D6E63",
            },
            typography: {
                fontTitle: "Cormorant Garamond",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 42,
                gap: 14,
                radius: 20,
            },
            decorations: {
                shapes: true,
                pattern: "soft-circles",
            },
        },
        background: {
            presetId: "dots",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "soft-wellness-minimal-intro",
                role: "intro",
                layout: "minimal-center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Small Habits Matter",
                    body: "Use a calm headline and short supporting text to create an inviting first slide.",
                },
                placeholders: {
                    title: "Add your headline",
                    body: "Add intro message",
                },
            },
            {
                id: "soft-wellness-minimal-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Create space to pause",
                    body: "A little more white space makes reflective content feel softer and easier to absorb.",
                },
                placeholders: {
                    title: "Add point title",
                    body: "Add point description",
                },
            },
            {
                id: "soft-wellness-minimal-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Choose fewer words",
                    body: "Minimal templates work best when each slide communicates one clear idea.",
                },
                placeholders: {
                    title: "Add point title",
                    body: "Add point description",
                },
            },
            {
                id: "soft-wellness-minimal-outro",
                role: "outro",
                layout: "minimal-center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Take What Helps",
                    buttonText: "Save Post",
                },
                placeholders: {
                    title: "Add final takeaway",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "reflective-editorial",
        name: "Reflective Editorial",
        description: "Text-led reflective carousel with bold highlighted statements.",
        styles: {
            colors: {
                background: "#F7EFE7",
                text: "#1E1E1E",
                primary: "#D88B5D",
                accent: "#6B4E3D",
            },
            typography: {
                fontTitle: "Playfair Display",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 38,
                gap: 16,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "editorial-ring",
            },
        },
        background: {
            presetId: "round-arrows",
            opacity: 0.1,
            scale: 1,
        },
        starterSlides: [
            {
                id: "reflective-editorial-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Ideas I Had to Rethink",
                    body: "A reflective intro works best with a thoughtful title and restrained visual noise.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro note",
                },
            },
            {
                id: "reflective-editorial-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "What sounded right was not always useful",
                    body: "Use content slides to contrast an old belief with a clearer perspective.",
                },
                placeholders: {
                    title: "Add reflection title",
                    body: "Add explanation",
                },
            },
            {
                id: "reflective-editorial-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Simple ideas often perform better",
                    body: "Keep the rhythm steady so the carousel reads like one connected thought.",
                },
                placeholders: {
                    title: "Add reflection title",
                    body: "Add explanation",
                },
            },
            {
                id: "reflective-editorial-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "What Would You Rethink?",
                    buttonText: "Share Thought",
                },
                placeholders: {
                    title: "Add closing question",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "soft-guidance-cards",
        name: "Soft Guidance Cards",
        description: "Gentle advice template with warm shapes and balanced text blocks.",
        styles: {
            colors: {
                background: "#DCEAFE",
                text: "#16324F",
                primary: "#F4A261",
                accent: "#5B7DB1",
            },
            typography: {
                fontTitle: "DM Serif Display",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 36,
                gap: 16,
                radius: 20,
            },
            decorations: {
                shapes: true,
                pattern: "soft-organic-blobs",
            },
        },
        background: {
            presetId: "waves",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "soft-guidance-cards-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Build Stronger Connections",
                    body: "This template is designed for warm, human advice with soft visual framing.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro text",
                },
            },
            {
                id: "soft-guidance-cards-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Listen before you respond",
                    body: "Advice slides should feel supportive, concise, and emotionally clear.",
                },
                placeholders: {
                    title: "Add advice title",
                    body: "Add advice description",
                },
            },
            {
                id: "soft-guidance-cards-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Be consistent in small ways",
                    body: "A repeatable layout makes relationship and emotional content easier to follow.",
                },
                placeholders: {
                    title: "Add advice title",
                    body: "Add advice description",
                },
            },
            {
                id: "soft-guidance-cards-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Keep This Close",
                    buttonText: "Save Post",
                },
                placeholders: {
                    title: "Add closing message",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "benefit-icons-center",
        name: "Benefit Icons Center",
        description: "Centered educational benefit carousel with icon support.",
        styles: {
            colors: {
                background: "#E9F7E9",
                text: "#1E3A2F",
                primary: "#4CAF50",
                accent: "#0F766E",
            },
            typography: {
                fontTitle: "Poppins",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 16,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "benefit-bubbles",
            },
        },
        background: {
            presetId: "dots",
            opacity: 0.09,
            scale: 1,
        },
        starterSlides: [
            {
                id: "benefit-icons-center-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Benefits You Should Know",
                    body: "Use this template for educational topics that work best as simple, digestible takeaways.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add short intro",
                },
            },
            {
                id: "benefit-icons-center-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Supports daily balance",
                    body: "A small supporting visual can make informational slides easier to remember.",
                    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800",
                },
                placeholders: {
                    title: "Add benefit title",
                    body: "Add benefit description",
                },
            },
            {
                id: "benefit-icons-center-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Adds structure to learning",
                    body: "Keep each benefit separate so readers can pause on each point without overload.",
                    image: "https://images.unsplash.com/photo-1557683311-eac922347aa1?q=80&w=800",
                },
                placeholders: {
                    title: "Add benefit title",
                    body: "Add benefit description",
                },
            },
            {
                id: "benefit-icons-center-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Save These Benefits",
                    buttonText: "Save Post",
                },
                placeholders: {
                    title: "Add summary takeaway",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "active-lifestyle-hybrid",
        name: "Active Lifestyle Hybrid",
        description: "Bold hybrid template with images inside intro and content slides.",
        styles: {
            colors: {
                background: "#F6E05E",
                text: "#132A13",
                primary: "#2B9348",
                accent: "#40916C",
            },
            typography: {
                fontTitle: "Poppins",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 32,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "active-arrows",
            },
        },
        background: {
            presetId: "arrows",
            opacity: 0.12,
            scale: 1.1,
        },
        starterSlides: [
            {
                id: "active-lifestyle-hybrid-intro",
                role: "intro",
                layout: "split-left",
                imageBehavior: "overlap-next",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Move With Intention",
                    body: "This opening uses a visual subject that leads the eye toward the next slide.",
                    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro text",
                },
            },
            {
                id: "active-lifestyle-hybrid-content-1",
                role: "content",
                layout: "image-right",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Keep one point per slide",
                    body: "Use strong visuals in content slides only when they reinforce the message instead of distracting from it.",
                    image: "https://images.unsplash.com/photo-1571019613454-1eb2f677259e?q=80&w=800",
                },
                placeholders: {
                    title: "Add point title",
                    body: "Add point description",
                },
            },
            {
                id: "active-lifestyle-hybrid-content-2",
                role: "content",
                layout: "image-right",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Maintain rhythm across slides",
                    body: "Consistent placement helps energetic content still feel polished and readable.",
                    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800",
                },
                placeholders: {
                    title: "Add point title",
                    body: "Add point description",
                },
            },
            {
                id: "active-lifestyle-hybrid-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Keep Moving Forward",
                    buttonText: "Follow More",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "retro-theme-story",
        name: "Retro Theme Story",
        description: "Playful nostalgia-driven theme carousel with strong decorative style.",
        styles: {
            colors: {
                background: "#FFD166",
                text: "#2F1B14",
                primary: "#EF476F",
                accent: "#118AB2",
            },
            typography: {
                fontTitle: "Bebas Neue",
                fontBody: "Inter",
                titleSize: 48,
                bodySize: 17,
                lineHeight: 1.4,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 16,
            },
            decorations: {
                shapes: true,
                pattern: "retro-geometry",
            },
        },
        background: {
            presetId: "grid",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "retro-theme-story-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "A Theme Worth Revisiting",
                    body: "Use this preset when the mood and personality of the topic matter as much as the information.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro note",
                },
            },
            {
                id: "retro-theme-story-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Highlight one memorable element",
                    body: "Narrative theme slides work well when each slide explores one aspect of the broader idea.",
                },
                placeholders: {
                    title: "Add point title",
                    body: "Add point description",
                },
            },
            {
                id: "retro-theme-story-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Let the visuals carry emotion",
                    body: "Decorative shapes can create energy without needing a complex layout system.",
                },
                placeholders: {
                    title: "Add point title",
                    body: "Add point description",
                },
            },
            {
                id: "retro-theme-story-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "What Would You Add?",
                    buttonText: "Join In",
                },
                placeholders: {
                    title: "Add closing prompt",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "bold-proof-punch",
        name: "Bold Proof Punch",
        description: "Punchy fact-driven template with bold claims and corrections.",
        styles: {
            colors: {
                background: "#101010",
                text: "#FFFFFF",
                primary: "#F4D35E",
                accent: "#EE964B",
            },
            typography: {
                fontTitle: "Anton",
                fontBody: "Inter",
                titleSize: 46,
                bodySize: 17,
                lineHeight: 1.4,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 16,
            },
            decorations: {
                shapes: true,
                pattern: "hard-lines",
            },
        },
        background: {
            presetId: "chevron",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "bold-proof-punch-intro",
                role: "intro",
                layout: "split-left",
                imageBehavior: "hero-right",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Facts That Challenge Assumptions",
                    body: "This template is built for bold, high-contrast statements that stop scrolling.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add bold intro title",
                    body: "Add strong opener",
                },
            },
            {
                id: "bold-proof-punch-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "A common belief is not always true",
                    body: "Use each content slide to overturn one assumption with a sharper, cleaner idea.",
                },
                placeholders: {
                    title: "Add fact title",
                    body: "Add explanation",
                },
            },
            {
                id: "bold-proof-punch-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Short copy hits harder here",
                    body: "Strong templates like this perform best when text stays compact and direct.",
                },
                placeholders: {
                    title: "Add fact title",
                    body: "Add explanation",
                },
            },
            {
                id: "bold-proof-punch-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Save These Truths",
                    buttonText: "Save Now",
                },
                placeholders: {
                    title: "Add final takeaway",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "dark-authority-gold",
        name: "Dark Authority Gold",
        description: "Premium authority carousel with dark background and elegant accents.",
        styles: {
            colors: {
                background: "#111111",
                text: "#F5F1E8",
                primary: "#C8A96A",
                accent: "#8C6A3B",
            },
            typography: {
                fontTitle: "Cormorant Garamond",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 38,
                gap: 16,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "premium-lines",
            },
        },
        background: {
            presetId: "topographic",
            opacity: 0.06,
            scale: 1,
        },
        starterSlides: [
            {
                id: "dark-authority-gold-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Why Thoughtful Design Matters",
                    body: "Use this for premium educational or professional content with a confident tone.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro statement",
                },
            },
            {
                id: "dark-authority-gold-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Clarity builds trust",
                    body: "Authority templates work best when each point is precise, structured, and deliberate.",
                },
                placeholders: {
                    title: "Add authority point",
                    body: "Add supporting explanation",
                },
            },
            {
                id: "dark-authority-gold-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Consistency signals expertise",
                    body: "Elegant repetition across slides gives the carousel a premium, editorial feel.",
                },
                placeholders: {
                    title: "Add authority point",
                    body: "Add supporting explanation",
                },
            },
            {
                id: "dark-authority-gold-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Lead With Clarity",
                    buttonText: "Follow More",
                },
                placeholders: {
                    title: "Add final statement",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "cosmic-immersive",
        name: "Cosmic Immersive",
        description: "Atmospheric, cinematic template driven by mood and visual depth.",
        styles: {
            colors: {
                background: "#0D1B2A",
                text: "#F8FAFC",
                primary: "#A78BFA",
                accent: "#38BDF8",
            },
            typography: {
                fontTitle: "Cinzel",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 36,
                gap: 14,
                radius: 20,
            },
            decorations: {
                shapes: true,
                pattern: "cosmic-glow",
            },
        },
        background: {
            presetId: "glow",
            opacity: 0.16,
            scale: 1.2,
        },
        starterSlides: [
            {
                id: "cosmic-immersive-intro",
                role: "intro",
                layout: "full-image",
                imageBehavior: "background-faded",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Step Into a Bigger Story",
                    body: "This preset favors atmosphere, spacious pacing, and emotionally charged presentation.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add cinematic title",
                    body: "Add immersive opening",
                },
            },
            {
                id: "cosmic-immersive-content-1",
                role: "content",
                layout: "minimal-center",
                imageBehavior: "background-faded",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Use less text, more feeling",
                    body: "Mood-first carousels are strongest when each slide leaves space for the visual world to breathe.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add content title",
                    body: "Add supporting text",
                },
            },
            {
                id: "cosmic-immersive-content-2",
                role: "content",
                layout: "minimal-center",
                imageBehavior: "background-faded",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Let the sequence feel cinematic",
                    body: "Subtle visual continuity makes this kind of carousel feel more immersive and intentional.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add content title",
                    body: "Add supporting text",
                },
            },
            {
                id: "cosmic-immersive-outro",
                role: "outro",
                layout: "minimal-center",
                imageBehavior: "background-faded",
                fields: { title: true, buttonText: true, image: true },
                dummy: {
                    title: "Stay In Orbit",
                    buttonText: "Explore More",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "future-signal",
        name: "Future Signal",
        description: "Forward-looking concept template with glowing futuristic accents.",
        styles: {
            colors: {
                background: "#101828",
                text: "#F8FAFC",
                primary: "#60A5FA",
                accent: "#A855F7",
            },
            typography: {
                fontTitle: "Space Grotesk",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 36,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "signal-rings",
            },
        },
        background: {
            presetId: "glow",
            opacity: 0.14,
            scale: 1.15,
        },
        starterSlides: [
            {
                id: "future-signal-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "The Next Shift Is Already Here",
                    body: "This preset works for future-facing ideas, trends, and concept-led narratives.",
                },
                placeholders: {
                    title: "Add concept title",
                    body: "Add opening idea",
                },
            },
            {
                id: "future-signal-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Introduce the shift",
                    body: "Use one slide to define the core concept before moving into implications or predictions.",
                },
                placeholders: {
                    title: "Add trend point",
                    body: "Add explanation",
                },
            },
            {
                id: "future-signal-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Show what changes next",
                    body: "This type of carousel feels strongest when the narrative moves from idea to consequence.",
                },
                placeholders: {
                    title: "Add trend point",
                    body: "Add explanation",
                },
            },
            {
                id: "future-signal-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Prepare Early",
                    buttonText: "Follow Trend",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "creator-profile-grid",
        name: "Creator Profile Grid",
        description: "Clean creator-oriented preset for profile and personal improvement content.",
        styles: {
            colors: {
                background: "#F1F5F9",
                text: "#0F172A",
                primary: "#2563EB",
                accent: "#7C3AED",
            },
            typography: {
                fontTitle: "Poppins",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "creator-grid",
            },
        },
        background: {
            presetId: "grid",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "creator-profile-grid-intro",
                role: "intro",
                layout: "split-left",
                imageBehavior: "hero-right",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Make Your Profile Clearer",
                    body: "Use this for personal brand, creator, or profile improvement carousels.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro text",
                },
            },
            {
                id: "creator-profile-grid-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "01",
                    title: "Clarify what you do",
                    body: "Creator templates benefit from direct tips with short explanations and visible structure.",
                },
                placeholders: {
                    badge: "01",
                    title: "Add tip title",
                    body: "Add tip description",
                },
            },
            {
                id: "creator-profile-grid-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "02",
                    title: "Keep the message focused",
                    body: "Avoid overcrowding by letting each slide solve one small problem at a time.",
                },
                placeholders: {
                    badge: "02",
                    title: "Add tip title",
                    body: "Add tip description",
                },
            },
            {
                id: "creator-profile-grid-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Refresh Your Presence",
                    buttonText: "Save Tips",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "opportunity-list-gold",
        name: "Opportunity List Gold",
        description: "Aspirational list-based template for ideas, opportunities, and options.",
        styles: {
            colors: {
                background: "#111827",
                text: "#F9FAFB",
                primary: "#FBBF24",
                accent: "#D97706",
            },
            typography: {
                fontTitle: "Montserrat",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 36,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "opportunity-stars",
            },
        },
        background: {
            presetId: "dots",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "opportunity-list-gold-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Ideas Worth Exploring",
                    body: "Perfect for opportunity, income, options, and list-based aspirational content.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro line",
                },
            },
            {
                id: "opportunity-list-gold-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "01",
                    title: "Start with the simplest option",
                    body: "List templates should make each item feel independent, useful, and easy to save.",
                },
                placeholders: {
                    badge: "01",
                    title: "Add idea title",
                    body: "Add idea explanation",
                },
            },
            {
                id: "opportunity-list-gold-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "02",
                    title: "Choose ideas with clear upside",
                    body: "A strong opportunity carousel stays concise and maintains a sense of momentum.",
                },
                placeholders: {
                    badge: "02",
                    title: "Add idea title",
                    body: "Add idea explanation",
                },
            },
            {
                id: "opportunity-list-gold-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Pick One And Begin",
                    buttonText: "Start Here",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "tool-showcase-ui",
        name: "Tool Showcase UI",
        description: "Product and tool demo style preset with UI-like content framing.",
        styles: {
            colors: {
                background: "#EEF2FF",
                text: "#111827",
                primary: "#4F46E5",
                accent: "#312E81",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 30,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "ui-panels",
            },
        },
        background: {
            presetId: "grid",
            opacity: 0.06,
            scale: 1,
        },
        starterSlides: [
            {
                id: "tool-showcase-ui-intro",
                role: "intro",
                layout: "split-right",
                imageBehavior: "hero-left",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Show The Tool Clearly",
                    body: "This preset works for apps, tools, interfaces, and feature breakdowns.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro explanation",
                },
            },
            {
                id: "tool-showcase-ui-content-1",
                role: "content",
                layout: "image-top",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Highlight one feature at a time",
                    body: "Let the screenshot or UI preview do part of the communication for you.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add feature title",
                    body: "Add feature description",
                },
            },
            {
                id: "tool-showcase-ui-content-2",
                role: "content",
                layout: "image-top",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Keep supporting copy short",
                    body: "Product-style templates feel strongest when every slide stays focused and visual.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add feature title",
                    body: "Add feature description",
                },
            },
            {
                id: "tool-showcase-ui-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Try It Yourself",
                    buttonText: "Explore Tool",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "soft-reflection-journal",
        name: "Soft Reflection Journal",
        description: "Low-pressure reflective preset with quiet emotional pacing.",
        styles: {
            colors: {
                background: "#F6F1EB",
                text: "#3F3A36",
                primary: "#B08968",
                accent: "#7F5539",
            },
            typography: {
                fontTitle: "Libre Baskerville",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.55,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 40,
                gap: 16,
                radius: 20,
            },
            decorations: {
                shapes: false,
                pattern: "paper-soft",
            },
        },
        background: {
            presetId: "paper",
            opacity: 0.12,
            scale: 1,
        },
        starterSlides: [
            {
                id: "soft-reflection-journal-intro",
                role: "intro",
                layout: "minimal-center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Leave Room To Breathe",
                    body: "Use this preset for personal reflection, emotional honesty, and slower storytelling.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro reflection",
                },
            },
            {
                id: "soft-reflection-journal-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Not every message needs urgency",
                    body: "Some carousels work best when the tone is gentle, spacious, and intentionally understated.",
                },
                placeholders: {
                    title: "Add reflection title",
                    body: "Add reflection text",
                },
            },
            {
                id: "soft-reflection-journal-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Softness can still be strong",
                    body: "A quieter layout can help thoughtful messages land with more sincerity.",
                },
                placeholders: {
                    title: "Add reflection title",
                    body: "Add reflection text",
                },
            },
            {
                id: "soft-reflection-journal-outro",
                role: "outro",
                layout: "minimal-center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Keep This With You",
                    buttonText: "Save Thought",
                },
                placeholders: {
                    title: "Add closing reflection",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "light-productivity-notes",
        name: "Light Productivity Notes",
        description: "Friendly, low-pressure productivity preset with approachable structure.",
        styles: {
            colors: {
                background: "#FFF7ED",
                text: "#3B2F2F",
                primary: "#F97316",
                accent: "#EA580C",
            },
            typography: {
                fontTitle: "Poppins",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "friendly-doodles",
            },
        },
        background: {
            presetId: "waves",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "light-productivity-notes-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Work With Less Friction",
                    body: "A light productivity preset should feel useful, calm, and easy to act on.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro line",
                },
            },
            {
                id: "light-productivity-notes-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Reduce what drains attention",
                    body: "Simple changes often create the biggest improvements when presented clearly and casually.",
                },
                placeholders: {
                    title: "Add tip title",
                    body: "Add tip description",
                },
            },
            {
                id: "light-productivity-notes-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Protect your working energy",
                    body: "This style is best for practical tips that do not need a heavy or corporate tone.",
                },
                placeholders: {
                    title: "Add tip title",
                    body: "Add tip description",
                },
            },
            {
                id: "light-productivity-notes-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Try One Change Today",
                    buttonText: "Save Tips",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "creative-playbook",
        name: "Creative Playbook",
        description: "Inspirational narrative template with playful conceptual energy.",
        styles: {
            colors: {
                background: "#FCE7F3",
                text: "#4A044E",
                primary: "#DB2777",
                accent: "#7E22CE",
            },
            typography: {
                fontTitle: "DM Serif Display",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 36,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "playful-brush",
            },
        },
        background: {
            presetId: "round-arrows",
            opacity: 0.08,
            scale: 1,
        },
        starterSlides: [
            {
                id: "creative-playbook-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Make Space For New Ideas",
                    body: "This preset suits creative reflections, inspiration, and idea-first storytelling.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro note",
                },
            },
            {
                id: "creative-playbook-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Follow one thought at a time",
                    body: "Creative content becomes clearer when each slide isolates one useful or inspiring direction.",
                },
                placeholders: {
                    title: "Add idea title",
                    body: "Add idea description",
                },
            },
            {
                id: "creative-playbook-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Let imagination stay visible",
                    body: "A little visual play can make conceptual content feel more alive and memorable.",
                },
                placeholders: {
                    title: "Add idea title",
                    body: "Add idea description",
                },
            },
            {
                id: "creative-playbook-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Keep Creating",
                    buttonText: "Save Idea",
                },
                placeholders: {
                    title: "Add final line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "corporate-clarity",
        name: "Corporate Clarity",
        description: "Structured corporate preset for professional communication and trust-building.",
        styles: {
            colors: {
                background: "#F8FAFC",
                text: "#0F172A",
                primary: "#0EA5E9",
                accent: "#1E3A8A",
            },
            typography: {
                fontTitle: "Manrope",
                fontBody: "Inter",
                titleSize: 38,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 16,
            },
            decorations: {
                shapes: true,
                pattern: "corporate-lines",
            },
        },
        background: {
            presetId: "grid",
            opacity: 0.05,
            scale: 1,
        },
        starterSlides: [
            {
                id: "corporate-clarity-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Build Trust Through Clear Communication",
                    body: "This preset is designed for professional, direct, and highly readable corporate messaging.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro statement",
                },
            },
            {
                id: "corporate-clarity-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "01",
                    title: "State the principle simply",
                    body: "Corporate slides should feel direct, structured, and easy to trust at a glance.",
                },
                placeholders: {
                    badge: "01",
                    title: "Add point title",
                    body: "Add explanation",
                },
            },
            {
                id: "corporate-clarity-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "02",
                    title: "Use repetition to reinforce confidence",
                    body: "The more stable the structure feels, the more professional the carousel appears.",
                },
                placeholders: {
                    badge: "02",
                    title: "Add point title",
                    body: "Add explanation",
                },
            },
            {
                id: "corporate-clarity-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Lead With Confidence",
                    buttonText: "Read More",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "solo-builder-guide",
        name: "Solo Builder Guide",
        description: "Practical startup-style guide template with simple, motivating structure.",
        styles: {
            colors: {
                background: "#F9FAFB",
                text: "#111827",
                primary: "#10B981",
                accent: "#065F46",
            },
            typography: {
                fontTitle: "Space Grotesk",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "builder-grid",
            },
        },
        background: {
            presetId: "grid",
            opacity: 0.05,
            scale: 1,
        },
        starterSlides: [
            {
                id: "solo-builder-guide-intro",
                role: "intro",
                layout: "split-left",
                imageBehavior: "hero-right",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Build Faster With Less Complexity",
                    body: "This preset suits founder, startup, indie, and builder-focused content.",
                    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro text",
                },
            },
            {
                id: "solo-builder-guide-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "01",
                    title: "Start with the smallest workable step",
                    body: "Builder-oriented content performs well when it stays practical and immediately useful.",
                },
                placeholders: {
                    badge: "01",
                    title: "Add step title",
                    body: "Add step description",
                },
            },
            {
                id: "solo-builder-guide-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "02",
                    title: "Keep systems simple early",
                    body: "A clean guide template helps technical and startup content feel more approachable.",
                },
                placeholders: {
                    badge: "02",
                    title: "Add step title",
                    body: "Add step description",
                },
            },
            {
                id: "solo-builder-guide-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Keep Building",
                    buttonText: "Save Guide",
                },
                placeholders: {
                    title: "Add final encouragement",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "viral-fact-burst",
        name: "Viral Fact Burst",
        description: "Fast, surprising, high-impact fact template for short punchy content.",
        styles: {
            colors: {
                background: "#0F172A",
                text: "#F8FAFC",
                primary: "#22D3EE",
                accent: "#F97316",
            },
            typography: {
                fontTitle: "Bricolage Grotesque",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.4,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 32,
                gap: 12,
                radius: 16,
            },
            decorations: {
                shapes: true,
                pattern: "burst-lines",
            },
        },
        background: {
            presetId: "waves",
            opacity: 0.06,
            scale: 1,
        },
        starterSlides: [
            {
                id: "viral-fact-burst-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Facts Most People Miss",
                    body: "Use this for short, surprising, curiosity-led carousels built to grab attention quickly.",
                },
                placeholders: {
                    title: "Add bold hook",
                    body: "Add short intro",
                },
            },
            {
                id: "viral-fact-burst-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Shorter is stronger here",
                    body: "Keep each slide compact so the pace stays quick and the surprise lands harder.",
                },
                placeholders: {
                    title: "Add fact title",
                    body: "Add fact note",
                },
            },
            {
                id: "viral-fact-burst-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "One sharp point beats three weak ones",
                    body: "Fast formats need strong hierarchy and minimal friction to read.",
                },
                placeholders: {
                    title: "Add fact title",
                    body: "Add fact note",
                },
            },
            {
                id: "viral-fact-burst-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Save This One",
                    buttonText: "Share Post",
                },
                placeholders: {
                    title: "Add final line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "myth-contrast",
        name: "Myth Contrast",
        description: "Contrast-led template built for myths, corrections, and clarifications.",
        styles: {
            colors: {
                background: "#FFF7ED",
                text: "#431407",
                primary: "#F97316",
                accent: "#7C2D12",
            },
            typography: {
                fontTitle: "Sora",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "contrast-cards",
            },
        },
        background: {
            presetId: "chevron",
            opacity: 0.05,
            scale: 1,
        },
        starterSlides: [
            {
                id: "myth-contrast-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Common Myths, Better Truths",
                    body: "This preset is designed for contrast-based storytelling where each slide clarifies or corrects.",
                },
                placeholders: {
                    title: "Add myth hook",
                    body: "Add short opener",
                },
            },
            {
                id: "myth-contrast-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "MYTH",
                    title: "More noise means more impact",
                    body: "Use the body area to correct the misconception with a calmer, clearer explanation.",
                },
                placeholders: {
                    badge: "MYTH",
                    title: "Add myth title",
                    body: "Add correction",
                },
            },
            {
                id: "myth-contrast-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "TRUTH",
                    title: "Clear communication usually wins",
                    body: "The more obvious the contrast, the easier it is for the audience to remember.",
                },
                placeholders: {
                    badge: "TRUTH",
                    title: "Add truth title",
                    body: "Add explanation",
                },
            },
            {
                id: "myth-contrast-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Challenge The Default",
                    buttonText: "Save Truth",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },

    {
        id: "starter-growth-guide",
        name: "Starter Growth Guide",
        description: "Friendly tactical template for practical growth and creator tips.",
        styles: {
            colors: {
                background: "#ECFDF5",
                text: "#064E3B",
                primary: "#10B981",
                accent: "#047857",
            },
            typography: {
                fontTitle: "Poppins",
                fontBody: "Inter",
                titleSize: 40,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: {
                padding: 34,
                gap: 14,
                radius: 18,
            },
            decorations: {
                shapes: true,
                pattern: "growth-steps",
            },
        },
        background: {
            presetId: "arrows",
            opacity: 0.07,
            scale: 1,
        },
        starterSlides: [
            {
                id: "starter-growth-guide-intro",
                role: "intro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "Grow With Better Moves",
                    body: "Use this preset for tactical creator, growth, audience, or improvement content.",
                },
                placeholders: {
                    title: "Add intro title",
                    body: "Add intro line",
                },
            },
            {
                id: "starter-growth-guide-content-1",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "01",
                    title: "Focus on one useful action",
                    body: "Growth content works best when each slide gives the audience something concrete to apply.",
                },
                placeholders: {
                    badge: "01",
                    title: "Add tip title",
                    body: "Add tip description",
                },
            },
            {
                id: "starter-growth-guide-content-2",
                role: "content",
                layout: "top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "02",
                    title: "Keep the steps realistic",
                    body: "Practical tips feel stronger when they are short, specific, and easy to remember.",
                },
                placeholders: {
                    badge: "02",
                    title: "Add tip title",
                    body: "Add tip description",
                },
            },
            {
                id: "starter-growth-guide-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: {
                    title: "Use One Tip Today",
                    buttonText: "Save Guide",
                },
                placeholders: {
                    title: "Add closing line",
                    buttonText: "Add CTA",
                },
            },
        ],
    },
];

export const getCarouselTemplateById = (id: string) =>
    carouselTemplates.find((template) => template.id === id);
