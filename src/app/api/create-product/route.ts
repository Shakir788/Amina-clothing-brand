import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, 
});

// 🎨 Basic Colors ka Map (Taaki baar-baar Hex code na dalna pade)
const colorMap: Record<string, string> = {
  "Black": "#000000",
  "White": "#FFFFFF",
  "Red": "#FF0000",
  "Pink": "#FFC0CB",
  "Blue": "#0000FF",
  "Green": "#008000",
  "Beige": "#F5F5DC",
  "Brown": "#A52A2A",
  "Grey": "#808080",
  "Gold": "#FFD700",
  "Burgundy": "#800020",
  "Camel": "#C19A6B",
  "Cream": "#FFFDD0"
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const sellerEmail = formData.get("sellerEmail") as string;
    const colorName = formData.get("colorName") as string; 
    const sizesRaw = formData.get("sizes") as string;
    
    const mainImageFile = formData.get("image") as File; 
    const galleryFiles = formData.getAll("gallery") as File[]; 

    if (!name || !price || !mainImageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Upload Main Image
    console.log("Uploading main image...");
    const mainImageAsset = await client.assets.upload("image", mainImageFile);
    
    // 2. Upload Gallery Images
    const galleryAssets = [];
    if (galleryFiles && galleryFiles.length > 0) {
      console.log(`Uploading ${galleryFiles.length} gallery images...`);
      for (const file of galleryFiles) {
        // Sirf tab upload karo agar file valid ho (size > 0)
        if (file.size > 0) {
            const asset = await client.assets.upload("image", file);
            galleryAssets.push({
            _key: Math.random().toString(36).substring(2, 9),
            _type: "image",
            asset: { _type: "reference", _ref: asset._id }
            });
        }
      }
    }

    // 3. Parse Sizes & Colors
    const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];
    
    // 👇 MAGIC FIX: Color Name se Hex code khud utha lega
    // Agar list mein nahi mila toh default Black (#000000) rakhega
    const autoHex = colorMap[colorName] || "#000000";

    // 4. Create Product Document
    const newProduct = await client.create({
      _type: "product",
      name: name,
      slug: {
        _type: "slug",
        current: `${name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`, // Unique Slug logic fixed
      },
      price: Number(price), // 👈 Number convert kiya calculation ke liye
      originalPrice: Number(price) + 100, // Fake discount ke liye (Optional)
      category: category,
      sellerEmail: sellerEmail,
      status: "draft", 
      
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: mainImageAsset._id },
      },

      gallery: galleryAssets, 

      sizes: sizes,

      colors: colorName ? [{
        _key: Math.random().toString(36).substring(7),
        colorName: colorName,
        colorHex: { hex: autoHex } 
      }] : [],
    });

    return NextResponse.json({ success: true, id: newProduct._id });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}