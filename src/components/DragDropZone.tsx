import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DragDropZoneProps {
    onFileSelect: (file: File) => void;
    isProcessing: boolean;
}

export const DragDropZone: React.FC<DragDropZoneProps> = ({ onFileSelect, isProcessing }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt', '.md'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: false,
        disabled: isProcessing
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative w-full max-w-2xl h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group",
                isDragActive ? "border-blue-500 bg-blue-500/5" : "border-slate-700 hover:border-blue-500/50 bg-slate-900/50",
                isProcessing && "pointer-events-none opacity-50"
            )}
        >
            <input {...getInputProps()} />

            <AnimatePresence mode="wait">
                {isProcessing ? (
                    <motion.div
                        key="processing"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-slate-400 font-medium">Analyzing document...</p>
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
                            "p-4 rounded-full bg-slate-800 transition-transform duration-300 group-hover:scale-110 shadow-lg",
                            isDragActive && "bg-blue-500/20"
                        )}>
                            {isDragActive ? (
                                <FileText className="w-8 h-8 text-blue-500" />
                            ) : (
                                <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400 transition-colors" />
                            )}
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-slate-200">
                                {isDragActive ? "Drop your file here" : "Drag & drop your document"}
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                                or click to browse
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Decorative gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
    );
};
