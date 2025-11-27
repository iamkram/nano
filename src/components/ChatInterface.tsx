import React, { useRef, useEffect } from 'react';
import { Bot, User, Check, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    isPrompt?: boolean;
}

interface ChatInterfaceProps {
    messages: Message[];
    onConfirmPrompt: () => void;
    onRegeneratePrompt: () => void;
    isGenerating: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onConfirmPrompt,
    onRegeneratePrompt,
    isGenerating
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-[500px] w-full max-w-2xl bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex gap-3 max-w-[80%]",
                                message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                message.role === 'user' ? "bg-neutral-700" : "bg-yellow-400"
                            )}>
                                {message.role === 'user' ? (
                                    <User className="w-5 h-5 text-neutral-300" />
                                ) : (
                                    <Bot className="w-5 h-5 text-black" />
                                )}
                            </div>

                            <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed",
                                message.role === 'user'
                                    ? "bg-neutral-800 text-neutral-200 rounded-tr-sm"
                                    : "bg-neutral-800/50 text-neutral-200 border border-neutral-700 rounded-tl-sm"
                            )}>
                                {message.content}

                                {message.isPrompt && (
                                    <div className="mt-4 flex gap-2 pt-3 border-t border-neutral-700">
                                        <button
                                            onClick={onConfirmPrompt}
                                            disabled={isGenerating}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Check className="w-3 h-3" />
                                            Confirm & Generate
                                        </button>
                                        <button
                                            onClick={onRegeneratePrompt}
                                            disabled={isGenerating}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            Regenerate
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};
