import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DragDropZoneProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({ onFileSelect, isProcessing }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    }, [onFileSelect]);

    return (
        <div
            className={cn(
                "relative w-full max-w-2xl h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group",
                isDragging ? "border-yellow-400 bg-yellow-400/5" : "border-neutral-700 hover:border-neutral-500 bg-neutral-900/50",
                isProcessing && "pointer-events-none opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
        >
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept=".txt,.pdf,.doc,.docx"
            />

            <AnimatePresence mode="wait">
                {isProcessing ? (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <Loader2 className="w-12 h-12 text-yellow-400 animate-spin" />
                        <p className="text-neutral-400 font-medium">Analyzing document...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className={cn(
                            "p-4 rounded-full bg-neutral-800 transition-transform duration-300 group-hover:scale-110",
                            isDragging && "bg-yellow-400/20"
                        )}>
                            {isDragging ? (
                                <FileText className="w-8 h-8 text-yellow-400" />
                            ) : (
                                <Upload className="w-8 h-8 text-neutral-400 group-hover:text-yellow-400 transition-colors" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-neutral-200">
                                {isDragging ? "Drop your file here" : "Drag & drop your document"}
                            </p>
                            <p className="text-sm text-neutral-500 mt-1">
                                or click to browse
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};
