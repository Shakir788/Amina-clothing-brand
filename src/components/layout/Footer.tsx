
"use client";

import Link from 'next/link';
import { Instagram, Facebook, MessageCircle, Mail, ArrowRight } from 'lucide-react';

const content: Record<string, any> = {
  en: {
    tagline: "Join our world of timeless elegance.",
    emailPlaceholder: "Your email address",
    subscribe: "Subscribe",
    collection: "Collection",
    story: "Brand Story",
    faq: "FAQ / Help",
    care: "Customer Care",
    rights: "All Rights Reserved.",
    designedBy: "Designed by",
  },
  fr: {
    tagline: "Rejoignez notre univers d'élégance intemporelle.",
    emailPlaceholder: "Votre adresse e-mail",
    subscribe: "S'inscrire",
    collection: "Collection",
    story: "Notre Histoire",
    faq: "FAQ / Aide",
    care: "Service Client",
    rights: "Tous droits réservés.",
    designedBy: "Conçu par",
  },
  ar: {
    tagline: "انضمي إلى عالمنا من الأناقة الخالدة.",
    emailPlaceholder: "بريدك الإلكتروني",
    subscribe: "اشتراك",
    collection: "المجموعة",
    story: "قصة العلامة",
    faq: "الأسئلة الشائعة",
    care: "خدمة العملاء",
    rights: "جميع الحقوق محفوظة.",
    designedBy: "تصميم",
  }
};

export default function Footer({ lang }: { lang: string }) {
  const t = content[lang] ?? content.en;
  const isRTL = lang === 'ar';

  const socialLinks = {
    instagram: "https://www.instagram.com/aminaclothingbrand/",
    facebook: "https://www.facebook.com/profile.php?id=61587300055925",
    whatsapp: "https://wa.me/212723908603",
    email: "mailto:aminaclothingbrand@gmail.com"
  };

  const developerWhatsapp = "919520292346";

  const socialItems = [
    { icon: Instagram, href: socialLinks.instagram, label: "Instagram" },
    { icon: Facebook, href: socialLinks.facebook, label: "Facebook" },
    { icon: MessageCircle, href: socialLinks.whatsapp, label: "WhatsApp" },
    { icon: Mail, href: socialLinks.email, label: "Email" },
  ];

  return (
    <footer
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-amina-sand border-t border-amina-gold/20 pt-20 pb-10 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">

        {/* Logo */}
        <h2 className="text-3xl font-serif tracking-[0.2em] mb-4 text-amina-ink">
          AMINA
        </h2>

        {/* Tagline */}
        <p className="text-amina-stone text-sm mb-8 max-w-xs">
          {t.tagline}
        </p>

        {/* Newsletter */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-sm flex items-center border-b border-amina-stone/30 focus-within:border-amina-gold transition-colors duration-300 mb-14"
        >
          <input
            type="email"
            required
            placeholder={t.emailPlaceholder}
            className="flex-1 bg-transparent py-3 text-sm text-amina-ink placeholder:text-amina-stone/60 outline-none"
          />
          <button
            type="submit"
            aria-label={t.subscribe}
            className="text-amina-gold hover:translate-x-1 transition-transform duration-300 px-2"
          >
            <ArrowRight size={18} strokeWidth={1.5} />
          </button>
        </form>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-10 text-xs uppercase tracking-[0.2em] font-medium text-amina-stone">
          <Link href={`/${lang}/collection`} className="hover:text-amina-gold transition-colors duration-300">
            {t.collection}
          </Link>
          <Link href={`/${lang}/about`} className="hover:text-amina-gold transition-colors duration-300">
            {t.story}
          </Link>
          <Link href={`/${lang}/faq`} className="hover:text-amina-gold transition-colors duration-300">
            {t.faq}
          </Link>
          <Link href={`/${lang}/contact`} className="hover:text-amina-gold transition-colors duration-300">
            {t.care}
          </Link>
        </nav>

        {/* Social Icons */}
        <div className="flex gap-4 mb-10">
          {socialItems.map((item) => {
            const Icon = item.icon;
            return (
              <a /* 👈 YAHAN FIX KIYA HAI - Missing '<a' tag added */
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="w-10 h-10 flex items-center justify-center rounded-full border border-amina-stone/25 text-amina-stone hover:text-amina-gold hover:border-amina-gold hover:-translate-y-1 transition-all duration-300"
              >
                <Icon size={17} strokeWidth={1.5} />
              </a>
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-12 h-px bg-amina-gold/40 mb-8" />

        {/* Copyright & Credit */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] text-amina-stone uppercase tracking-wider">
            © {new Date().getFullYear()} AMINA Clothing Brand. {t.rights}
          </p>

          <p className="text-[10px] text-amina-stone/70 uppercase tracking-[0.15em] font-medium flex items-center gap-1.5">
            {t.designedBy}
            <a /* 👈 YAHAN BHI FIX KIYA HAI - Missing '<a' tag added */
              href={`https://wa.me/${developerWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-amina-clay hover:text-amina-gold transition-colors border-b border-amina-clay/30 hover:border-amina-gold pb-0.5"
            >
              OneLinkStudio
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}