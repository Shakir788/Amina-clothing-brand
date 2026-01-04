// ✅ Import paths corrected (Ye "lib" folder ke andar hote hain)
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export interface Product {
  id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  slug: string;
  price: string;
  image: string;
  category: {
    en: string;
    fr: string;
    ar: string;
  };
}

// 1. Fetch ALL Products (Recommendations ke liye)
export async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    name_ar,
    name_fr,
    slug,
    price,
    image,
    category
  }`;

  const products = await client.fetch(query);

  return products.map((p: any) => ({
    id: p._id,
    name: {
      en: p.name,
      // Fallback: Agar FR/AR nahi hai, to English use karega
      fr: p.name_fr || p.name, 
      ar: p.name_ar || p.name
    },
    slug: p.slug.current,
    price: p.price,
    // ✅ Safety Check: Agar image nahi hai to empty string (Crash nahi hoga)
    image: p.image ? urlFor(p.image).url() : "",
    category: {
      en: p.category,
      fr: p.category, // Abhi ke liye same rakh rahe hain
      ar: p.category
    }
  }));
}

// 2. Fetch SINGLE Product (Product Page ke liye)
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    name_ar,
    name_fr,
    slug,
    price,
    image,
    category
  }`;

  const p = await client.fetch(query, { slug });

  if (!p) return null;

  return {
    id: p._id,
    name: {
      en: p.name,
      fr: p.name_fr || p.name,
      ar: p.name_ar || p.name
    },
    slug: p.slug.current,
    price: p.price,
    // ✅ Safety Check yahan bhi
    image: p.image ? urlFor(p.image).url() : "",
    category: {
      en: p.category,
      fr: p.category,
      ar: p.category
    }
  };
}