import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client'; 
import ProductCard from '@/components/product/ProductCard'; 
import HeroWrapper from '@/components/hero/HeroWrapper';

export const revalidate = 0;

const content = {
  en: {
    subtitle: "SPRING / SUMMER 2026",
    title: "Elegance Redefined",
    description: "Discover the silence of luxury. A collection inspired by the golden dunes and the modern spirit.",
    cta: "View Collection",
    storyTitle: "The Essence",
    storyText: "AMINA is not just a brand; it is a state of mind. Born from the earth, designed for the soul. We believe in fashion that whispers.",
    latestArrivals: "Latest Arrivals",
    latestSub: "Newly added to the atelier",
    viewAll: "View All Products"
  },
  fr: {
    subtitle: "PRINTEMPS / ÉTÉ 2026",
    title: "L'Élégance Redéfinie",
    description: "Découvrez le silence du luxe. Une collection inspirée par les dunes dorées et l'esprit moderne.",
    cta: "Voir la Collection",
    storyTitle: "L'Essence",
    storyText: "AMINA n'est pas seulement une marque; c'est un état d'esprit. Né de la terre, conçu pour l'âme. Nous croyons en une mode qui chuchote.",
    latestArrivals: "Derniers Arrivages",
    latestSub: "Nouveautés de l'atelier",
    viewAll: "Voir Tous les Produits"
  },
  ar: {
    subtitle: "ربيع / صيف 2026",
    title: "أناقة بلا حدود",
    description: "اكتشفي صمت الفخامة. تشكيلة مستوحاة من الكثبان الذهبية والروح العصرية.",
    cta: "تصفح المجموعة",
    storyTitle: "الجوهر",
    storyText: "أمينة ليست مجرد علامة تجارية؛ إنها حالة ذهنية. ولدت من الأرض، وصممت للروح. نؤمن بالأزياء التي تهمس بالأناقة.",
    latestArrivals: "أحدث المنتجات",
    latestSub: "وصل حديثًا إلى المرسم",
    viewAll: "عرض كل المنتجات"
  }
};

async function getLatestProducts() {
  const query = `*[_type == "product"] | order(_createdAt desc)[0...8] {
    _id,
    name,
    name_fr,
    name_ar,
    price,
    originalPrice,
    slug,
    image,
    category->
  }`;
  return await client.fetch(query);
}

export default async function HomePage({ params }: { params: { lang: string } }) {
  const products = await getLatestProducts(); 
  
  // @ts-ignore
  const t = content[params.lang] || content.en;
  const isArabic = params.lang === 'ar';

  return (
    <div className={`min-h-screen bg-amina-ivory ${isArabic ? 'font-arabic' : ''}`} dir={isArabic ? 'rtl' : 'ltr'}>

      {/* ================= HERO SECTION — cinematic caftan assembly ================= */}
      <HeroWrapper lang={params.lang} />

      {/* ================= ESSENCE SECTION ================= */}
      <section className="relative py-24 px-6 bg-amina-ivory overflow-hidden">
        <div className="glow-orb w-[260px] h-[260px] bg-amina-rose/15 top-0 right-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative">
          <div className="text-center">
            <span className="text-4xl text-amina-gold block mb-4">❦</span>
            <h2 className="text-3xl md:text-4xl font-serif text-amina-ink mb-4 tracking-tight">
              {t.storyTitle}
            </h2>
            <div className="w-12 h-[1px] bg-amina-gold mx-auto mb-6"></div>
            <p className="text-lg md:text-xl text-amina-stone font-light leading-relaxed max-w-2xl mx-auto italic font-serif">
              {t.storyText}
            </p>
          </div>
        </div>
      </section>

      {/* ================= LATEST ARRIVALS GRID ================= */}
      <section className="py-10 px-4 md:px-8 max-w-[1400px] mx-auto bg-amina-ivory">
        
        <div className="flex items-end justify-between mb-12 px-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif text-amina-ink mb-1">
              {t.latestArrivals}
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-amina-stone">{t.latestSub}</p>
          </div>
          <Link href={`/${params.lang}/collection`} className="hidden md:block text-xs font-bold tracking-widest uppercase text-amina-stone hover:text-amina-gold transition-colors duration-300">
             {t.viewAll} →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-14">
            {products.map((product: any) => {

              let displayName = product.name;

              if (params.lang === 'fr' && product.name_fr) {
                  displayName = product.name_fr; 
              } else if (params.lang === 'ar' && product.name_ar) {
                  displayName = product.name_ar; 
              }

              const fixedProduct = { ...product, name: displayName };

              return (
                <ProductCard key={product._id} product={fixedProduct} lang={params.lang} />
              )
            })}
          </div>
        ) : (
          <p className="text-center text-amina-stone py-20 font-serif italic">Loading luxury pieces...</p>
        )}

        <div className="mt-14 text-center md:hidden">
          <Link 
            href={`/${params.lang}/collection`}
            className="inline-block border-b border-amina-ink pb-1 text-xs font-bold tracking-[0.2em] uppercase hover:text-amina-gold hover:border-amina-gold transition-colors"
          >
            {t.viewAll}
          </Link>
        </div>

      </section>

    </div>
  );
}