export interface StylePreset {
    id: string;
    label: string;
    modifier: string;
}

export const stylePresets: StylePreset[] = [
    {
        id: 'infographic',
        label: 'Infographic',
        modifier: "clean vector graphics, flat design, data visualization style, professional layout, white background, high legibility, corporate aesthetic"
    },
    {
        id: 'photographic',
        label: 'Photographic',
        modifier: "photorealistic, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3"
    },
    {
        id: 'advertisement',
        label: 'Advertisement',
        modifier: "professional advertising, commercial photography, studio lighting, high contrast, persuasive visual, marketing campaign style, award-winning ad"
    },
    {
        id: 'social-media',
        label: 'Social Media',
        modifier: "trending on instagram, lifestyle photography, authentic feel, warm filter, engaging composition, viral aesthetic, high resolution"
    },
    {
        id: 'product-shot',
        label: 'Product Shot',
        modifier: "professional product photography, studio lighting, 4k, macro lens, sharp focus, commercial quality, clean background, luxury aesthetic"
    },
    {
        id: 'cinematic',
        label: 'Cinematic',
        modifier: "cinematic lighting, movie still, color graded, anamorphic lens, dramatic atmosphere, shallow depth of field, volumetric lighting, epic composition"
    },
    {
        id: 'digital-art',
        label: 'Digital Art',
        modifier: "digital painting, concept art, highly detailed, sharp focus, trending on artstation, unreal engine 5 render, vibrant colors"
    },
    {
        id: '3d-model',
        label: '3D Model',
        modifier: "3d render, octane render, blender, high poly, physically based rendering, studio lighting, clay render style, isometric view"
    },
    {
        id: 'anime',
        label: 'Anime',
        modifier: "anime style, studio ghibli inspired, vibrant colors, cel shaded, detailed background, emotional expression, high quality illustration"
    },
    {
        id: 'none',
        label: 'None',
        modifier: ""
    }
];
