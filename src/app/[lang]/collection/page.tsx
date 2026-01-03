import { getProducts } from "@/lib/getProducts";
import ProductCard from "@/components/product/ProductCard";

export default async function CollectionPage({ params }: { params: { lang: string } }) {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-amina-sand">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        
        {/* Header Section */}
        <div className="mb-20 text-center max-w-2xl mx-auto">
          <span className="text-xs md:text-sm text-amina-clay uppercase tracking-[0.2em] font-medium mb-4 block">
            Spring / Summer 2025
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-amina-black mb-6 tracking-wide">
            The Collection
          </h1>
          <p className="text-amina-stone font-light text-sm md:text-base leading-relaxed">
            Curated pieces inspired by the timeless elegance of the desert. 
            Designed for the modern muse.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} lang={params.lang} />
          ))}
        </div>
      </div>
    </div>
  );
}