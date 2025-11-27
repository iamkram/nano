import type { GenerationSettings } from '../components/ControlPanel';

export interface GeminiResponse {
    prompt: string;
}

export const analyzeDocument = async (file: File): Promise<GeminiResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Analyzing file:", file.name);

    // Mock response based on file name or random
    return {
        prompt: `A futuristic city with glowing neon lights, inspired by the contents of ${file.name}. The style is cyberpunk with a touch of noir. High resolution, 8k.`,
    };
};

export const generateImage = async (prompt: string, settings?: GenerationSettings): Promise<string> => {
    const apiKey = import.meta.env.VITE_NANO_BANANA_PRO_API_KEY;

    if (!apiKey) {
        console.warn("VITE_NANO_BANANA_PRO_API_KEY is missing!");
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    console.log("Generating image with:", {
        prompt,
        settings,
        apiKey: apiKey ? "PRESENT" : "MISSING"
    });

    // Return a placeholder image URL
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
}
