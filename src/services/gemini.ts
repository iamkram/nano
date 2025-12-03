import type { GenerationSettings } from '../components/ControlPanel';
import { stylePresets } from '../lib/stylePresetLibrary';

export interface GeminiResponse {
    prompt: string;
}

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
            const base64Data = base64String.split(',')[1];
            resolve({
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const analyzeDocument = async (file: File, stylePreset?: string, template?: string): Promise<GeminiResponse> => {
    const apiKey = import.meta.env.VITE_NANO_BANANA_PRO_API_KEY;
    if (!apiKey) throw new Error("API key is missing");

    // Use gemini-3-pro-preview for the latest and greatest capabilities
    const model = "gemini-3-pro-preview";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    console.log("Analyzing file:", file.name, "with style:", stylePreset);

    try {
        const filePart = await fileToGenerativePart(file);

        let styleContext = "";
        if (stylePreset) {
            const preset = stylePresets.find(p => p.id === stylePreset);
            if (preset) {
                styleContext = `
                **Target Style Context:**
                The user intends to generate an image in the style of "${preset.label}".
                Style Modifiers: "${preset.modifier}".
                Ensure the generated prompt aligns perfectly with this aesthetic.
                `;
            }
        }

        let templateContext = "";
        if (template) {
            console.log("Using template for analysis:", template);
            templateContext = `
            **Target Template:**
            The user wants to generate an image based on this specific template structure:
            "${template}"
            
            **INSTRUCTION:**
            1. Analyze the document/image to find values for the placeholders (e.g., {{Subject}}, {{Setting}}) in the template.
            2. If a specific value is not found, infer a suitable professional detail based on the context.
            3. Your output MUST be the completed template string.
            4. Do NOT output the placeholders. Replace them with the extracted/inferred details.
            `;
        }

        const promptText = `
            You are an expert creative director and prompt engineer for a high-end AI image generator (Nano Banana Pro).
            Analyze the attached document or image deeply.
            ${styleContext}
            ${templateContext}
            Create a detailed, high-quality image generation prompt that visually represents the core concepts, themes, and key information in this file.
            
            ${!template ? `
            **Prompt Structure:**
            1. **Subject:** Clearly define the main subject.
            2. **Context/Setting:** Describe the environment and background.
            3. **Action:** What is happening?
            4. **Style:** (e.g., Photorealistic, Cinematic, 3D Render, Vector Art).
            5. **Technical Specs:** Lighting (e.g., golden hour, studio), Camera (e.g., 50mm, f/1.8), and Resolution (e.g., 8k, UHD).
            ` : ''}
            
            **Guidelines:**
            - Use natural language and full sentences.
            - Be specific and descriptive.
            - Focus on visual elements, not abstract concepts.
            - Do not summarize the document text; translate it into a visual description.
            
            Output ONLY the prompt text.
        `;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptText },
                        filePart
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Analysis failed: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const json = await response.json();
        const generatedText = json.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) throw new Error("No text generated from analysis");

        return { prompt: generatedText };

    } catch (error) {
        console.error("Error analyzing document:", error);
        throw error;
    }
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
            const selectedPreset = stylePresets.find(p => p.id === settings.stylePreset);
            if (selectedPreset && selectedPreset.modifier) {
                fullPrompt += `, ${selectedPreset.modifier}`;
            }
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
