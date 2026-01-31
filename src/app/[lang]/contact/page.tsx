'use client'

import { MessageCircle, Mail, Instagram, MapPin } from 'lucide-react'

export default function ContactPage({ params }: { params: { lang: string } }) {
  const isArabic = params.lang === 'ar'

  // Translations
  const t = {
    title: params.lang === 'fr' ? 'Contactez-Nous' : params.lang === 'ar' ? 'اتصل بنا' : 'Contact Us',
    subtitle: params.lang === 'fr' 
      ? "Nous sommes là pour vous aider. Envoyez-nous un message !" 
      : params.lang === 'ar' 
      ? "نحن هنا لمساعدتك. راسلنا في أي وقت!" 
      : "We are here to help. Reach out to us anytime!",
    
    whatsapp: {
      title: "WhatsApp Support",
      desc: params.lang === 'fr' ? "Réponse instantanée" : "Instant Response",
      action: "+212 723 908 603"
    },
    email: {
      title: "Email Us",
      desc: params.lang === 'fr' ? "Pour les demandes pro" : "For business inquiries",
      action: "aminaclothingbrand@gmail.com"
    },
    insta: {
      title: "Follow Us",
      desc: "@aminaclothingbrand",
      action: params.lang === 'fr' ? "Voir le profil" : "View Profile"
    }
  }

  return (
    <div className={`min-h-screen bg-[#F4F1EA] pt-40 pb-20 px-6 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-[#D4A373] text-xs font-bold uppercase tracking-[0.3em]">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C2C2C]">{t.title}</h1>
          <p className="text-gray-500 font-light max-w-xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Contact Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. WhatsApp Card (Clickable) */}
          <a 
            href="https://wa.me/212723908603" 
            target="_blank" 
            className="bg-white p-8 rounded-2xl border border-[#D4A373]/20 shadow-sm hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 group text-center flex flex-col items-center"
          >
            <div className="w-14 h-14 bg-[#F4F1EA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4A373] transition-colors duration-300">
              <MessageCircle size={24} className="text-[#D4A373] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#2C2C2C] mb-2">{t.whatsapp.title}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{t.whatsapp.desc}</p>
            <span className="text-[#D4A373] font-medium border-b border-[#D4A373]/30 pb-1">{t.whatsapp.action}</span>
          </a>

          {/* 2. Email Card (Clickable) */}
          <a 
            href="mailto:aminaclothingbrand@gmail.com"
            className="bg-white p-8 rounded-2xl border border-[#D4A373]/20 shadow-sm hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 group text-center flex flex-col items-center"
          >
            <div className="w-14 h-14 bg-[#F4F1EA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4A373] transition-colors duration-300">
              <Mail size={24} className="text-[#D4A373] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#2C2C2C] mb-2">{t.email.title}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{t.email.desc}</p>
            <span className="text-[#D4A373] font-medium border-b border-[#D4A373]/30 pb-1">Send Email</span>
          </a>

          {/* 3. Instagram Card (Clickable) */}
          <a 
            href="https://www.instagram.com/aminaclothingbrand/"
            target="_blank"
            className="bg-white p-8 rounded-2xl border border-[#D4A373]/20 shadow-sm hover:shadow-xl hover:border-[#D4A373] transition-all duration-300 group text-center flex flex-col items-center"
          >
            <div className="w-14 h-14 bg-[#F4F1EA] rounded-full flex items-center justify-center mb-6 group-hover:bg-[#D4A373] transition-colors duration-300">
              <Instagram size={24} className="text-[#D4A373] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-lg font-serif font-medium text-[#2C2C2C] mb-2">{t.insta.title}</h3>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">{t.insta.desc}</p>
            <span className="text-[#D4A373] font-medium border-b border-[#D4A373]/30 pb-1">{t.insta.action}</span>
          </a>

        </div>

        {/* Location / Note */}
        <div className="mt-16 text-center text-gray-400 text-sm flex items-center justify-center gap-2 opacity-60">
          <MapPin size={16} />
          <span>Casablanca, Morocco (Online Exclusive)</span>
        </div>

      </div>
    </div>
  )
}