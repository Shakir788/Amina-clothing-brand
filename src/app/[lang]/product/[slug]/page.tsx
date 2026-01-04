import { getProductBySlug, getProducts } from "@/lib/getProducts"; // getProducts add kiya
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Link add kiya navigation ke liye
import AddToCartButton from "@/components/product/AddToCartButton";

export default async function ProductPage({ params }: { params: { slug: string; lang: string } }) {
  // 1. Current Product Fetch karo
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // 2. Baaki Products Fetch karo (Recommendation ke liye)
  const allProducts = await getProducts();
  
  // 3. Current product ko list se hatao aur bas 3 dikhao
  const relatedProducts = allProducts
    .filter((p: any) => p.slug !== params.slug)
    .slice(0, 3);

  // @ts-ignore
  const name = product.name[params.lang] || product.name.en;
  // @ts-ignore
  const category = product.category[params.lang] || product.category.en;
  const isArabic = params.lang === 'ar';

  return (
    <div className="min-h-screen bg-amina-sand">
      {/* --- MAIN PRODUCT SECTION --- */}
      <div className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* LEFT: Image with Moroccan Arch */}
            <div className="relative aspect-[3/4] w-full bg-amina-white rounded-t-[15rem] rounded-b-2xl overflow-hidden shadow-xl border border-amina-border">
               <Image
                 src={product.image}
                 alt={name}
                 fill
                 className="object-cover"
               />
            </div>

            {/* RIGHT: Product Details */}
            <div className={`flex flex-col justify-center ${isArabic ? 'text-right' : 'text-left'}`}>
              
              <span className="text-xs font-bold tracking-[0.2em] text-amina-clay uppercase mb-4">
                {category}
              </span>
              
              <h1 className={`text-4xl md:text-5xl text-amina-black mb-6 ${isArabic ? 'font-arabic font-bold leading-normal' : 'font-serif'}`}>
                {name}
              </h1>
              
              <p className="text-2xl font-medium text-amina-stone mb-8 pb-8 border-b border-amina-border inline-block w-full">
                {product.price}
              </p>

              <div className={`prose prose-sm text-amina-stone mb-10 leading-loose ${isArabic ? 'font-arabic text-lg' : ''}`}>
                <p>
                  {isArabic 
                    ? "قطعة فريدة مصممة للمرأة العصرية، تجمع بين الأناقة والراحة."
                    : "Meticulously crafted for the modern wardrobe. This piece embodies elegance and comfort, designed to be worn with confidence."
                  }
                </p>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={product} lang={params.lang} isArabic={isArabic} />
              
              <p className="text-[10px] text-amina-clay mt-6 uppercase tracking-wide opacity-80">
                * Direct concierge service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- YOU MAY ALSO LIKE SECTION (NEW) --- */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-amina-border/50 py-20 bg-white/40">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Section Title */}
            <h2 className={`text-3xl text-amina-black mb-12 text-center ${isArabic ? 'font-arabic font-bold' : 'font-serif'}`}>
              {isArabic ? "قد يعجبك أيضاً" : "You May Also Like"}
            </h2>

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {relatedProducts.map((item: any) => {
                // Handle translation for related items
                const itemName = item.name[params.lang] || item.name.en;
                const itemCategory = item.category[params.lang] || item.category.en;

                return (
                  <Link 
                    key={item._id} 
                    href={`/${params.lang}/product/${item.slug}`}
                    className="group cursor-pointer"
                  >
                    {/* Card Image */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[8rem] rounded-b-lg bg-gray-100 mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <Image
                        src={item.image}
                        alt={itemName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    {/* Card Text */}
                    <div className={`space-y-1 ${isArabic ? 'text-right' : 'text-center'}`}>
                      <p className="text-[10px] uppercase tracking-widest text-amina-clay">
                        {itemCategory}
                      </p>
                      <h3 className={`text-lg text-amina-black group-hover:text-amina-clay transition-colors ${isArabic ? 'font-arabic' : 'font-serif'}`}>
                        {itemName}
                      </h3>
                      <p className="text-sm font-medium text-amina-stone">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}