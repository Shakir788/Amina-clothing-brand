"use client";

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react'; // 👈 useRef aur useEffect add kiya
import { useParams } from 'next/navigation';

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  
  // 👇 1. Scroll karne ke liye anchor banaya
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Language detect karo (URL se)
  const params = useParams();
  const lang = (params?.lang as string) || 'en'; // Default English

  // 2. Har language ke liye Welcome Message
  const welcomeMessages: Record<string, string> = {
    en: "Hello! 👋 I am your personal stylist. Looking for a wedding outfit or casual wear?",
    fr: "Bonjour ! 👋 Je suis votre styliste personnelle. Cherchez-vous une tenue de mariage ou décontractée ?",
    ar: "مرحباً! 👋 أنا مستشارة الأزياء الخاصة بك. هل تبحثين عن قفطان للمناسبات أو ملابس يومية؟",
  };

  const currentMessage = welcomeMessages[lang] || welcomeMessages.en;

  // 👇 2. Jaise hi message aaye, neeche scroll karo
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-amina-black text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform duration-300 flex items-center gap-2 border border-amina-border"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <>
            <span className="text-xl">✨</span>
            <span className="text-xs font-bold tracking-widest hidden md:block">STYLIST</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[90%] md:w-[350px] h-[500px] bg-amina-sand border border-amina-border shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-white p-4 border-b border-amina-border flex items-center gap-3">
            
            {/* Photo Section */}
            <img 
              src="/images/amina-profile.png" 
              alt="Amina Stylist"
              className="w-10 h-10 rounded-full object-cover border-[1.5px] border-amina-clay shadow-sm"
            />
            
            <div>
              <h3 className="font-serif text-amina-black font-bold">Amina Stylist</h3>
              <p className="text-[10px] text-amina-stone uppercase tracking-widest">Personal Assistant</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
            {messages.length === 0 && (
              <p className={`text-center text-sm text-amina-stone mt-10 whitespace-pre-line ${lang === 'ar' ? 'font-amiri text-base' : ''}`}>
                {currentMessage}
              </p>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 text-sm rounded-xl ${
                  m.role === 'user' 
                    ? 'bg-amina-black text-white rounded-br-none' 
                    : 'bg-white border border-amina-border text-amina-black rounded-bl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <p className="text-xs text-amina-stone animate-pulse">Thinking...</p>}
            
            {/* 👇 3. Ye Invisible element hai jahan chat aake rukegi */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-amina-border flex gap-2">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder={lang === 'fr' ? "Posez une question..." : (lang === 'ar' ? "اسألي عن الموضة..." : "Ask me about fashion...")}
              className={`flex-1 text-sm bg-amina-sand/50 border-none rounded-lg px-3 py-2 focus:ring-1 focus:ring-amina-clay outline-none ${lang === 'ar' ? 'text-right' : ''}`}
            />
            <button type="submit" className="bg-amina-black text-white p-2 rounded-lg hover:bg-amina-clay transition">
              ➤
            </button>
          </form>

        </div>
      )}
    </>
  );
}