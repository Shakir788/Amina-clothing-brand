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

  const currentPrice = Number(product.price);
  const oldPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const isOutOfStock = product.inStock === false;

  const hasDiscount = oldPrice && oldPrice > currentPrice && !isOutOfStock;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
    : 0;

  const categoryName = product.category?.en || product.category || "Collection";

  return (
    <Link
      href={`/${lang}/product/${product.slug.current}`}
      className={`group block tilt-wrap ${isOutOfStock ? 'opacity-90' : ''}`}
    >
      <div className="tilt-card flex flex-col items-center">

        {/* Image Section — 3D tilt + shine sweep on hover */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[50%] rounded-b-lg mb-4 bg-amina-ivory border-b-2 border-amina-gold/25 shadow-luxury-sm group-hover:shadow-luxury transition-shadow duration-500">

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10" />

          {/* Shine sweep — the signature "expensive glass" reveal */}
          <div className="tilt-card-shine z-20" />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-30 flex items-center justify-center">
              <span className="bg-amina-ink text-white text-[10px] uppercase tracking-[0.2em] px-4 py-2 font-bold shadow-xl">
                {tStatus.soldOut}
              </span>
            </div>
          )}

          {hasDiscount && (
            <div className="absolute top-4 right-4 z-20 bg-amina-roseDeep text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-glow-rose border border-white/30">
              -{discountPercentage}%
            </div>
          )}

          {product.image && (
            <Image
              src={urlFor(product.image).url()}
              alt={productName}
              fill
              className={`object-cover transition-transform duration-700 ease-luxury ${isOutOfStock ? 'grayscale-[20%]' : 'group-hover:scale-[1.08]'}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
        </div>

        {/* Details Section */}
        <div className="text-center space-y-1.5 w-full">
          <p className="text-[10px] uppercase tracking-[0.22em] text-amina-stone group-hover:text-amina-gold transition-colors duration-300">
            {categoryName}
          </p>

          <h3 className="font-serif text-base text-amina-ink group-hover:text-amina-gold transition-colors duration-300 line-clamp-1 px-2">
            {productName}
          </h3>

          <div className="flex items-center justify-center gap-2 mt-1">
            {isOutOfStock ? (
              <span className="text-amina-roseDeep font-bold text-xs uppercase tracking-widest mt-1">
                {tStatus.outOfStock}
              </span>
            ) : hasDiscount ? (
              <>
                <span className="text-amina-stone text-[11px] line-through font-serif">
                  {oldPrice}
                </span>
                <span className="text-amina-ink font-bold text-sm font-serif">
                  {currentPrice} <span className="text-[10px] text-amina-gold">DHS</span>
                </span>
                <span className="text-amina-roseDeep text-[10px] font-bold ml-1">
                  ({discountPercentage}% OFF)
                </span>
              </>
            ) : (
              <span className="text-amina-ink font-bold text-sm font-serif">
                {currentPrice} <span className="text-[10px] text-amina-gold">DHS</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;