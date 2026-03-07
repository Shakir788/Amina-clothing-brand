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
    collection: "SPRING / SUMMER 2026",
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
    collection: "PRINTEMPS / ÉTÉ 2026",
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
    collection: "ربيع / صيف 2026",
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

  // ✨ IMAGE SLIDER & CLEAN ZOOM STATES ✨
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isModalZoomed, setIsModalZoomed] = useState(false);

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
        if (data?.colors?.length > 0) setSelectedColor(data.colors[0]?.colorHex?.hex || data.colors[0]?.colorHex || "");
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally { setLoading(false); }
    };
    fetchProduct();
  }, [params.slug]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setIsModalZoomed(false); 
  }, [selectedColor]);

  const getColorHex = (col: any) => col.colorHex?.hex || col.colorHex || "";

  const baseProductName = product ? (lang === 'fr' && product.name_fr ? product.name_fr : lang === 'ar' && product.name_ar ? product.name_ar : product.name) : "Unnamed Product";
  const activeColorObject = product?.colors?.find((c: any) => getColorHex(c) === selectedColor);
  const activeColorName = activeColorObject ? (lang === 'fr' && activeColorObject.colorName_fr ? activeColorObject.colorName_fr : lang === 'ar' && activeColorObject.colorName_ar ? activeColorObject.colorName_ar : activeColorObject.colorName) : "";
  const displayProductName = activeColorName ? `${baseProductName} - ${activeColorName}` : baseProductName;

  const displayDescription = activeColorObject ? (lang === 'fr' && activeColorObject.colorDescription_fr ? activeColorObject.colorDescription_fr : lang === 'ar' && activeColorObject.colorDescription_ar ? activeColorObject.colorDescription_ar : activeColorObject.colorDescription) : (product?.description || t.staticDesc);
  const displayImages = activeColorObject?.colorImages?.length > 0 ? activeColorObject.colorImages : product?.image ? [product.image] : [];

  const nextImage = (e?: React.MouseEvent) => { if(e) e.stopPropagation(); setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1)); };
  const prevImage = (e?: React.MouseEvent) => { if(e) e.stopPropagation(); setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1)); };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) nextImage(); 
    if (touchStart - touchEnd < -50) prevImage(); 
  };

  const handleWhatsAppClick = () => {
    if (!product) return;
    const sizeText = selectedSize ? `Size: ${selectedSize}` : "Size: Unspecified";
    const colorText = activeColorName ? `Color: ${activeColorName}` : "Color: Unspecified";
    const message = `Salam AMINA! I am interested in:\n• Item: ${displayProductName}\n• ${sizeText}\n• ${colorText}\n\nIs this available?`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = () => {
    if(product.sizes?.length > 0 && !selectedSize) return alert("Please select a size first / الرجاء اختيار المقاس أولاً");
    addToCart({ id: product._id, name: displayProductName, price: product.price, image: displayImages[0] ? urlFor(displayImages[0]).url() : "", slug: params.slug, size: selectedSize, color: activeColorName || "" });
    toggleCart();
  };

  const toggleAccordion = (section: string) => setOpenSection(openSection === section ? null : section);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F4F1EA]"><div className="animate-pulse text-[#D4A373] font-serif text-xl tracking-widest">{t.loading}</div></div>;
  if (!product) return <div className="h-screen flex items-center justify-center bg-[#F4F1EA] text-gray-500 font-serif">{t.notFound}</div>;

  const categoryValue = product.category?.en || product.category || "Collection 2025";
  const currentPrice = Number(product.price);
  const oldPrice = Number(product.originalPrice);
  const hasDiscount = oldPrice && oldPrice > currentPrice;
  const discountPercentage = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;

  return (
    <>
      <div className={`min-h-screen bg-[#F4F1EA] pt-32 pb-20 px-6 ${isArabic ? 'text-right font-sans' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative items-start">
          
          {/* LEFT: ✨ ELEGANT LUXURY SLIDER ✨ */}
          <div className="flex justify-center w-full lg:sticky lg:top-32">
            <div 
              className="relative w-full max-w-[420px] aspect-[3/4] bg-white rounded-t-[100px] rounded-b-2xl overflow-hidden shadow-[0_20px_50px_rgba(212,163,115,0.15)] border border-[#D4A373]/20 group cursor-zoom-in"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={() => setIsZoomModalOpen(true)} // Click to view details
              title="Click to view full screen"
            >
                {/* Main Current Image (Smooth slow scale on hover) */}
                {displayImages.length > 0 && (
                  <Image
                    src={urlFor(displayImages[currentImageIndex]).url()}
                    alt={`${displayProductName} - View ${currentImageIndex + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                    priority
                  />
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                   <div className="absolute top-6 right-6 z-20 bg-[#8C3A3A] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest pointer-events-none">
                      -{discountPercentage}%
                   </div>
                )}

                {/* Zoom Icon Hint (Subtle) */}
                <div className="absolute top-6 left-6 z-20 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                </div>

                {/* Slider Controls (Arrows & Dots) */}
                {displayImages.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#2C2C2C] shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#2C2C2C] shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-white/40 backdrop-blur-md px-3 py-2 rounded-full" onClick={(e) => e.stopPropagation()}>
                      {displayImages.map((_: any, idx: number) => (
                        <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'bg-[#2C2C2C] w-6' : 'bg-white w-2 hover:bg-[#D4A373]'}`} />
                      ))}
                    </div>
                  </>
                )}
            </div>
          </div>

          {/* RIGHT: Product Details */}
          <div className="flex flex-col justify-center animate-in fade-in slide-in-from-bottom-10 duration-700 h-fit">
            
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-8 bg-[#D4A373]"></span>
              <p className="text-[#D4A373] text-xs tracking-[0.2em] font-bold uppercase">{t.collection}</p>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif text-[#2C2C2C] leading-tight mb-6">
              {displayProductName}
            </h1>

            <div className="flex items-center gap-4 text-2xl md:text-3xl font-light mb-10">
                {hasDiscount ? (
                  <>
                    <span className="text-gray-400 line-through text-xl decoration-[#8C3A3A]/50">{oldPrice}</span>
                    <span className="text-[#2C2C2C] font-medium">{currentPrice} <span className="text-sm text-[#D4A373] font-bold tracking-widest ml-1">DHS</span></span>
                    <span className="ml-2 bg-[#8C3A3A] text-white text-xs font-bold px-2 py-1 rounded-sm">-{discountPercentage}%</span>
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
                      <button key={hex || col.colorName} onClick={() => setSelectedColor(hex)} className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColor === hex ? 'border-[#2C2C2C] scale-110' : 'border-transparent hover:scale-110 shadow-md'}`} style={{ backgroundColor: hex || col.colorName?.toLowerCase() }} title={col.colorName} />
                    );
                  })}
                </div>
                {activeColorName && <p className="text-xs text-gray-400 mt-2 font-medium">{activeColorName}</p>}
              </div>
            )}

            {/* 📏 DYNAMIC SIZE SELECTOR */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{t.selectSize}:</p>
                <div className="flex gap-3 flex-wrap">
                  {product.sizes.map((size: string) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`w-12 h-12 flex items-center justify-center border text-sm font-medium transition-all duration-300 ${selectedSize === size ? 'bg-[#2C2C2C] text-white border-[#2C2C2C]' : 'bg-transparent text-gray-600 border-[#D4A373]/30 hover:border-[#D4A373]'}`}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* 🛒 ACTION BUTTONS */}
            <div className="flex flex-col gap-4 mb-12">
              <button onClick={handleAddToCart} className="w-full bg-[#2C2C2C] text-white py-4 uppercase tracking-[0.2em] hover:bg-[#D4A373] transition-colors duration-300 text-xs font-bold">{t.addToBag}</button>
              <button onClick={handleWhatsAppClick} className="w-full border border-[#25D366] text-[#25D366] py-4 uppercase tracking-[0.2em] hover:bg-[#25D366] hover:text-white transition-colors duration-300 text-xs font-bold flex items-center justify-center gap-2"><span>{t.orderWhatsApp}</span></button>
            </div>

            {/* 📜 ACCORDIONS */}
            <div className="border-t border-[#D4A373]/20">
              <div className="border-b border-[#D4A373]/20">
                <button onClick={() => toggleAccordion('description')} className="w-full py-4 flex justify-between items-center text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-[#D4A373] transition-colors">{t.descTitle}<span>{openSection === 'description' ? '−' : '+'}</span></button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'description' ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}><p className="text-gray-600 font-light leading-relaxed">{displayDescription}</p></div>
              </div>
              <div className="border-b border-[#D4A373]/20">
                <button onClick={() => toggleAccordion('composition')} className="w-full py-4 flex justify-between items-center text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-[#D4A373] transition-colors">{t.compTitle}<span>{openSection === 'composition' ? '−' : '+'}</span></button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'composition' ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}><p className="text-gray-600 font-light leading-relaxed">{t.staticComp}</p></div>
              </div>
              <div className="border-b border-[#D4A373]/20">
                <button onClick={() => toggleAccordion('shipping')} className="w-full py-4 flex justify-between items-center text-sm uppercase tracking-wider font-medium text-gray-800 hover:text-[#D4A373] transition-colors">{t.shipTitle}<span>{openSection === 'shipping' ? '−' : '+'}</span></button>
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === 'shipping' ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}><p className="text-gray-600 font-light leading-relaxed">{t.staticShip}</p></div>
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

      {/* ✨ CLEAN STATIC ZOOM MODAL ✨ */}
      {isZoomModalOpen && (
        <div 
          className={`fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 ${isModalZoomed ? 'overflow-auto items-start justify-start cursor-zoom-out' : 'cursor-zoom-in'}`}
          onClick={() => {
            if (isModalZoomed) setIsModalZoomed(false); 
            else setIsZoomModalOpen(false); 
          }}
        >
          {/* Close Button */}
          <button 
            className="fixed top-6 right-6 z-[110] bg-[#2C2C2C] text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#D4A373] transition-colors shadow-xl"
            onClick={(e) => { e.stopPropagation(); setIsZoomModalOpen(false); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div 
            className={`relative transition-all duration-300 ease-in-out ${isModalZoomed ? 'w-[150%] h-[150%] md:w-[200%] md:h-[200%] flex-shrink-0' : 'w-full h-full max-w-5xl max-h-[90vh]'}`}
            onClick={(e) => { 
              e.stopPropagation(); 
              if (!isModalZoomed) setIsModalZoomed(true); 
            }}
          >
            <Image
              src={urlFor(displayImages[currentImageIndex]).url()}
              alt={`${displayProductName} - Fullscreen`}
              fill
              className="object-contain"
              quality={100} 
            />
          </div>
        </div>
      )}
    </>
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