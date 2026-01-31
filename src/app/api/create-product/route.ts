import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, 
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const category = formData.get("category") as string;
    const sellerEmail = formData.get("sellerEmail") as string;
    const colorName = formData.get("colorName") as string; // 🎨
    const sizesRaw = formData.get("sizes") as string; // 📏 (JSON string from frontend)
    
    const mainImageFile = formData.get("image") as File; // Main Photo
    const galleryFiles = formData.getAll("gallery") as File[]; // 🎞️ Multiple Photos

    if (!name || !price || !mainImageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Upload Main Image
    console.log("Uploading main image...");
    const mainImageAsset = await client.assets.upload("image", mainImageFile);
    
    // 2. Upload Gallery Images (Loop)
    const galleryAssets = [];
    if (galleryFiles.length > 0) {
      console.log(`Uploading ${galleryFiles.length} gallery images...`);
      for (const file of galleryFiles) {
        const asset = await client.assets.upload("image", file);
        galleryAssets.push({
          _key: Math.random().toString(36).substring(2, 9), // Unique key for Sanity array
          _type: "image",
          asset: { _type: "reference", _ref: asset._id }
        });
      }
    }

    // 3. Parse Sizes
    const sizes = sizesRaw ? JSON.parse(sizesRaw) : [];

    // 4. Create Product Document in Sanity
    const newProduct = await client.create({
      _type: "product",
      name: name,
      slug: {
        _type: "slug",
        current: `${name.toLowerCase().replace(/\s+/g, "-")}-${Math.floor(Math.random() * 1000)}`,
      },
      price: price,
      category: category,
      sellerEmail: sellerEmail,
      status: "draft", 
      
      // Main Image
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: mainImageAsset._id },
      },

      // Gallery Images Array
      gallery: galleryAssets,

      // Sizes Array
      sizes: sizes,

      // Colors Array (Stored as object inside array to match schema)
      colors: colorName ? [{
        _key: 'main-color',
        colorName: colorName,
        colorHex: "#000000" // Default black, admin can change in studio
      }] : [],
    });

    return NextResponse.json({ success: true, id: newProduct._id });

  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}