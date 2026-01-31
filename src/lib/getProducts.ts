import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";

export interface Product {
  id: string;
  name: { en: string; fr: string; ar: string };
  slug: string;
  price: string;
  originalPrice?: number; // 👈 1. Added Optional Original Price
  image: string;
  category: { en: string; fr: string; ar: string };
}

// 1. Fetch ALL Products
export async function getProducts(): Promise<Product[]> {
  const query = `*[_type == "product" && (status == "approved" || !defined(status))] | order(_createdAt desc) {
    _id,
    name,
    name_ar,
    name_fr,
    slug,
    price,
    originalPrice, // 👈 2. Fetch Original Price from Database
    image,
    category
  }`;

  const products = await client.fetch(query, {}, { next: { revalidate: 0 } });

  return products.map((p: any) => ({
    id: p._id,
    name: {
      en: p.name,
      fr: p.name_fr || p.name, 
      ar: p.name_ar || p.name
    },
    slug: p.slug.current,
    price: p.price,
    originalPrice: p.originalPrice || null, // 👈 3. Pass it to frontend (or null if empty)
    image: p.image ? urlFor(p.image).url() : "",
    category: {
      en: p.category,
      fr: p.category,
      ar: p.category
    }
  }));
}

// 2. Fetch SINGLE Product
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug && (status == "approved" || !defined(status))][0]{
    _id,
    name,
    name_ar,
    name_fr,
    slug,
    price,
    originalPrice, // 👈 Fetch here too
    image,
    category
  }`;

  const p = await client.fetch(query, { slug }, { next: { revalidate: 0 } });

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
    originalPrice: p.originalPrice || null, // 👈 Pass here too
    image: p.image ? urlFor(p.image).url() : "",
    category: {
      en: p.category,
      fr: p.category,
      ar: p.category
    }
  };
}