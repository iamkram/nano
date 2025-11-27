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
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
                {isGenerating ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10">
                        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
                        <p className="text-yellow-400 font-medium tracking-wide animate-pulse">GENERATING VISUALS...</p>
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

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                            <div className="flex gap-3">
                                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
                                    <Download className="w-5 h-5" />
                                </button>
                                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                            <span className="text-white/50 text-sm font-mono">NANO BANANA PRO</span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
