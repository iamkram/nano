import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Download, Share2 } from 'lucide-react';

interface ImageGeneratorProps {
    imageUrl: string | null;
    isGenerating: boolean;
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({ imageUrl, isGenerating }) => {
    if (!imageUrl && !isGenerating) return null;

    return (
        <div className="w-full max-w-2xl mt-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 group shadow-2xl shadow-black/50">
                {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                        <p className="text-blue-400 font-medium tracking-wide animate-pulse">GENERATING VISUALS...</p>
                    </div>
                ) : null}

                {imageUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full"
                    >
                        <img
                            src={imageUrl}
                            alt="Generated content"
                            className="w-full h-full object-cover"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        if (imageUrl) {
                                            const link = document.createElement('a');
                                            link.href = imageUrl;
                                            link.download = `nano-banana-pro-${Date.now()}.png`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }
                                    }}
                                    className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-md text-white transition-colors border border-slate-700"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/80 backdrop-blur-md text-white transition-colors border border-slate-700">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                            <span className="text-slate-400 text-sm font-mono">NANO BANANA PRO</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
