import { CarouselTemplate } from "./types";

export const carouselTemplates: CarouselTemplate[] = [

    // ================================================================
    // GROUP 1: intro-standard (3 templates)
    // ================================================================
    {
        id: "bold-rocket",
        name: "Bold Rocket",
        description: "High-energy numbered steps with vivid orange background.",
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
            spacing: { padding: 40, gap: 18, radius: 16 },
        },
        background: { presetId: "round-arrows", opacity: 0.14, scale: 1 },
        starterSlides: [
            {
                id: "bold-rocket-intro",
                role: "intro",
                layout: "intro-standard",
                imageBehavior: "none",
                fields: { title: true, body: true, badge: true },
                dummy: {
                    badge: "Thread",
                    title: "Unlock Your Potential",
                    body: "A bold opening with strong hierarchy and a clear visual anchor.",
                },
                placeholders: { title: "Your main headline", body: "Short supporting intro" },
            },
            {
                id: "bold-rocket-content-1",
                role: "content",
                layout: "dual-column",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, title2: true, body2: true },
                dummy: {
                    badge: "01",
                    title: "The Vision",
                    body: "What they teach you in textbooks about the grand plan.",
                    title2: "The Reality",
                    body2: "The messy truth of executing that vision daily.",
                },
                placeholders: { badge: "01", title: "Left title", body: "Description", title2: "Right title", body2: "Description" },
            },
            {
                id: "bold-rocket-content-2",
                role: "content",
                layout: "dual-column",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, title2: true, body2: true },
                dummy: {
                    badge: "02",
                    title: "Strategy",
                    body: "Designing the high-level roadmap for success.",
                    title2: "Execution",
                    body2: "Grinding out the work to make the roadmap real.",
                },
                placeholders: { badge: "02", title: "Left title", body: "Description", title2: "Right title", body2: "Description" },
            },
            {
                id: "bold-rocket-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Launch Your Next Carousel", buttonText: "Get Started →" },
                placeholders: { title: "Closing message", buttonText: "CTA text" },
            },
        ],
    },

    {
        id: "dark-authority",
        name: "Dark Authority",
        description: "Premium dark background with warm gold accents.",
        styles: {
            colors: {
                background: "#0A0A0F",
                text: "#F5F0E8",
                primary: "#C8A96E",
                accent: "#8A6B35",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 46,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 20, radius: 12 },
        },
        background: { presetId: "glow", opacity: 0.18, scale: 1.2 },
        starterSlides: [
            {
                id: "dark-authority-intro",
                role: "intro",
                layout: "intro-standard",
                imageBehavior: "none",
                fields: { title: true, body: true, badge: true },
                dummy: {
                    badge: "Authority",
                    title: "The Rules Have Changed",
                    body: "Here is what most people still don't know in 2024.",
                },
                placeholders: { title: "Bold opening statement", body: "Set context here" },
            },
            {
                id: "dark-authority-content-1",
                role: "content",
                layout: "image-top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "01",
                    title: "Most people ignore this map",
                    body: "The majority never question the default path. That is their first mistake.",
                    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800"
                },
                placeholders: { badge: "01", title: "Point title", body: "Explanation" },
            },
            {
                id: "dark-authority-content-2",
                role: "content",
                layout: "image-top",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "02",
                    title: "The ones who win use this",
                    body: "They ask better questions, move faster, and build systems that compound.",
                    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800"
                },
                placeholders: { badge: "02", title: "Point title", body: "Explanation" },
            },
            {
                id: "dark-authority-outro",
                role: "outro",
                layout: "intro-standard",
                imageBehavior: "none",
                fields: { title: true, body: true, buttonText: true },
                dummy: { 
                    title: "Ready to take control?", 
                    body: "Join 50,000+ founders receiving weekly insights.",
                    buttonText: "Join the newsletter →" 
                },
                placeholders: { title: "Closing hook", body: "Short description", buttonText: "CTA" },
            },
        ],
    },

    {
        id: "clean-growth",
        name: "Clean Growth",
        description: "Minimal green palette for productivity and growth content.",
        styles: {
            colors: {
                background: "#ECFDF5",
                text: "#064E3B",
                primary: "#10B981",
                accent: "#065F46",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 44,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 14 },
        },
        background: { presetId: "arrows", opacity: 0.1, scale: 1 },
        starterSlides: [
            {
                id: "clean-growth-intro",
                role: "intro",
                layout: "intro-standard",
                imageBehavior: "none",
                fields: { title: true, body: true },
                dummy: {
                    title: "5 Habits That Changed Everything",
                    body: "Small daily actions that compound into massive results over time.",
                },
                placeholders: { title: "Hook headline", body: "Supporting intro line" },
            },
            {
                id: "clean-growth-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "Habit 1",
                    title: "Write every morning",
                    body: "10 minutes of journaling clears mental noise and sharpens your thinking.",
                },
                placeholders: { badge: "Habit 1", title: "Habit name", body: "Why it works" },
            },
            {
                id: "clean-growth-content-2",
                role: "content",
                layout: "split-left",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Habit 2",
                    title: "Review your week",
                    body: "A 15-minute weekly review keeps you moving in the right direction.",
                    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800"
                },
                placeholders: { badge: "Habit 2", title: "Habit name", body: "Why it works" },
            },
            {
                id: "clean-growth-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Save this for your next reset day.", buttonText: "Follow for more →" },
                placeholders: { title: "Closing message", buttonText: "CTA" },
            },
        ],
    },

    // ================================================================
    // GROUP 2: intro-emoji (3 templates)
    // ================================================================
    {
        id: "warm-guide",
        name: "Warm Guide",
        description: "Friendly warm palette with emoji-led hooks.",
        styles: {
            colors: {
                background: "#FFF8F1",
                text: "#3B2621",
                primary: "#E07B39",
                accent: "#7C2D12",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 44,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 16 },
        },
        background: { presetId: "waves", opacity: 0.1, scale: 1 },
        starterSlides: [
            {
                id: "warm-guide-intro",
                role: "intro",
                layout: "intro-emoji",
                imageBehavior: "none",
                fields: { emoji: true, title: true, body: true },
                dummy: {
                    emoji: "🔥",
                    title: "This changed how I work",
                    body: "A simple framework most people overlook — until it's too late.",
                },
                placeholders: { title: "Hook headline", body: "Supporting sentence" },
            },
            {
                id: "warm-guide-content-1",
                role: "content",
                layout: "image-left",
                imageBehavior: "framed",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Step 1",
                    title: "Stop multitasking",
                    body: "One task at a time produces better results and less mental fatigue.",
                    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=800"
                },
                placeholders: { badge: "Step 1", title: "Point title", body: "Explanation" },
            },
            {
                id: "warm-guide-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "Step 2",
                    title: "Schedule deep work",
                    body: "Block 90-minute sessions with no notifications, no meetings, no switching.",
                },
                placeholders: { badge: "Step 2", title: "Point title", body: "Explanation" },
            },
            {
                id: "warm-guide-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Try this for 7 days and see what happens.", buttonText: "Save this post →" },
                placeholders: { title: "Closing CTA", buttonText: "Button text" },
            },
        ],
    },

    {
        id: "creative-playbook",
        name: "Creative Playbook",
        description: "Playful pink palette for creative and lifestyle content.",
        styles: {
            colors: {
                background: "#FCE7F3",
                text: "#4A044E",
                primary: "#DB2777",
                accent: "#9D174D",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 44,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 20 },
        },
        background: { presetId: "round-arrows", opacity: 0.1, scale: 1 },
        starterSlides: [
            {
                id: "creative-playbook-intro",
                role: "intro",
                layout: "intro-emoji",
                imageBehavior: "none",
                fields: { emoji: true, title: true, body: true },
                dummy: {
                    emoji: "✨",
                    title: "The creative process no one shows you",
                    body: "From blank page to finished piece — here is the real workflow.",
                },
                placeholders: { title: "Hook headline", body: "Supporting sentence" },
            },
            {
                id: "creative-playbook-content-1",
                role: "content",
                layout: "full-image",
                imageBehavior: "background-faded",
                fields: { image: true, title: true },
                dummy: {
                    title: "Phase 1: Collect, don't decide",
                    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800",
                },
                placeholders: { title: "Visual statement" },
            },
            {
                id: "creative-playbook-content-2",
                role: "content",
                layout: "split-right",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Phase 2",
                    title: "Make the ugly draft",
                    body: "Get it out of your head fast. The polished version comes later.",
                    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800"
                },
                placeholders: { badge: "Phase 2", title: "Phase name", body: "Description" },
            },
            {
                id: "creative-playbook-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Which phase is hardest for you?", buttonText: "Comment below →" },
                placeholders: { title: "Engagement hook", buttonText: "CTA" },
            },
        ],
    },

    {
        id: "viral-facts",
        name: "Viral Facts",
        description: "Dark high-contrast design built for fact-based viral content.",
        styles: {
            colors: {
                background: "#0F172A",
                text: "#F8FAFC",
                primary: "#38BDF8",
                accent: "#0EA5E9",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 46,
                bodySize: 18,
                lineHeight: 1.4,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 18, radius: 12 },
        },
        background: { presetId: "waves", opacity: 0.08, scale: 1 },
        starterSlides: [
            {
                id: "viral-facts-intro",
                role: "intro",
                layout: "intro-emoji",
                imageBehavior: "none",
                fields: { emoji: true, title: true, body: true },
                dummy: {
                    emoji: "🤯",
                    title: "Facts that will change how you think",
                    body: "Data-backed insights most people have never seen.",
                },
                placeholders: { title: "Hook headline", body: "Teaser description" },
            },
            {
                id: "viral-facts-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "Fact #1",
                    title: "93% of communication is non-verbal",
                    body: "Your posture, tone, and eye contact say more than your words ever will.",
                },
                placeholders: { badge: "Fact #1", title: "The fact", body: "Why it matters" },
            },
            {
                id: "viral-facts-content-2",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "Fact #2",
                    title: "The brain processes visuals 60,000x faster",
                    body: "A single image communicates what paragraphs of text cannot.",
                },
                placeholders: { badge: "Fact #2", title: "The fact", body: "Why it matters" },
            },
            {
                id: "viral-facts-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Which fact surprised you most?", buttonText: "Share this →" },
                placeholders: { title: "Engagement question", buttonText: "CTA" },
            },
        ],
    },

    // ================================================================
    // GROUP 3: intro-headshot (3 templates)
    // ================================================================
    {
        id: "creator-profile",
        name: "Creator Profile",
        description: "Clean slate built for personal brand and creator intros.",
        styles: {
            colors: {
                background: "#F1F5F9",
                text: "#0F172A",
                primary: "#7C3AED",
                accent: "#5B21B6",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 44,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 16 },
        },
        background: { presetId: "grid", opacity: 0.07, scale: 1 },
        starterSlides: [
            {
                id: "creator-profile-intro",
                role: "intro",
                layout: "intro-headshot",
                imageBehavior: "none",
                fields: { image: true, title: true, body: true },
                dummy: {
                    title: "Hi, I'm Sarah — I help founders build in public.",
                    body: "3 years. 50k followers. Here's everything I learned.",
                    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
                },
                placeholders: { title: "Who you are + what you do", body: "Credibility hook" },
            },
            {
                id: "creator-profile-content-1",
                role: "content",
                layout: "split-left",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Lesson 1",
                    title: "Consistency beats perfection",
                    body: "Showing up every week earns more trust than one perfect post.",
                    image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?q=80&w=800"
                },
                placeholders: { badge: "Lesson 1", title: "Lesson title", body: "The insight" },
            },
            {
                id: "creator-profile-content-2",
                role: "content",
                layout: "split-right",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Lesson 2",
                    title: "Niche down to scale up",
                    body: "The more specific your topic, the faster your audience finds you.",
                    image: "https://images.unsplash.com/photo-1507925922837-326f12d9348d?q=80&w=800"
                },
                placeholders: { badge: "Lesson 2", title: "Lesson title", body: "The insight" },
            },
            {
                id: "creator-profile-outro",
                role: "outro",
                layout: "intro-headshot",
                imageBehavior: "none",
                fields: { title: true, body: true, buttonText: true, image: true },
                dummy: { 
                    title: "Let's build something together.", 
                    body: "I share daily lessons on building in public. Follow along.",
                    buttonText: "Follow @sarah_builds →",
                    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400",
                },
                placeholders: { title: "Personal CTA", body: "Bio or invitation", buttonText: "Button" },
            },
        ],
    },

    {
        id: "solo-builder",
        name: "Solo Builder",
        description: "For solopreneurs sharing frameworks and hard-won lessons.",
        styles: {
            colors: {
                background: "#F9FAFB",
                text: "#111827",
                primary: "#4F46E5",
                accent: "#3730A3",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 44,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 12 },
        },
        background: { presetId: "dots", opacity: 0.07, scale: 1 },
        starterSlides: [
            {
                id: "solo-builder-intro",
                role: "intro",
                layout: "intro-headshot",
                imageBehavior: "none",
                fields: { image: true, title: true, body: true },
                dummy: {
                    title: "I left my job to build solo — here's the honest truth.",
                    body: "No investors. No team. $8k MRR in 14 months.",
                    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
                },
                placeholders: { title: "Your story hook", body: "Proof point" },
            },
            {
                id: "solo-builder-content-1",
                role: "content",
                layout: "center",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true },
                dummy: {
                    badge: "Month 1–3",
                    title: "Nothing worked",
                    body: "I shipped 3 products nobody wanted. Each failure sharpened my focus.",
                },
                placeholders: { badge: "Phase", title: "What happened", body: "What you learned" },
            },
            {
                id: "solo-builder-content-2",
                role: "content",
                layout: "image-top",
                imageBehavior: "hero-right",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Month 4–6",
                    title: "The pivot that changed everything",
                    body: "One DM from a stranger revealed the real problem I should be solving.",
                    image: "https://images.unsplash.com/photo-1512758684062-2f3ce63c1e2f?q=80&w=800"
                },
                placeholders: { badge: "Phase", title: "What happened", body: "What you learned" },
            },
            {
                id: "solo-builder-outro",
                role: "outro",
                layout: "intro-headshot",
                imageBehavior: "none",
                fields: { title: true, body: true, buttonText: true, image: true },
                dummy: { 
                    title: "Don't build in isolation.", 
                    body: "I'm sharing the full journey to $10k MRR. Want in?",
                    buttonText: "Join the community →",
                    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
                },
                placeholders: { title: "CTA to follow", body: "Invitation", buttonText: "Button" },
            },
        ],
    },

    {
        id: "corporate-clarity",
        name: "Corporate Clarity",
        description: "Professional white-and-navy for B2B and thought leadership.",
        styles: {
            colors: {
                background: "#F8FAFC",
                text: "#0F172A",
                primary: "#1D4ED8",
                accent: "#1E40AF",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.5,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 10 },
        },
        background: { presetId: "grid", opacity: 0.06, scale: 1 },
        starterSlides: [
            {
                id: "corporate-clarity-intro",
                role: "intro",
                layout: "intro-headshot",
                imageBehavior: "none",
                fields: { image: true, title: true, body: true },
                dummy: {
                    title: "Why most B2B content fails — and how to fix it.",
                    body: "10 years in marketing. Here are the patterns I keep seeing.",
                    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400",
                },
                placeholders: { title: "Your professional hook", body: "Credibility context" },
            },
            {
                id: "corporate-clarity-content-1",
                role: "content",
                layout: "dual-column",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, title2: true, body2: true },
                dummy: {
                    badge: "SYMPTOMS",
                    title: "The Symptoms",
                    body: "Low engagement, high churn, and slowing growth rates.",
                    title2: "The Root Cause",
                    body2: "Misaligned product-market fit and poor user onboarding.",
                },
                placeholders: { badge: "Label", title: "Left title", body: "Description", title2: "Right title", body2: "Description" },
            },
            {
                id: "corporate-clarity-content-2",
                role: "content",
                layout: "dual-column",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, title2: true, body2: true },
                dummy: {
                    badge: "STRATEGY",
                    title: "Old Approach",
                    body: "Casting a wide net and hoping for the best vibes.",
                    title2: "New Approach",
                    body2: "Data-driven targeting of high-intent users only.",
                },
                placeholders: { badge: "Label", title: "Left title", body: "Description", title2: "Right title", body2: "Description" },
            },
            {
                id: "corporate-clarity-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Want a free content audit? DM me 'AUDIT'.", buttonText: "DM me →" },
                placeholders: { title: "Lead magnet CTA", buttonText: "Button" },
            },
        ],
    },

    // ================================================================
    // GROUP 4: intro-image (3 templates)
    // ================================================================
    {
        id: "split-hero",
        name: "Split Hero",
        description: "Bold visual intro with image anchored to the corner.",
        styles: {
            colors: {
                background: "#1E3A5F",
                text: "#FFFFFF",
                primary: "#60A5FA",
                accent: "#2563EB",
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
            spacing: { padding: 40, gap: 18, radius: 16 },
        },
        background: { presetId: "diagonal-lines", opacity: 0.08, scale: 1 },
        starterSlides: [
            {
                id: "split-hero-intro",
                role: "intro",
                layout: "intro-image",
                imageBehavior: "none",
                fields: { image: true, title: true, body: true, badge: true },
                dummy: {
                    badge: "2024 Edition",
                    title: "The Framework That Scales",
                    body: "How top creators build systems that work without burning out.",
                    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800",
                },
                placeholders: { title: "Bold opener", body: "Supporting context" },
            },
            {
                id: "split-hero-content-1",
                role: "content",
                layout: "split-right",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "01",
                    title: "Build once, reuse forever",
                    body: "A documented system multiplies your output without adding your time.",
                    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800"
                },
                placeholders: { badge: "01", title: "Point title", body: "Explanation" },
            },
            {
                id: "split-hero-content-2",
                role: "content",
                layout: "split-left",
                imageBehavior: "none",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "02",
                    title: "Delegate the repeatable",
                    body: "Any task you do more than twice has a system. Write it down and delegate it.",
                    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800"
                },
                placeholders: { badge: "02", title: "Point title", body: "Explanation" },
            },
            {
                id: "split-hero-outro",
                role: "outro",
                layout: "center",
                imageBehavior: "none",
                fields: { title: true, buttonText: true },
                dummy: { title: "Ready to build your system?", buttonText: "Start here →" },
                placeholders: { title: "Closing message", buttonText: "CTA" },
            },
        ],
    },

    {
        id: "editorial-showcase",
        name: "Editorial Showcase",
        description: "Warm editorial aesthetic with image-forward storytelling.",
        styles: {
            colors: {
                background: "#F4EADB",
                text: "#1D1D1D",
                primary: "#E0865D",
                accent: "#3A2A22",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 42,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 700,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 16, radius: 18 },
        },
        background: { presetId: "arrows", opacity: 0.1, scale: 1 },
        starterSlides: [
            {
                id: "editorial-showcase-intro",
                role: "intro",
                layout: "intro-image",
                imageBehavior: "none",
                fields: { image: true, title: true, body: true },
                dummy: {
                    title: "Top Trends This Season",
                    body: "An editorial take on what's shaping culture right now.",
                    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800",
                },
                placeholders: { title: "Editorial headline", body: "Intro context" },
            },
            {
                id: "editorial-showcase-content-1",
                role: "content",
                layout: "image-left",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Minimal Statement Pieces",
                    body: "Use supporting visuals when the product itself carries the message.",
                    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800",
                },
                placeholders: { title: "Content title", body: "Supporting copy" },
            },
            {
                id: "editorial-showcase-content-2",
                role: "content",
                layout: "image-right",
                imageBehavior: "framed",
                fields: { title: true, body: true, image: true },
                dummy: {
                    title: "Refined Everyday Looks",
                    body: "Keep the same composition so the carousel feels consistent from slide to slide.",
                    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
                },
                placeholders: { title: "Content title", body: "Supporting copy" },
            },
            {
                id: "editorial-showcase-outro",
                role: "outro",
                layout: "intro-image",
                imageBehavior: "none",
                fields: { title: true, body: true, buttonText: true, image: true },
                dummy: { 
                    title: "Classic Style. Modern Voice.", 
                    body: "Subscribe to the quarterly lookbook.",
                    buttonText: "Subscribe →",
                    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
                },
                placeholders: { title: "Closing statement", body: "Description", buttonText: "CTA" },
            },
        ],
    },

    {
        id: "cosmic-depth",
        name: "Cosmic Depth",
        description: "Deep space aesthetic with high-impact visual intro.",
        styles: {
            colors: {
                background: "#0D0221",
                text: "#E0E7FF",
                primary: "#818CF8",
                accent: "#6366F1",
            },
            typography: {
                fontTitle: "Inter",
                fontBody: "Inter",
                titleSize: 46,
                bodySize: 17,
                lineHeight: 1.45,
                fontWeightTitle: 800,
                fontWeightBody: 400,
            },
            spacing: { padding: 40, gap: 18, radius: 14 },
        },
        background: { presetId: "glow", opacity: 0.2, scale: 1.3 },
        starterSlides: [
            {
                id: "cosmic-depth-intro",
                role: "intro",
                layout: "intro-image",
                imageBehavior: "none",
                fields: { image: true, title: true, body: true, badge: true },
                dummy: {
                    badge: "Deep Dive",
                    title: "What no one tells you about the future",
                    body: "The signals are already here. Most people just aren't paying attention.",
                    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800",
                },
                placeholders: { title: "Big claim opener", body: "Tease the content" },
            },
            {
                id: "cosmic-depth-content-1",
                role: "content",
                layout: "full-image",
                imageBehavior: "background-faded",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Signal 01",
                    title: "AI is eating the middle layer",
                    body: "The jobs at risk aren't the ones at the top or bottom — they're in the middle.",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800"
                },
                placeholders: { badge: "Signal 01", title: "Insight title", body: "Explanation" },
            },
            {
                id: "cosmic-depth-content-2",
                role: "content",
                layout: "full-image",
                imageBehavior: "background-faded",
                fields: { badge: true, title: true, body: true, image: true },
                dummy: {
                    badge: "Signal 02",
                    title: "Leverage beats effort",
                    body: "Tools, systems, and audiences multiply your output beyond individual effort.",
                    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=800"
                },
                placeholders: { badge: "Signal 02", title: "Insight title", body: "Explanation" },
            },
            {
                id: "cosmic-depth-outro",
                role: "outro",
                layout: "intro-image",
                imageBehavior: "none",
                fields: { title: true, body: true, buttonText: true, image: true },
                dummy: { 
                    title: "The future is closer than you think.", 
                    body: "Get the weekly forecast in your inbox.",
                    buttonText: "Subscribe to FutureSync →",
                    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
                },
                placeholders: { title: "Closing question", body: "Newsletter name", buttonText: "CTA" },
            },
        ],
    },
];

export const getCarouselTemplateById = (id: string) =>
    carouselTemplates.find((template) => template.id === id);
