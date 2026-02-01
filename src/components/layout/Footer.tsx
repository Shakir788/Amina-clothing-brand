import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

export default function Footer({ lang }: { lang: string }) {
  
  // Brand ke Social Links
  const socialLinks = {
    instagram: "https://www.instagram.com/aminaclothingbrand/",
    facebook: "https://www.facebook.com/profile.php?id=61587300055925",
    whatsapp: "https://wa.me/212723908603", // Brand ka number
    email: "mailto:aminaclothingbrand@gmail.com"
  };

  // Tera Personal Number (OneLinkStudio)
  const developerWhatsapp = "919520292346"; 

  return (
    <footer className="bg-[#F5F1E8] border-t border-[#D4A373]/20 py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">
        
        {/* Logo */}
        <h2 className="text-2xl font-serif font-bold tracking-[0.15em] mb-8 text-[#2C2C2C]">
          AMINA
        </h2>
        
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-8 mb-8 text-xs uppercase tracking-[0.2em] font-medium text-gray-500">
          <Link href={`/${lang}/collection`} className="hover:text-[#D4A373] transition-colors duration-300">
            Collection
          </Link>
          <Link href={`/${lang}/about`} className="hover:text-[#D4A373] transition-colors duration-300">
            Brand Story
          </Link>
          <Link href={`/${lang}/faq`} className="hover:text-[#D4A373] transition-colors duration-300">
            FAQ / Help
          </Link>
          <Link href={`/${lang}/contact`} className="hover:text-[#D4A373] transition-colors duration-300">
            Customer Care
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-6 mb-8">
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4A373] transition-colors transform hover:-translate-y-1 duration-300">
              <Instagram size={20} />
            </a>
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4A373] transition-colors transform hover:-translate-y-1 duration-300">
              <Facebook size={20} />
            </a>
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4A373] transition-colors transform hover:-translate-y-1 duration-300">
              <MessageCircle size={20} />
            </a>
             <a href={socialLinks.email} className="text-gray-400 hover:text-[#D4A373] transition-colors transform hover:-translate-y-1 duration-300">
              <Mail size={20} />
            </a>
        </div>

        {/* Separator Line */}
        <div className="w-12 h-px bg-[#D4A373]/40 mb-8"></div>

        {/* Copyright & Credit Section */}
        <div className="flex flex-col items-center gap-3">
            <p className="text-[10px] text-[#8C6A48] uppercase tracking-wider opacity-80">
              © {new Date().getFullYear()} AMINA Clothing Brand. All Rights Reserved.
            </p>

            {/* 🔥 TERA CREDIT (OneLinkStudio) */}
            <p className="text-[10px] text-[#8C6A48]/70 uppercase tracking-[0.15em] font-medium flex items-center gap-1">
             Designed by 
             <a
               href={`https://wa.me/${developerWhatsapp}`}
               target="_blank"
               rel="noopener noreferrer"
               className="font-bold text-[#8C6A48] hover:text-[#D4A373] transition-colors border-b border-[#8C6A48]/20 hover:border-[#D4A373] pb-0.5"
             >
               OneLinkStudio
             </a>
           </p>
        </div>

      </div>
    </footer>
  );
}