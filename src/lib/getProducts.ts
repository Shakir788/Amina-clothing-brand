import { client } from "@/sanity/client";
import { urlFor } from "@/sanity/image";

// ✅ Yahan maine '?' hata diye hain (Required bana diya)
export interface Product {
  id: string;
  name: {
    en: string;
    fr: string; // Pehle fr?: tha
    ar: string; // Pehle ar?: tha
  };
  slug: string;
  price: string;
  image: string;
  category: {
    en: string;
    fr: string; // Pehle fr?: tha
    ar: string; // Pehle ar?: tha
  };
}

// 1. Fetch ALL Products
export async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product"]{
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
      // Fallback: Agar FR/AR nahi hai, to English use karega (toh kabhi undefined nahi hoga)
      fr: p.name_fr || p.name, 
      ar: p.name_ar || p.name
    },
    slug: p.slug.current,
    price: p.price,
    image: urlFor(p.image).url(),
    category: {
      en: p.category,
      fr: p.category,
      ar: p.category
    }
  }));
}

// 2. Fetch SINGLE Product
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
    image: urlFor(p.image).url(),
    category: {
      en: p.category,
      fr: p.category,
      ar: p.category
    }
  };
}