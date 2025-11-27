import React from 'react';
import { Settings2, Sliders, Ratio, Type, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

export interface GenerationSettings {
    aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    stylePreset: 'photographic' | 'digital-art' | 'cinematic' | 'anime' | '3d-model' | 'none';
    negativePrompt: string;
    guidanceScale: number;
}

interface ControlPanelProps {
    settings: GenerationSettings;
    onSettingsChange: (settings: GenerationSettings) => void;
    className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    settings,
    onSettingsChange,
    className
}) => {
    const handleChange = (key: keyof GenerationSettings, value: any) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className={cn("flex flex-col gap-6 p-6 bg-neutral-900/50 border-r border-neutral-800 h-full overflow-y-auto", className)}>
            <div className="flex items-center gap-2 mb-2">
                <Settings2 className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Controls</h2>
            </div>

            {/* Style Preset */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    <Palette className="w-4 h-4" />
                    Style Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {['Photographic', 'Digital Art', 'Cinematic', 'Anime', '3D Model', 'None'].map((style) => {
                        const value = style.toLowerCase().replace(' ', '-') as GenerationSettings['stylePreset'];
                        const isActive = settings.stylePreset === value;
                        return (
                            <button
                                key={style}
                                onClick={() => handleChange('stylePreset', value)}
                                className={cn(
                                    "px-3 py-2 text-xs font-medium rounded-lg border transition-all",
                                    isActive
                                        ? "bg-yellow-400/10 border-yellow-400 text-yellow-400"
                                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
                                )}
                            >
                                {style}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    <Ratio className="w-4 h-4" />
                    Aspect Ratio
                </label>
                <div className="flex flex-wrap gap-2">
                    {['1:1', '16:9', '9:16', '4:3', '3:4'].map((ratio) => {
                        const isActive = settings.aspectRatio === ratio;
                        return (
                            <button
                                key={ratio}
                                onClick={() => handleChange('aspectRatio', ratio)}
                                className={cn(
                                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                                    isActive
                                        ? "bg-yellow-400/10 border-yellow-400 text-yellow-400"
                                        : "bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300"
                                )}
                            >
                                {ratio}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Guidance Scale */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                        <Sliders className="w-4 h-4" />
                        Guidance Scale
                    </label>
                    <span className="text-xs font-mono text-neutral-500">{settings.guidanceScale}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={settings.guidanceScale}
                    onChange={(e) => handleChange('guidanceScale', parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                />
                <p className="text-xs text-neutral-500">
                    Higher values follow the prompt more strictly.
                </p>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                    <Type className="w-4 h-4" />
                    Negative Prompt
                </label>
                <textarea
                    value={settings.negativePrompt}
                    onChange={(e) => handleChange('negativePrompt', e.target.value)}
                    placeholder="What to exclude (e.g. blurry, low quality)..."
                    className="w-full h-24 bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-yellow-400/50 resize-none"
                />
            </div>
        </div>
    );
};
