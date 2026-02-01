import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import ProductCard from '@/components/product/ProductCard'; 
export const dynamic = "force-dynamic";

// 1. Translations
const content = {
  en: {
    title: "Search Results",
    noResults: "No products found for",
    placeholder: "Try searching for 'Dress', 'Abaya' or 'Summer'",
    back: "Back to Collection",
    count: "Products Found",
    shortQuery: "Please enter at least 2 characters to search."
  },
  fr: {
    title: "Résultats de recherche",
    noResults: "Aucun produit trouvé pour",
    placeholder: "Essayez de chercher 'Robe', 'Abaya' ou 'Été'",
    back: "Retour à la collection",
    count: "Produits Trouvés",
    shortQuery: "Veuillez entrer au moins 2 caractères pour rechercher."
  },
  ar: {
    title: "نتائج البحث",
    noResults: "لم يتم العثور على منتجات لـ",
    placeholder: "جرب البحث عن 'فستان'، 'عباية' أو 'صيف'",
    back: "العودة للمجموعة",
    count: "منتجات تم العثور عليها",
    shortQuery: "الرجاء إدخال حرفين على الأقل للبحث."
  }
};

async function getSearchResults(term: string) {
  if (!term || term.trim().length < 2) return [];


  const query = `*[_type == "product" && (
    name match $q || 
    name.en match $q || 
    name.fr match $q || 
    name.ar match $q ||
    category->name.en match $q
  )] | order(_createdAt desc) {
    _id,
    name,
    price,
    originalPrice,
    slug,
    image,
    category->
  }`;

  
  return await client.fetch(query, { q: `${term}*` });
}

// 3. Main Page Component
export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: { q?: string };
}) {
  const rawTerm = searchParams.q || "";
  const term = rawTerm.trim();
  
  // @ts-ignore
  const t = content[params.lang] || content.en;
  const isArabic = params.lang === 'ar';

  // 🔥 FIX 3: Short Query Handling
  if (term.length < 2) {
     return (
        <div className={`min-h-[60vh] flex flex-col items-center justify-center bg-[#F4F1EA] px-6 text-center ${isArabic ? 'font-arabic' : ''}`}>
           <span className="text-4xl block mb-4">⌨️</span>
           <p className="text-xl text-gray-500 font-serif">{t.shortQuery}</p>
           <Link href={`/${params.lang}/collection`} className="mt-6 border-b border-black text-xs font-bold uppercase tracking-widest">{t.back}</Link>
        </div>
     );
  }

  const products = await getSearchResults(term);

  return (
    <div className={`min-h-screen bg-[#F4F1EA] pt-32 pb-20 px-6 ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>
       
       {/* HEADER SECTION */}
       <div className="max-w-7xl mx-auto mb-16 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
          <h1 className="text-3xl md:text-5xl font-serif text-black mb-6">
            {t.title}: <span className="text-[#D4A373] italic">"{term}"</span>
          </h1>
          
          {products.length > 0 && (
            <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
              {products.length} {t.count}
            </p>
          )}
       </div>

       {/* RESULTS GRID */}
       <div className="max-w-7xl mx-auto">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} lang={params.lang} />
              ))}
            </div>
          ) : (
            // EMPTY STATE
            <div className="text-center py-20 bg-white/40 rounded-2xl border border-[#D4A373]/20">
              <span className="text-4xl block mb-4">🔍</span>
              <p className="text-xl text-gray-600 mb-4 font-serif">
                {t.noResults} <span className="font-bold text-black">"{term}"</span>
              </p>
              <p className="text-sm text-gray-400 mb-10 tracking-widest uppercase">
                {t.placeholder}
              </p>
              <Link 
                href={`/${params.lang}/collection`} 
                className="inline-block border-b border-black pb-1 text-xs font-bold tracking-[0.2em] uppercase hover:text-[#D4A373] hover:border-[#D4A373] transition-all"
              >
                {t.back}
              </Link>
            </div>
          )}
       </div>
    </div>
  );
}