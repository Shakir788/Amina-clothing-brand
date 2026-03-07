"use client";

import { useChat } from 'ai/react';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ChatProductCard from './ChatProductCard'; 
import { useCart } from '@/context/CartContext'; 

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { addToCart, toggleCart } = useCart();
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
  
  // Pura Salam in Arabic
  const welcomeMessages: Record<string, string> = {
    en: "Hello! 👋 I am Amina, your personal stylist. Looking for a Kaftan for a wedding or something casual?",
    fr: "Bonjour ! 👋 Je suis Amina, votre styliste personnelle. Cherchez-vous un Caftan pour un mariage ?",
    ar: "السلام عليكم! 👋 أنا أمينة، مستشارة الأزياء الخاصة بك. هل تبحثين عن قفطان للمناسبات أو ملابس يومية؟",
  };

  // Short Bubble Text
  const bubbleText: Record<string, string> = {
    en: "Hi there! 👋 Need help?",
    fr: "Salut ! 👋 Besoin d'aide ?",
    ar: "السلام عليكم! 👋 هل تحتاجين مساعدة؟"
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: 'welcome',
        role: 'system',
        content: welcomeMessages[lang] || welcomeMessages.en
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowWelcome(true);
      }
    }, 4000); 

    return () => clearTimeout(timer);
  }, [isOpen]);

  // 2. EXISTING LOGIC: "Add to Cart" Handling 
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.content.includes("[ACTION_ADD_TO_CART:")) {
      try {
        const parts = lastMessage.content.split(/\[ACTION_ADD_TO_CART:(.*?)\]/);
        if (parts.length > 1) {
          const productData = JSON.parse(parts[1]);
          if (productData && productData.id) {
            addToCart({
              id: productData.id,
              name: productData.name,
              price: productData.price.toString(),
              image: productData.image,
              slug: productData.slug,
            });
            toggleCart();
          }
        }
      } catch (e) {
        console.error("Auto-add error:", e);
      }
    }
  }, [messages, addToCart, toggleCart]); 

  // Auto Scroll 
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Message Renderer 
  const renderMessageContent = (content: string) => {
    let cleanContent = content.replace(/\[ACTION_ADD_TO_CART:(.*?)\]/g, "");

    if (!cleanContent.includes("[PRODUCT_DATA:")) {
      return <span>{cleanContent}</span>;
    }

    const parts = cleanContent.split(/\[PRODUCT_DATA:(.*?)\]/);
    const firstText = parts[0]; 
    let productCard = null;

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();
      if (part.startsWith('{') && part.endsWith('}')) {
        try {
          const product = JSON.parse(part);
          if (product && (product.id || product.slug)) {
            productCard = <ChatProductCard key="unique-card" product={product} />;
            break; 
          }
        } catch (e) { continue; }
      }
    }

    return (
      <div className="flex flex-col gap-2">
        <span>{firstText}</span>
        {productCard}
      </div>
    );
  };

  return (
    <>
      {/* Floating Wrapper */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 ${lang === 'ar' ? 'items-start left-6 right-auto' : ''}`}>
        
        {/* SILENT WELCOME BUBBLE */}
        {showWelcome && !isOpen && (
          <div className="animate-bounce mb-2 relative">
             <div 
               onClick={() => { setIsOpen(true); setShowWelcome(false); }}
               className="bg-white text-black px-4 py-3 rounded-2xl rounded-tr-none shadow-xl border border-[#D4A373]/30 cursor-pointer hover:scale-105 transition-transform flex items-center gap-2 max-w-[200px]"
             >
                <span className="text-sm font-serif font-medium leading-tight">
                  {bubbleText[lang] || bubbleText.en}
                </span>
             </div>
             {/* Close Bubble Button */}
             <button 
               onClick={(e) => { e.stopPropagation(); setShowWelcome(false); }}
               className="absolute -top-2 -left-2 bg-gray-200 text-gray-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-500 hover:text-white transition-colors"
             >
               ✕
             </button>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={() => { setIsOpen(!isOpen); setShowWelcome(false); }}
          className={`group flex items-center gap-3 transition-all duration-500 ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <div className="bg-black text-white p-4 rounded-full shadow-2xl border border-[#D4A373]/30 hover:scale-110 transition-transform duration-300 relative overflow-hidden">
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-full"></div>
             {/* Notification Dot */}
             {!isOpen && !showWelcome && (
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border border-black rounded-full animate-pulse z-20"></span>
             )}
             <span className="text-2xl relative z-10">✨</span>
          </div>
          {/* Label */}
          <span className="bg-white px-4 py-2 rounded-full shadow-lg text-xs font-bold tracking-[0.2em] text-black border border-gray-100 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-4 group-hover:translate-x-0">
            STYLIST
          </span>
        </button>
      </div>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        <div className="w-[90vw] md:w-[380px] h-[600px] max-h-[80vh] bg-[#F9F9F9]/95 backdrop-blur-md border border-white/50 shadow-2xl rounded-[2rem] flex flex-col overflow-hidden relative">
          
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#D4A373] p-0.5">
                  <Image src="/images/amina-profile.png" width={40} height={40} alt="Amina" className="rounded-full object-cover w-full h-full" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-black leading-none">Amina</h3>
                <p className="text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-0.5">Virtual Stylist</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                {m.role !== 'user' && (
                  <div className="w-6 h-6 rounded-full bg-[#D4A373] flex-shrink-0 mr-2 flex items-center justify-center text-white text-[10px] font-serif">A</div>
                )}
                <div className={`max-w-[85%] p-4 text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-black text-white rounded-2xl rounded-tr-sm font-sans tracking-wide' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm font-serif leading-relaxed'
                }`}>
                  {renderMessageContent(m.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-pulse">
                 <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-[#F5F5F0] p-1.5 rounded-full border border-transparent focus-within:border-[#D4A373]/50 transition-all duration-300">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder={lang === 'ar' ? "اكتبي رسالتك..." : "Type your message..."}
                className={`flex-1 bg-transparent border-none text-sm px-4 py-2 focus:ring-0 outline-none placeholder:text-gray-400 text-black ${lang === 'ar' ? 'text-right' : ''}`}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-[#D4A373] disabled:opacity-50 disabled:hover:bg-black transition-all duration-300 shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={lang === 'ar' ? 'rotate-180' : ''}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </form>
            <p className="text-[9px] text-center text-gray-300 mt-2 tracking-widest uppercase">Powered by Amina AI</p>
          </div>

        </div>
      </div>
    </>
  );
}