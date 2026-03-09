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
      className={`min-h-screen bg-[#F4F1EA] pb-20 ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >

      {/* HEADER */}
      <div className="pt-24 pb-8 text-center px-4 animate-in fade-in slide-in-from-top-5 duration-700">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-[#2C2C2C] tracking-tight">
          {t.title}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-xs md:text-sm font-light tracking-wide leading-relaxed uppercase">
          {t.subtitle}
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-6">

        {/* 🔘 FILTER BAR (top-left, clean) */}
        <div className="mb-8 flex justify-start">
          <FilterSidebar lang={lang} />
        </div>

        {/* 🛍️ PRODUCT GRID */}
        <ProductGrid products={products} lang={lang} />

      </div>
    </div>
  );
}
