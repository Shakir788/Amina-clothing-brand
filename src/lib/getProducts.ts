import products from '@/data/products.json';

// Updated Types for Multi-language
export type Product = {
  id: string;
  name: { en: string; fr: string; ar: string }; // Changed to object
  price: string;
  image: string;
  category: { en: string; fr: string; ar: string }; // Changed to object
  slug: string;
};

// @ts-ignore
export async function getProducts(): Promise<Product[]> {
  // @ts-ignore
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  // @ts-ignore
  return products.find((p) => p.slug === slug);
}