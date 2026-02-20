"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { useCart } from "@/context/CartContext";
import { urlFor } from "@/sanity/lib/image";
import ProductCard from "@/components/product/ProductCard";

// 🌍 Translations
const translations = {
  en: {
    collection: "SPRING / SUMMER 2025",
    addToBag: "ADD TO SHOPPING BAG",
    orderWhatsApp: "ORDER VIA WHATSAPP",
    selectSize: "Select Size",
    selectColor: "Select Color",
    loading: "Retrieving Luxury Piece...",
    notFound: "Piece not found",
    relatedTitle: "You May Also Like",
    descTitle: "Description",
    compTitle: "Composition & Care",
    shipTitle: "Shipping & Returns",
    staticDesc: "Meticulously crafted for the modern wardrobe. This piece embodies elegance and comfort.",
    staticComp: "100% Premium Cotton / Wool Blend. Dry clean recommended to maintain texture.",
    staticShip: "Complimentary delivery in Casablanca. Returns accepted within 7 days of purchase."
  },
  fr: {
    collection: "PRINTEMPS / ÉTÉ 2025",
    addToBag: "AJOUTER AU PANIER",
    orderWhatsApp: "COMMANDER VIA WHATSAPP",
    selectSize: "Choisir la Taille",
    selectColor: "Choisir la Couleur",
    loading: "Chargement de la pièce...",
    notFound: "Pièce introuvable",
    relatedTitle: "Vous Aimerez Aussi",
    descTitle: "Description",
    compTitle: "Composition & Entretien",
    shipTitle: "Livraison & Retours",
    staticDesc: "Méticuleusement conçu pour la garde-robe moderne. Cette pièce incarne l'élégance.",
    staticComp: "Mélange 100% Coton Premium / Laine. Nettoyage à sec recommandé.",
    staticShip: "Livraison offerte à Casablanca. Retours acceptés sous 7 jours."
  },
  ar: {
    collection: "ربيع / صيف 2025",
    addToBag: "أضف إلى حقيبة التسوق",
    orderWhatsApp: "اطلب عبر الواتساب",
    selectSize: "اختر المقاس",
    selectColor: "اختر اللون",
    loading: "جارٍ تحميل القطعة...",
    notFound: "القطعة غير موجودة",
    relatedTitle: "قد يعجبك أيضًا",
    descTitle: "الوصف",
    compTitle: "الخامة والعناية",
    shipTitle: "الشحن والإرجاع",
    staticDesc: "مصممة بعناية لخزانة الملابس العصرية. تجسد هذه القطعة الأناقة والراحة.",
    staticComp: "خليط قطن وصوف فاخر 100%. ينصح بالتنظيف الجاف للحفاظ على الجودة.",
    staticShip: "توصيل مجاني في الدار البيضاء. يقبل الإرجاع خلال 7 أيام."
  }
};

export default function ProductPage({ params }: { params: { slug: string, lang: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(""); 
  const [openSection, setOpenSection] = useState<string | null>("description");

  const { addToCart, toggleCart } = useCart();
  const lang = params.lang || 'en';
  // @ts-ignore
  const t = translations[lang] || translations.en;
  const isArabic = lang === 'ar';

  const WHATSAPP_NUMBER = "212613008064"; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const query = `*[_type == "product" && slug.current == "${params.slug}"][0]{
          ...,
          sizes,
          colors,
          originalPrice
        }`;
        const data = await client.fetch(query);
        setProduct(data);
        
        // Auto-select first color
        if (data?.colors?.length > 0) {
          setSelectedColor(data.colors[0]?.colorHex?.hex || data.colors[0]?.colorHex || "");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  const getColorHex = (col: any) => col.colorHex?.hex || col.colorHex || "";

  // 1. BASE PRODUCT NAME (Language ke hisab se)
  const getBaseProductName = () => {
    if (!product) return "Unnamed Product";
    if (lang === 'fr' && product.name_fr) return product.name_fr;
    if (lang === 'ar' && product.name_ar) return product.name_ar;
    return product.name || "Unnamed Product";
  };
  const baseProductName = getBaseProductName();

  // ✨ ACTIVE COLOR OBJECT DHOONDHO
  const activeColorObject = product?.colors?.find((c: any) => getColorHex(c) === selectedColor);

  // ✨ 2. DYNAMIC COLOR NAME (Language ke hisab se)
  const getLocalizedColorName = () => {
    if (!activeColorObject) return "";
    if (lang === 'fr' && activeColorObject.colorName_fr) return activeColorObject.colorName_fr;
    if (lang === 'ar' && activeColorObject.colorName_ar) return activeColorObject.colorName_ar;
    return activeColorObject.colorName || "";
  };
  const activeColorName = getLocalizedColorName();

  // ✨ 3. FINAL PRODUCT NAME (E.g., "Elegant Abaya - Royal Blue")
  const displayProductName = activeColorName 
    ? `${baseProductName} - ${activeColorName}` 
    : baseProductName;

  // ✨ 4. DYNAMIC DESCRIPTION
  const getLocalizedDescription = () => {
    if (activeColorObject) {
      if (lang === 'fr' && activeColorObject.colorDescription_fr) return activeColorObject.colorDescription_fr;
      if (lang === 'ar' && activeColorObject.colorDescription_ar) return activeColorObject.colorDescription_ar;
      if (activeColorObject.colorDescription) return activeColorObject.colorDescription;
    }
    return product?.description || t.staticDesc;
  };
  const displayDescription = getLocalizedDescription();

  // ✨ 5. DYNAMIC IMAGES (Ab ek array ban gaya hai!)
  const displayImages = activeColorObject?.colorImages?.length > 0 
    ? activeColorObject.colorImages 
    : product?.image ? [product.image] : [];


  const handleWhatsAppClick = () => {
    if (!product) return;
    
    const sizeText = selectedSize ? `Size: ${selectedSize}` : "Size: Unspecified";
    const colorText = activeColorName ? `Color: ${activeColorName}` : "Color: Unspecified";

    const message = `Salam AMINA! I am interested in:
• Item: ${displayProductName}
• ${sizeText}
• ${colorText}

Is this available?`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if(product.sizes?.length > 0 && !selectedSize) {
      alert("Please select a size first / الرجاء اختيار المقاس أولاً");
      return;
    }
    
    addToCart({
      id: product._id,
      name: displayProductName, // Cart mein bhi full name jayega!
      price: product.price,
      image: displayImages[0] ? urlFor(displayImages[0]).url() : "", // Cart mein select ki hui pehli photo jayega
      slug: params.slug,
      size: selectedSize, 
      color: activeColorName || ""
    });
    toggleCart();
  };

  const toggleAccordion = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F4F1EA]">
      <div className="animate-pulse text-[#D4A373] font-serif text-xl tracking-widest">{t.loading}</div>
    </div>
  );
  
  if (!product) return (
    <div className="h-screen flex items-center justify-center bg-[#F4F1EA] text-gray-500 font-serif">
      {t.notFound}
    </div>
  );

  const categoryValue = product.category?.en || product.category || "Collection 2025";
  const currentPrice = Number(product.price);
  const oldPrice = Number(product.originalPrice);
  const hasDiscount = oldPrice && oldPrice > currentPrice;
  const discountPercentage = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  return (
    <div className={`min-h-screen bg-[#F4F1EA] pt-32 pb-20 px-6 ${isArabic ? 'text-right font-sans' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 relative">
        
        {/* LEFT: Image Section (Ab yahan multiple photos dikhengi) */}
        <div className="flex flex-col gap-8">
            {displayImages.map((img: any, idx: number) => (
              <div key={img._key || idx} className="relative aspect-[3/4] w-full bg-white rounded-t-[100px] rounded-b-2xl overflow-hidden shadow-[0_20px_50px_rgba(212,163,115,0.15)] border border-[#D4A373]/20">
                <Image
                  src={urlFor(img).url()}
                  alt={`${displayProductName} - View ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-1000"
                  priority={idx === 0}
                />
                {idx === 0 && hasDiscount && (
                   <div className="absolute top-6 right-6 z-20 bg-[#8C3A3A] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                      -{discountPercentage}%
                   </div>
                )}
              </div>
            ))}
        </div>

        {/* RIGHT: Product Details (Ye ab STICKY hai, yani screen par ruka rahega jab photo scroll hongi) */}
        <div className="flex flex-col justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 lg:sticky lg:top-32 h-fit">
          
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-8 bg-[#D4A373]"></span>
            <p className="text-[#D4A373] text-xs tracking-[0.2em] font-bold uppercase">
              {t.collection}
            </p>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C2C2C] leading-none mb-6">
            {displayProductName} {/* ✨ Yahan naam change hoga */}
          </h1>

          <div className="flex items-center gap-4 text-2xl md:text-3xl font-light mb-10">
              {hasDiscount ? (
                <>
                  <span className="text-gray-400 line-through text-xl decoration-[#8C3A3A]/50">{oldPrice}</span>
                  <span className="text-[#2C2C2C] font-medium">{currentPrice} <span className="text-sm text-[#D4A373] font-bold tracking-widest ml-1">DHS</span></span>
                  <span className="ml-2 bg-[#8C3A3A] text-white text-xs font-bold px-2 py-1 rounded-sm">
                    -{discountPercentage}%
                  </span>
                </>
              ) : (
                 <span className="text-gray-800">{currentPrice} <span className="text-sm text-[#D4A373] font-bold tracking-widest ml-1">DHS</span></span>
              )}
          </div>

          {/* 🎨 DYNAMIC COLOR SELECTOR */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t.selectColor}:</p>
              <div className="flex gap-4">
                {product.colors.map((col: any) => {
                  const hex = getColorHex(col);
                  return (
                    <button
                      key={hex || col.colorName}
                      onClick={() => setSelectedColor(hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColor === hex ? 'border-[#2C2C2C] scale-110' : 'border-transparent hover:scale-110 shadow-md'}`}
                      style={{ backgroundColor: hex || col.colorName?.toLowerCase() }}
                      title={col.colorName}
                    />
                  );
                })}
              </div>
              {activeColorName && (
                <p className="text-xs text-gray-400 mt-2 font-medium">
                  {activeColorName}
                </p>
              )}
            </div>
          )}

          {/* 📏 DYNAMIC SIZE SELECTOR */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-10">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t.selectSize}:</p>
              <div className="flex gap-3">
                {product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center border text-sm font-medium transition-all duration-300 
                      ${selectedSize === size 
                        ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' 
                        : 'bg-transparent text-gray-600 border-[#D4A373]/30 hover:border-[#D4A373]'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 🛒 ACTION BUTTONS */}
          <div className="flex flex-col gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#2C2C2C] text-white py-4 uppercase tracking-[0.2em] hover:bg-[#D4A373] transition-colors duration-300 text-xs font-bold"
            >
              {t.addToBag}
            </button>
            <button
              onClick={handleWhatsAppClick}
              className="w-full border border-[#25D366] text-[#25D366] py-4 uppercase tracking-[0.2em] hover:bg-[#25D366] hover:text-white transition-colors duration-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <span>{t.orderWhatsApp}</span>
            </button>
          </div>

          {/* 📜 ACCORDIONS */}
          <div className="border-t border-[#D4A373]/20">
            <div className="border-b border-[#D4A373]/20">
              <button onClick={() => toggleAccordion('description')} className="w-full py-4 flex justify-between items-center text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-[#D4A373] transition-colors">
                {t.descTitle}
                <span>{openSection === 'description' ? '−' : '+'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'description' ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                {/* ✨ Yahan dynamic description aayega */}
                <p className="text-gray-600 font-light leading-relaxed">{displayDescription}</p> 
              </div>
            </div>

            <div className="border-b border-[#D4A373]/20">
              <button onClick={() => toggleAccordion('composition')} className="w-full py-4 flex justify-between items-center text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-[#D4A373] transition-colors">
                {t.compTitle}
                <span>{openSection === 'composition' ? '−' : '+'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'composition' ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 font-light leading-relaxed">{t.staticComp}</p>
              </div>
            </div>

            <div className="border-b border-[#D4A373]/20">
              <button onClick={() => toggleAccordion('shipping')} className="w-full py-4 flex justify-between items-center text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-[#D4A373] transition-colors">
                {t.shipTitle}
                <span>{openSection === 'shipping' ? '−' : '+'}</span>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'shipping' ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 font-light leading-relaxed">{t.staticShip}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <div className="max-w-7xl mx-auto mt-32 border-t border-[#D4A373]/20 pt-16">
         <h2 className="text-3xl font-serif text-center mb-12 text-[#2C2C2C]">{t.relatedTitle}</h2>
         <RelatedProducts currentSlug={params.slug} category={categoryValue} lang={lang} />
      </div>
    </div>
  );
}

function RelatedProducts({ currentSlug, category, lang }: { currentSlug: string, category: string, lang: string }) {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchRelated = async () => {
      const query = `*[_type == "product" && slug.current != "${currentSlug}"][0...4]{
        _id, name, name_fr, name_ar, slug, price, originalPrice, image, category
      }`;
      const data = await client.fetch(query);
      setProducts(data);
    };
    fetchRelated();
  }, [currentSlug, category]);

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {products.map((p) => {
        let localizedName = p.name;
        if (lang === 'fr' && p.name_fr) localizedName = p.name_fr;
        else if (lang === 'ar' && p.name_ar) localizedName = p.name_ar;

        const fixedProduct = { ...p, name: localizedName };

        return <ProductCard key={p._id} product={fixedProduct} lang={lang} />;
      })}
    </div>
  );
}