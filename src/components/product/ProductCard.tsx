import Link from 'next/link';
import Image from 'next/image';

// Type define kar rahe hain ki ab name string nahi, object hai
interface Product {
  id: string;
  name: { en: string; fr: string; ar: string };
  price: string;
  image: string;
  category: { en: string; fr: string; ar: string };
  slug: string;
}

interface ProductCardProps {
  product: Product;
  lang: string;
}

export default function ProductCard({ product, lang }: ProductCardProps) {
  // Simple logic to pick name based on lang
  // @ts-ignore (Temporary ignore for quick prototyping)
  const name = product.name[lang] || product.name.en;
  // @ts-ignore
  const category = product.category[lang] || product.category.en;

  const isArabic = lang === 'ar';

  return (
    <Link href={`/${lang}/product/${product.slug}`} className="group block">
      
      {/* DESIGN MAGIC: 'rounded-t-[50%]' makes it look like a Moroccan Arch 
         bg-white card with padding creates a frame.
      */}
      <div className="bg-amina-white p-3 pb-6 rounded-t-[10rem] rounded-b-lg shadow-sm hover:shadow-xl transition-all duration-500 ease-out border border-amina-border/50">
        
        {/* Arch Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[9rem] rounded-b-md bg-amina-sand mb-6">
          <Image
            src={product.image}
            alt={name}
            fill
            className="object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className={`text-center space-y-2 px-2 ${isArabic ? 'font-arabic' : ''}`}>
          <h3 className={`text-lg text-amina-black tracking-wide group-hover:text-amina-terracotta transition-colors duration-300 ${isArabic ? 'font-bold text-xl' : 'font-serif'}`}>
            {name}
          </h3>
          <p className="text-xs text-amina-clay uppercase tracking-widest">
            {category}
          </p>
          <p className="text-sm font-medium text-amina-stone pt-1 font-sans">
            {product.price}
          </p>
        </div>

      </div>
    </Link>
  );
}