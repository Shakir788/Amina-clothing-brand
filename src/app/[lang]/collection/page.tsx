import { client } from "@/sanity/lib/client";
import ProductGrid from "@/components/product/ProductGrid"; // 👈 Ab hum seedha Grid use karenge
export const revalidate = 0;

// 1. Translations (UI Texts)
const translations = {
  en: {
    title: "The Collection",
    subtitle: "Curated pieces inspired by the fluid grace of modern Moroccan elegance.",
  },
  fr: {
    title: "La Collection",
    subtitle: "Des pièces sélectionnées avec soin, inspirées par la grâce fluide de l'élégance marocaine moderne.",
  },
  ar: {
    title: "المجموعة",
    subtitle: "قطع مختارة بعناية مستوحاة من الأناقة الانسيابية للجمال المغربي العصري.",
  }
};

// 2. Data Fetching
async function getProducts() {
  // Query same rahegi, kyunki Grid ko saare naam chahiye (en, fr, ar) logic lagane ke liye
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,       // English Name
    name_fr,    // French Name
    name_ar,    // Arabic Name
    price,
    originalPrice,
    slug,
    image,      
    category->{title}
  }`;
  return await client.fetch(query);
}

export default async function CollectionPage({ params }: { params: { lang: string } }) {
  const products = await getProducts();
  const lang = params.lang || 'en';
  
  // @ts-ignore
  const t = translations[lang] || translations.en;
  const isArabic = lang === 'ar';

  return (
    <div className={`min-h-screen bg-[#F4F1EA] pb-20 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
      
      {/* HEADER SECTION (Gold & Royal) */}
      <div className="pt-40 pb-20 text-center px-4 animate-in fade-in slide-in-from-top-10 duration-700">
        
        {/* Crown Icon */}
        <div className="flex justify-center mb-4">
           <span className="text-3xl text-[#D4A373]">❦</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-[#2C2C2C] tracking-tight">
          {t.title} 
        </h1>

        {/* Gold Divider */}
        <div className="w-20 h-[2px] bg-[#D4A373]/40 mx-auto mb-8"></div>

        <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg font-light tracking-wide leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* PRODUCTS GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {/* 👇 Dekh kitna clean ho gaya! Saara logic ab ProductGrid component ke andar hai */}
        <ProductGrid products={products} lang={lang} />
      </div>
      
    </div>
  );
}