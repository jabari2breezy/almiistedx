import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, X, MessageSquare, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `
You are the official AI assistant for TEDxYouth @ Al Muntazir School 2026.
Theme: "Borrowed Time".
Location: Al Muntazir Islamic International School - Nursery Campus (Main Assembly Hall).
Date: June 15th, 2026.

Confirmed Speakers and Topics:
- Anaya Rashid: "The Culture of Time" (Segment: Past)
- Zahra Datoo: "The Architecture of Nostalgia" (Segment: Past)
- Hassan Abbas Mohammed: "The Procrastination Paradox" (Segment: Present)
- Zahra Moledina: "Capitalism's Clock" (Segment: Present)
- Liyaan Karbelkar: "The Legacy We Leave" (Segment: Future)
- Sada Mbaruk Said: "Three Clocks: Climate, Animals, AI" (Segment: Future)

Context: The event explores community, inspiration, and the urgency of our limited time. 
Tone: Helpful, intellectual, inspiring, and slightly urgent. Keep responses concise and thought-provoking.
If you're unsure about logistics, direct users to the contact form on the website.
`;

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.GEMINI_API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !aiRef.current) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await aiRef.current.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "Something went wrong. My neural circuits are acting up." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[200] w-12 h-12 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-brand-secondary transition-colors"
      >
        <Sparkles size={20} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-8 z-[200] w-[90vw] md:w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl flex flex-col border border-brand-outline overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-primary p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-brand-secondary/20 p-2 rounded-xl">
                  <Bot size={20} className="text-brand-secondary" />
                </div>
                <div>
                  <h3 className="font-title uppercase tracking-wider text-xs font-bold">Event Assistant</h3>
                  <p className="text-[10px] text-white/60">Theme: Borrowed Time</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <MessageSquare size={48} className="mb-4" />
                  <p className="font-editorial italic text-lg">"Time is what we want most, but what we use worst."</p>
                  <p className="text-[10px] uppercase tracking-widest mt-4">Ask me about the event</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                    ? 'bg-brand-surface text-brand-primary rounded-tr-none' 
                    : 'bg-brand-secondary/10 text-brand-primary rounded-tl-none font-editorial italic text-lg'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-brand-secondary/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 border-t border-brand-outline bg-brand-surface">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about Borrowed Time..."
                  className="w-full bg-white border border-brand-outline rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-brand-secondary transition-colors"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-secondary hover:bg-brand-secondary/10 rounded-lg transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
