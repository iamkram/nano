import { Megaphone, BarChart3, FileText, Home, Camera, type LucideIcon } from 'lucide-react';

export interface QuickPrompt {
    icon: LucideIcon;
    label: string;
    prompt: string;
    template?: string;
    stylePresetId?: string;
}

export const quickPrompts: QuickPrompt[] = [
    {
        icon: BarChart3,
        label: "Infographic (Corporate)",
        prompt: "A professional, data-driven infographic explaining 'Digital Transformation'. Layout: Clean, grid-based structure with distinct sections. Visuals: Minimalist flat icons, sleek bar charts for revenue growth, and a process flow diagram. Color Palette: Corporate cool tones (Navy Blue, Slate Grey, White) with an Emerald Green accent. Style: Modern, vector art, high legibility, suitable for an executive presentation.",
        template: "A professional, data-driven infographic explaining '{{Topic}}'. Layout: Clean, grid-based structure with distinct sections. Visuals: {{Visuals}}. Color Palette: {{Color Palette}}. Style: Modern, vector art, high legibility, suitable for an executive presentation.",
        stylePresetId: "infographic"
    },
    {
        icon: FileText,
        label: "Infographic (Hand Drawn)",
        prompt: "A charming, hand-drawn style infographic about 'Sustainable Living'. Aesthetic: Organic, sketchy lines with watercolor textures on a paper background. Visuals: Doodle-style illustrations of plants, recycling bins, and bicycles. Typography: Friendly, handwritten font. Color Palette: Earthy tones (Sage Green, Terracotta, Cream). Layout: Playful and flowing, guiding the eye naturally like a story.",
        template: "A charming, hand-drawn style infographic about '{{Topic}}'. Aesthetic: Organic, sketchy lines with watercolor textures on a paper background. Visuals: {{Visuals}}. Typography: Friendly, handwritten font. Color Palette: {{Color Palette}}. Layout: Playful and flowing, guiding the eye naturally like a story.",
        stylePresetId: "infographic"
    },
    {
        icon: Megaphone,
        label: "Campaign Launch",
        prompt: "A photorealistic wide shot of a futuristic electric vehicle speeding through a rainy Tokyo street at night. Neon signs reflect on the wet asphalt. Cinematic lighting, motion blur on the background, sharp focus on the car. 8k resolution, commercial car photography style.",
        template: "A photorealistic wide shot of {{Product}} speeding through {{Setting}} at {{Time of Day}}. {{Lighting}} lighting, motion blur on the background, sharp focus on the subject. 8k resolution, commercial photography style.",
        stylePresetId: "advertisement"
    },
    {
        icon: FileText,
        label: "Product Hero",
        prompt: "A professional product shot of a luxury perfume bottle on a marble podium. Lighting: Soft studio lighting with a rim light to accentuate the glass curves. Background: minimal pastel pink. Water droplets on the bottle for freshness. 8k resolution, macro photography, sharp details, commercial advertisement standard.",
        template: "A professional product shot of {{Product}} on a {{Surface}}. Lighting: {{Lighting}} to accentuate the details. Background: {{Background}}. {{Details}}. 8k resolution, macro photography, sharp details, commercial advertisement standard.",
        stylePresetId: "product-shot"
    },
    {
        icon: Home,
        label: "Real Estate Showcase",
        prompt: "A stunning contemporary architectural masterpiece, clean lines, floor-to-ceiling glass, nestled in a pristine natural landscape at twilight. Infinity pool reflecting a vibrant sunset. Interior visible through glass showing a spacious luxury living room with designer furniture. 8k resolution, photorealistic, architectural digest style, dramatic lighting.",
        template: "A stunning {{Architecture Style}} masterpiece, {{Architectural Details}}, nestled in {{Landscape}} at {{Time of Day}}. {{Features}}. Interior visible through glass showing {{Interior Details}}. 8k resolution, photorealistic, architectural digest style, dramatic lighting.",
        stylePresetId: "photographic"
    },
    {
        icon: Camera,
        label: "Lifestyle Campaign",
        prompt: "A cohesive set of lifestyle images for a premium activewear brand. Subject: A diverse group of friends hiking on a scenic mountain trail during golden hour. Lighting: Warm, natural backlighting with lens flare. Style: Authentic, candid, high energy, cinematic color grading. Shot on 35mm lens, f/1.4. High-resolution, commercial advertising aesthetic.",
        template: "A cohesive set of lifestyle images for {{Brand/Product}}. Subject: {{Subject}} doing {{Activity}} in {{Setting}} during {{Time of Day}}. Lighting: {{Lighting}}. Style: Authentic, candid, high energy, cinematic color grading. Shot on 35mm lens, f/1.4. High-resolution, commercial advertising aesthetic.",
        stylePresetId: "social-media"
    }
];
