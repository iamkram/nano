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
    onSendMessage: (message: string) => void;
    isGenerating: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
    messages,
    onConfirmPrompt,
    onRegeneratePrompt,
    onSendMessage,
    isGenerating
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = React.useState("");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isGenerating) {
            onSendMessage(inputValue.trim());
            setInputValue("");
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden shadow-xl shadow-black/20">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
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
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-md",
                                message.role === 'user' ? "bg-blue-600" : "bg-slate-800 border border-slate-700"
                            )}>
                                {message.role === 'user' ? (
                                    <User className="w-5 h-5 text-white" />
                                ) : (
                                    <Bot className="w-5 h-5 text-blue-400" />
                                )}
                            </div>

                            <div className={cn(
                                "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                message.role === 'user'
                                    ? "bg-blue-600 text-white rounded-tr-sm"
                                    : "bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm"
                            )}>
                                {message.content}

                                {message.isPrompt && (
                                    <div className="mt-4 flex gap-2 pt-3 border-t border-slate-700/50">
                                        <button
                                            onClick={onConfirmPrompt}
                                            disabled={isGenerating}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <Check className="w-3 h-3" />
                                            Confirm & Generate
                                        </button>
                                        <button
                                            onClick={onRegeneratePrompt}
                                            disabled={isGenerating}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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

            <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/30">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Describe your intent or refine the prompt..."
                        disabled={isGenerating}
                        className="w-full bg-slate-800 text-slate-200 placeholder-slate-500 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-transparent focus:border-blue-500/50 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isGenerating}
                        className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <User className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};
