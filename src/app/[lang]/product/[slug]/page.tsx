import { getProductBySlug } from "@/lib/getProducts";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/product/AddToCartButton"; // Import new button

export default async function ProductPage({ params }: { params: { slug: string; lang: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // @ts-ignore
  const name = product.name[params.lang] || product.name.en;
  // @ts-ignore
  const category = product.category[params.lang] || product.category.en;
  const isArabic = params.lang === 'ar';

  return (
    <div className="min-h-screen bg-amina-sand py-20 md:py-32">
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

            {/* 👇 New Add to Cart Button */}
            <AddToCartButton product={product} lang={params.lang} isArabic={isArabic} />
            
            <p className="text-[10px] text-amina-clay mt-6 uppercase tracking-wide opacity-80">
              * Direct concierge service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}