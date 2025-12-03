import React from 'react';
import { Settings2, Sliders, Image as ImageIcon, Maximize, Ban } from 'lucide-react';
import { cn } from '../lib/utils';

import { stylePresets } from '../lib/stylePresetLibrary';

export interface GenerationSettings {
    aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    stylePreset: string;
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
    const handleChange = (key: keyof GenerationSettings, value: GenerationSettings[keyof GenerationSettings]) => {
        onSettingsChange({ ...settings, [key]: value });
    };

    return (
        <div className={cn("flex flex-col h-full bg-[#0F1420] text-slate-300", className)}>
            <div className="p-6 border-b border-white/5 bg-[#0B0F17]/50">
                <div className="flex items-center gap-3 text-white mb-1">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                        <Settings2 className="w-5 h-5" />
                    </div>
                    <h2 className="font-semibold text-lg tracking-tight">Configuration</h2>
                </div>
                <p className="text-xs text-slate-500 ml-11">Fine-tune your generation settings</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">

                {/* Style Preset */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <ImageIcon className="w-4 h-4 text-blue-400" />
                        Style Preset
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {stylePresets.map((style) => {
                            const isActive = settings.stylePreset === style.id;
                            return (
                                <button
                                    key={style.id}
                                    type="button"
                                    onClick={() => handleChange('stylePreset', style.id)}
                                    className={cn(
                                        "px-3 py-2.5 text-xs font-medium rounded-xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden group",
                                        isActive
                                            ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-900/20"
                                            : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-blue-500/30 hover:text-slate-200 hover:bg-slate-800/50"
                                    )}
                                >
                                    <span className="relative z-10">{style.label}</span>
                                    {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Maximize className="w-4 h-4 text-blue-400" />
                        Aspect Ratio
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {['1:1', '16:9', '9:16', '4:3', '3:4'].map((ratio) => {
                            const isActive = settings.aspectRatio === ratio;
                            return (
                                <button
                                    key={ratio}
                                    type="button"
                                    onClick={() => handleChange('aspectRatio', ratio)}
                                    className={cn(
                                        "px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 cursor-pointer",
                                        isActive
                                            ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/20"
                                            : "bg-slate-900/50 border-white/5 text-slate-400 hover:border-blue-500/30 hover:text-slate-200 hover:bg-slate-800/50"
                                    )}
                                >
                                    {ratio}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Guidance Scale */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
                            <Sliders className="w-4 h-4 text-blue-400" />
                            Guidance Scale
                        </label>
                        <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-blue-400 border border-blue-500/20">
                            {settings.guidanceScale}
                        </span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={settings.guidanceScale}
                        onChange={(e) => handleChange('guidanceScale', parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                        <span>Creative</span>
                        <span>Balanced</span>
                        <span>Precise</span>
                    </div>
                </div>

                {/* Negative Prompt */}
                <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
                        <Ban className="w-4 h-4 text-red-400" />
                        Negative Prompt
                    </label>
                    <textarea
                        value={settings.negativePrompt}
                        onChange={(e) => handleChange('negativePrompt', e.target.value)}
                        placeholder="What to exclude (e.g. blurry, low quality)..."
                        className="w-full h-32 bg-slate-900/50 border border-white/5 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 resize-none transition-all"
                    />
                </div>
            </div>
        </div>
    );
};
