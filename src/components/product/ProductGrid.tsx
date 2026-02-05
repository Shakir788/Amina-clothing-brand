import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  lang: string;
}

const ProductGrid = ({ products, lang }: ProductGridProps) => {
  
  // 1. Agar products nahi hain toh "Empty Message" dikhao
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 w-full">
        <p className="text-gray-400 font-serif text-lg tracking-widest opacity-60">
          {lang === 'ar' ? 'لا توجد منتجات حالياً' : 
           lang === 'fr' ? 'Aucun produit trouvé' : 
           'No luxury pieces found.'}
        </p>
      </div>
    );
  }

  return (
    // 2. Grid Layout (Mobile: 2 cols, Tablet: 3 cols, PC: 4 cols)
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
      
      {products.map((product) => {
         // 👇 MAGIC LOGIC: Grid khud decide karega konsa naam dikhana hai
         let displayName = product.name; // Default English

         if (lang === 'fr' && product.name_fr) {
             displayName = product.name_fr; // French Check
         } else if (lang === 'ar' && product.name_ar) {
             displayName = product.name_ar; // Arabic Check
         }

         // Product object ko update karke Card ko bhejo
         const fixedProduct = { ...product, name: displayName };

         return (
           <ProductCard 
             key={product._id} 
             product={fixedProduct} 
             lang={lang} 
           />
         );
      })}
    </div>
  );
};

export default ProductGrid;