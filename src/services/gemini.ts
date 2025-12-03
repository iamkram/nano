import type { GenerationSettings } from '../components/ControlPanel';

export interface GeminiResponse {
    prompt: string;
}

export const analyzeDocument = async (file: File): Promise<GeminiResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Analyzing file:", file.name);

    // Mock response based on file name
    return {
        prompt: `**Concept:** A compelling marketing visual derived from ${file.name}.\n**Key Message:** Highlighting core value propositions and brand identity.\n**Composition:** Dynamic commercial layout, rule of thirds, clear focal point for product or message.\n**Style:** Premium advertising aesthetic, on-brand color palette, high-fidelity textures, persuasive visual hierarchy.\n**Lighting:** Studio-quality commercial lighting, emphasizing depth and quality.\n**Context:** Suitable for high-impact digital campaigns and print media.`,
    };
};

export const generateImage = async (prompt: string, settings?: GenerationSettings): Promise<string> => {
    const apiKey = import.meta.env.VITE_NANO_BANANA_PRO_API_KEY;

    if (!apiKey) {
        console.error("VITE_NANO_BANANA_PRO_API_KEY is missing!");
        throw new Error("API key is missing");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/nano-banana-pro-preview:generateContent?key=${apiKey}`;

    // Construct the prompt with settings if available
    // Enforce professional quality standards
    const qualityKeywords = "professional, enterprise-grade, marketing department quality, high-end, polished, sophisticated, 8k resolution, highly detailed, commercial photography";
    let fullPrompt = `${prompt}, ${qualityKeywords}`;

    if (settings) {
        if (settings.stylePreset && settings.stylePreset !== 'none') {
            fullPrompt += `, style: ${settings.stylePreset}`;
        }
        // Note: Aspect ratio and negative prompt might need specific handling depending on the model's capabilities
        // For now, we append them to the text prompt as guidance
        if (settings.aspectRatio) {
            fullPrompt += `, aspect ratio: ${settings.aspectRatio}`;
        }
        if (settings.negativePrompt) {
            fullPrompt += `, avoid: ${settings.negativePrompt}`;
        }
        if (settings.guidanceScale) {
            fullPrompt += `, guidance scale: ${settings.guidanceScale}`;
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: fullPrompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const json = await response.json();

        if (json.candidates && json.candidates[0]?.content?.parts) {
            const part = json.candidates[0].content.parts.find((p: any) => p.inlineData);
            if (part && part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }

        throw new Error("No image data found in response");
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
}
