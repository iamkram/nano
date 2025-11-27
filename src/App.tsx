import { useState, useCallback } from 'react';
import { DragDropZone } from './components/DragDropZone';
import { ChatInterface, type Message } from './components/ChatInterface';
import { ImageGenerator } from './components/ImageGenerator';
import { analyzeDocument, generateImage } from './services/gemini';
import { Sparkles } from 'lucide-react';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

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
      const imageUrl = await generateImage(currentPrompt);
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
  }, [currentPrompt]);

  const handleRegeneratePrompt = useCallback(() => {
    // In a real app, this would trigger another analysis or modification
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm regenerating the prompt based on a different angle..."
      }
    ]);
    // Mock delay for regeneration
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 p-8 flex flex-col items-center">
      <header className="w-full max-w-6xl flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-black" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Nano Banana <span className="text-yellow-400">Pro</span>
          </h1>
        </div>
        <div className="text-sm text-neutral-500 font-mono">v1.0.0</div>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center gap-8">
        {!messages.length && !isProcessing && (
          <div className="text-center mb-8 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              Transform Documents into Visuals
            </h2>
            <p className="text-lg text-neutral-400 max-w-xl mx-auto">
              Drag and drop your documents to leverage Gemini 1.5 Pro for intelligent prompt generation.
            </p>
          </div>
        )}

        <DragDropZone
          onFileSelect={handleFileSelect}
          isProcessing={isProcessing}
        />

        {(messages.length > 0 || isProcessing) && (
          <ChatInterface
            messages={messages}
            onConfirmPrompt={handleConfirmPrompt}
            onRegeneratePrompt={handleRegeneratePrompt}
            isGenerating={isGenerating}
          />
        )}

        <ImageGenerator
          imageUrl={generatedImage}
          isGenerating={isGenerating}
        />
      </main>
    </div>
  );
}

export default App;
