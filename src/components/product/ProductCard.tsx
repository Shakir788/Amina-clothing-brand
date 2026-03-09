import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: string | {
      en: string;
      fr?: string;
      ar?: string;
    };
    price: number | string; 
    originalPrice?: number; 
    slug: {
      current: string;
    };
    image: any;
    category?: any;
    inStock?: boolean; 
  };
  lang?: string;
}

const ProductCard = ({ product, lang = 'en' }: ProductCardProps) => {
  
  // ✨ VIP Translations for Stock Status
  const statusLabels: any = {
    en: { soldOut: "Sold Out", outOfStock: "Out of Stock" },
    fr: { soldOut: "Épuisé", outOfStock: "Rupture de stock" },
    ar: { soldOut: "نفدت الكمية", outOfStock: "نفدت الكمية" }
  };

  const tStatus = statusLabels[lang] || statusLabels.en;

  const getProductName = () => {
    if (!product.name) return "Unnamed Product";
    if (typeof product.name === 'string') return product.name;
    // @ts-ignore
    return product.name[lang] || product.name.en || "Unnamed Product";
  };

  const productName = getProductName();
  
  // Price Parsing
  const currentPrice = Number(product.price);
  const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const isOutOfStock = product.inStock === false;

  const hasDiscount = oldPrice && oldPrice > currentPrice && !isOutOfStock;

  // ✨ Exact Round Figure for Discount
  const discountPercentage = hasDiscount 
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) 
    : 0;

  // Category handling
  const categoryName = product.category?.en || product.category || "Collection";

  return (
    <Link 
      href={`/${lang}/product/${product.slug.current}`} 
      className={`group block ${isOutOfStock ? 'opacity-90' : ''}`} 
    >
      <div className="flex flex-col items-center">
        
        {/* Image Section */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[50%] rounded-b-lg mb-3 bg-[#F5F5F0] border-b-2 border-[#D4A373]/20 shadow-sm">
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10" />

          {/* 🚫 VIP SOLD OUT OVERLAY (Dynamic Language) */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-30 flex items-center justify-center">
              <span className="bg-[#2C2C2C] text-white text-[10px] uppercase tracking-[0.2em] px-4 py-2 font-bold shadow-xl">
                {tStatus.soldOut}
              </span>
            </div>
          )}

          {/* 🏷️ Discount Badge (Sirf tab jab stock ho) */}
          {hasDiscount && (
            <div className="absolute top-4 right-4 z-20 bg-[#8C3A3A] text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-lg border border-[#D4A373]/30">
              -{discountPercentage}%
            </div>
          )}

          {product.image && (
            <Image
              src={urlFor(product.image).url()}
              alt={productName}
              fill
              className={`object-cover transition-transform duration-700 ease-in-out ${isOutOfStock ? 'grayscale-[20%]' : 'group-hover:scale-110'}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
        </div>

        {/* Details Section */}
        <div className="text-center space-y-1 w-full">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#D4A373] transition-colors">
            {categoryName}
          </p>

          <h3 className="font-serif text-base text-black group-hover:text-[#D4A373] transition-colors line-clamp-1 px-2">
            {productName} 
          </h3>

          {/* 💸 Price Section */}
          <div className="flex items-center justify-center gap-2 mt-1">
            {isOutOfStock ? (
              <span className="text-[#8C3A3A] font-bold text-xs uppercase tracking-widest mt-1">
                {tStatus.outOfStock}
              </span>
            ) : hasDiscount ? (
              <>
                <span className="text-gray-400 text-[11px] line-through font-serif">
                  {oldPrice}
                </span>
                <span className="text-[#2C2C2C] font-bold text-sm font-serif">
                  {currentPrice} <span className="text-[10px] text-[#D4A373]">DHS</span>
                </span>
                <span className="text-[#8C3A3A] text-[10px] font-bold ml-1">
                  ({discountPercentage}% OFF)
                </span>
              </>
            ) : (
              <span className="text-[#2C2C2C] font-bold text-sm font-serif">
                {currentPrice} <span className="text-[10px] text-[#D4A373]">DHS</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;