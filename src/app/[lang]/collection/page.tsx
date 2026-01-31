import { client } from "@/sanity/lib/client";
import ProductCard from "@/components/product/ProductCard"; 
export const revalidate = 0;

// 1. Translations
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
  // 👇 YAHAN THA MISSING PIECE! 'originalPrice' add kar diya
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    price,
    originalPrice, // 👈 YE RAHA JAADU 🪄
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
    // 👇 THEME: Warm Sand Background (#F4F1EA)
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
          
          {products.map((product: any) => {
            // 👇 LOGIC FIX: Yahan naam ko filter kar rahe hain language ke hisaab se
            let localizedName = product.name;
            
            // Agar naam Object hai (en, fr, ar), toh sahi wala choose karo
            if (product.name && typeof product.name === 'object') {
              localizedName = product.name[lang] || product.name.en || "Unnamed Product";
            }

            // Product object ko update karke naya object banaya jisme naam string hai
            const fixedProduct = { ...product, name: localizedName };

            return (
              <ProductCard 
                key={product._id} 
                product={fixedProduct} // Ab isme sahi naam aur originalPrice dono ja rahe hain
                lang={lang} 
              />
            );
          })}

        </div>
      </div>
      
    </div>
  );
}