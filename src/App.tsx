import { useState, useCallback } from 'react';
import { DragDropZone } from './components/DragDropZone';
import { ChatInterface, type Message } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';
import { ControlPanel, type GenerationSettings } from './components/ControlPanel';
import { analyzeDocument, generateImage } from './services/gemini';
import { Sparkles, Menu } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

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
      setCurrentPrompt(newPrompt);

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've analyzed ${file.name}. Here is a suggested prompt for the image generation:\n\n"${newPrompt}"\n\nWould you like to generate this image or refine the prompt?`,
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

  const handleConfirmPrompt = useCallback(async () => {
    if (!currentPrompt) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(currentPrompt, settings);
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
    } finally {
      setIsGenerating(false);
    }
  }, [currentPrompt, settings]);

  const handleRegeneratePrompt = useCallback(() => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm regenerating the prompt based on a different angle..."
      }
    ]);

    setTimeout(() => {
      const newPrompt = "A different perspective: " + currentPrompt;
      setCurrentPrompt(newPrompt);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `Here is the refined prompt:\n\n"${newPrompt}"`,
          isPrompt: true
        }
      ]);
    }, 1000);
  }, [currentPrompt]);

  const handleSendMessage = useCallback((message: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: message
      }
    ]);

    setCurrentPrompt(message);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I've updated the prompt based on your input:\n\n"${message}"`,
          isPrompt: true
        }
      ]);
    }, 500);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-neutral-200 overflow-hidden">
      {/* Sidebar Controls */}
      <div className={`${showControls ? 'w-80' : 'w-0'} transition-all duration-300 ease-in-out overflow-hidden border-r border-neutral-800 bg-neutral-900/30`}>
        <ControlPanel
          settings={settings}
          onSettingsChange={setSettings}
          className="h-full w-80"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 border-b border-neutral-800 flex items-center justify-between px-6 bg-neutral-900/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowControls(!showControls)}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-neutral-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Nano Banana <span className="text-yellow-400">Pro</span>
              </h1>
            </div>
          </div>
          <div className="text-xs text-neutral-500 font-mono">v1.1.0</div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 pb-20">
            {!messages.length && !isProcessing && (
              <div className="text-center mt-12 mb-8 space-y-8 w-full max-w-2xl">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                    Create with Intent
                  </h2>
                  <p className="text-lg text-neutral-400">
                    Describe your vision or upload a document to start generating professional visuals.
                  </p>
                </div>

                <div className="w-full">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = (e.currentTarget.elements.namedItem('initial-prompt') as HTMLInputElement).value;
                      if (input.trim()) handleSendMessage(input.trim());
                    }}
                    className="relative flex items-center group"
                  >
                    <input
                      name="initial-prompt"
                      type="text"
                      placeholder="Describe what you want to create..."
                      className="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-200 placeholder-neutral-500 rounded-2xl py-4 pl-6 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all shadow-lg shadow-black/20 group-hover:border-neutral-700"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 p-2.5 bg-yellow-400 text-black rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-400/20"
                    >
                      <Sparkles className="w-5 h-5" />
                    </button>
                  </form>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[#0a0a0a] text-neutral-500">Or start with a document</span>
                  </div>
                </div>
              </div>
            )}

            <DragDropZone
              onFileSelect={handleFileSelect}
              isProcessing={isProcessing}
            />

            {(messages.length > 0 || isProcessing) && (
              <div className="w-full flex gap-6 items-start justify-center flex-wrap xl:flex-nowrap">
                <ChatInterface
                  messages={messages}
                  onConfirmPrompt={handleConfirmPrompt}
                  onRegeneratePrompt={handleRegeneratePrompt}
                  onSendMessage={handleSendMessage}
                  isGenerating={isGenerating}
                />

                {(generatedImage || isGenerating) && (
                  <div className="flex-1 min-w-[300px] max-w-2xl sticky top-8">
                    <ImageGenerator
                      imageUrl={generatedImage}
                      isGenerating={isGenerating}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
