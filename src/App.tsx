import { useState, useCallback } from 'react';
import { DragDropZone } from './components/DragDropZone';
import { ChatInterface, type Message } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';
import { Login } from './components/Login';
import { ControlPanel, type GenerationSettings } from './components/ControlPanel';
import { analyzeDocument, generateImage } from './services/gemini';
import { Sparkles, Settings2, Megaphone, LayoutTemplate, Target, Share2, Loader2, LogOut, BarChart3, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [inputInternal, setInputInternal] = useState("");

  const [settings, setSettings] = useState<GenerationSettings>({
    aspectRatio: '16:9',
    stylePreset: 'photographic',
    negativePrompt: '',
    guidanceScale: 7.5
  });

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    try {
      const response = await analyzeDocument(file);
      const newPrompt = response.prompt;

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've analyzed ${file.name}. Here is a suggested prompt for the image generation:`,
          promptContent: newPrompt,
          isPrompt: true
        }
      ]);
    } catch (error) {
      console.error("Error analyzing document:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Sorry, I encountered an error analyzing the document. Please try again."
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleConfirmPrompt = useCallback(async (promptToUse: string) => {
    if (!promptToUse) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(promptToUse, settings);
      setGeneratedImage(imageUrl);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Image generated successfully! You can see it below."
        }
      ]);
    } catch (error) {
      console.error("Error generating image:", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Error generating image: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  const handleRegeneratePrompt = useCallback((promptToRefine: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm refining the prompt to better match a professional financial aesthetic..."
      }
    ]);

    setTimeout(() => {
      // In a real app, this would call the LLM to rewrite the prompt
      const newPrompt = "Refined Version: " + promptToRefine + " --style corporate-premium --palette slate-blue-gold --quality 8k";
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Here is the refined prompt:`,
          promptContent: newPrompt,
          isPrompt: true
        }
      ]);
    }, 1000);
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: message
      }
    ]);

    setInputInternal(""); // Clear the input field after sending

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've updated the prompt based on your input:`,
          promptContent: message,
          isPrompt: true
        }
      ]);
    }, 500);
  }, []);

  const quickPrompts = [
    { icon: Megaphone, label: "Campaign Launch", prompt: "A high-impact visual for a new product launch featuring dramatic lighting, sleek product placement, and bold, modern typography space." },
    { icon: LayoutTemplate, label: "Social Media Series", prompt: "A cohesive set of lifestyle-focused images for an Instagram campaign, using a warm, authentic color palette and natural lighting." },
    { icon: Target, label: "Brand Awareness", prompt: "A conceptual, abstract representation of 'Innovation and Trust', utilizing geometric shapes, glassmorphism, and the corporate color palette." },
    { icon: Share2, label: "Event Promotion", prompt: "A dynamic, high-energy banner for an upcoming tech conference, featuring futuristic cityscapes and connected network nodes." },
    { icon: BarChart3, label: "Earnings Report", prompt: "Generate a clean, modern infographic summarizing the key financial highlights from this earnings report. Include charts for 'Revenue Growth' and 'Net Income', and highlight the CEO's key quote in a stylized pull-quote box." },
    { icon: FileText, label: "Visual Summary", prompt: "Compress this dense text into a clear visual aid. Transform complex paragraphs into intuitive diagrams and flowcharts, reducing reading time while retaining key information." }
  ];

  if (!isAuthenticated) {
    return <Login onLogin={setIsAuthenticated} />;
  }

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Sidebar Controls */}
      <div className={`${showControls ? 'w-80' : 'w-0'} transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden bg-[#0F1420] border-r border-white/5 relative z-20 shadow-2xl`}>
        <ControlPanel
          settings={settings}
          onSettingsChange={setSettings}
          className="h-full w-80"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-[#0B0F17]/80 backdrop-blur-xl border-b border-white/5 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-200"
            >
              <Settings2 className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-medium tracking-tight text-white">
              Nano Banana <span className="text-blue-500 font-bold">Pro</span>
            </h1>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
              Enterprise Marketing Console
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-slate-300">System Online</span>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto p-8 pb-32 space-y-12">

            {/* Hero Section */}
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-center min-h-[500px]">
              {/* Left Column: Chat & Input */}
              <div className="flex-1 w-full max-w-2xl space-y-6">
                <div className="bg-[#0F1420] rounded-3xl border border-white/5 shadow-xl overflow-hidden">
                  <ChatInterface
                    messages={messages}
                    onConfirmPrompt={handleConfirmPrompt}
                    onRegeneratePrompt={handleRegeneratePrompt}
                    onSendMessage={handleSendMessage}
                    isGenerating={isGenerating}
                  />
                </div>

                {/* Input Area */}
                <div className="bg-[#0F1420] p-2 rounded-3xl border border-white/5 shadow-2xl shadow-black/50 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/30">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (inputInternal.trim()) handleSendMessage(inputInternal.trim());
                    }}
                    className="relative flex flex-col group"
                  >
                    <textarea
                      value={inputInternal}
                      onChange={(e) => setInputInternal(e.target.value)}
                      placeholder="Describe the marketing campaign, visual asset, or brand concept you want to visualize..."
                      className="w-full bg-transparent text-lg text-white placeholder-slate-500 rounded-2xl p-6 focus:outline-none resize-none min-h-[140px] leading-relaxed"
                    />
                    <div className="flex justify-between items-center px-4 pb-2">
                      <div className="flex gap-2">
                        {/* Future attachment buttons could go here */}
                      </div>
                      <button
                        type="submit"
                        disabled={!inputInternal.trim() || isGenerating}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 active:scale-95"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Generate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Upload & Preview */}
              <div className="flex-1 w-full max-w-xl space-y-6">
                <div className="bg-[#0F1420] rounded-3xl border border-white/5 p-1 shadow-xl">
                  <DragDropZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
                </div>

                <AnimatePresence mode="wait">
                  {generatedImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-[#0F1420] rounded-3xl border border-white/5 p-1 shadow-xl"
                    >
                      <ImageGenerator imageUrl={generatedImage} isGenerating={isGenerating} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quick Prompts Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">Quick Start</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickPrompts.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setInputInternal(item.prompt)}
                    className="group flex flex-col gap-4 p-6 bg-[#0F1420] hover:bg-[#161b26] border border-white/5 hover:border-blue-500/30 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10"
                  >
                    <div className="p-3 bg-slate-900/50 rounded-xl w-fit group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                      <item.icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-200 group-hover:text-white mb-1">{item.label}</h3>
                      <p className="text-sm text-slate-500 group-hover:text-slate-400 line-clamp-2 leading-relaxed">
                        {item.prompt}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
