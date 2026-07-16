import { client } from "@/sanity/lib/client";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/product/FilterSidebar"; 

export const revalidate = 0;

const translations = {
  en: { title: "The Collection", subtitle: "Curated pieces inspired by the fluid grace of modern Moroccan elegance." },
  fr: { title: "La Collection", subtitle: "Des pièces sélectionnées avec soin, inspirées par la grâce fluide de l'élégance marocaine moderne." },
  ar: { title: "المجموعة", subtitle: "قطع مختارة بعناية مستوحاة من الأناقة الانسيابية للجمال المغربي العصري." }
};

async function getProducts(category?: string, sort?: string) {
  let query = `*[_type == "product"`;
  if (category && category !== "Collection 2026") {
    query += ` && category == "${category}"`;
  }
  query += `]`;

  if (sort === "price_asc") query += ` | order(price asc)`;
  else if (sort === "price_desc") query += ` | order(price desc)`;
  else query += ` | order(_createdAt desc)`;
  
  query += `{ _id, name, name_fr, name_ar, price, originalPrice, slug, image, category, inStock }`;
  
  return await client.fetch(query);
}

export default async function CollectionPage({ params, searchParams }: any) {
  const categoryFilter = searchParams.category;
  const sortOption = searchParams.sort;
  const products = await getProducts(categoryFilter, sortOption);
  
  const lang = params.lang || "en";
  // @ts-ignore
  const t = translations[lang] || translations.en;
  const isArabic = lang === "ar";

  return (
    <div
      className={`min-h-screen bg-amina-ivory pb-20 ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >

      {/* HEADER — soft glow behind the title, shimmer heading to match the homepage */}
      <div className="relative pt-32 pb-10 text-center px-4 animate-fade-up overflow-hidden">
        <div className="glow-orb w-[300px] h-[300px] bg-amina-rose/15 -top-24 left-1/2 -translate-x-1/2 pointer-events-none" />
        <span className="relative text-3xl text-amina-gold block mb-3">❦</span>
        <h1 className="relative text-4xl md:text-5xl font-serif font-bold mb-3 tracking-tight text-shimmer animate-shimmer">
          {t.title}
        </h1>
        <div className="relative w-12 h-[1px] bg-amina-gold mx-auto mb-5"></div>
        <p className="relative text-amina-stone max-w-2xl mx-auto text-xs md:text-sm font-light tracking-wide leading-relaxed uppercase">
          {t.subtitle}
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6">

        {/* 🔘 FILTER BAR — glass pill wrapper for consistency with the nav */}
        <div className="mb-10 flex justify-start">
          <div className="glass-pill rounded-full px-1.5 py-1.5 shadow-luxury-sm border border-amina-border/60">
            <FilterSidebar lang={lang} />
          </div>
        </div>

        {/* 🛍️ PRODUCT GRID — cards already carry the 3D tilt + shine from ProductCard */}
        <ProductGrid products={products} lang={lang} />

      </div>
    </div>
  );
}