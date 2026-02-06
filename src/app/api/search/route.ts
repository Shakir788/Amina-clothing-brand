import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("q")?.toLowerCase().trim();

  // Guard: minimum 2 characters
  if (!term || term.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    // 👇 SMART SEARCH QUERY UPDATED
    const query = `*[_type == "product" && (
      name match $q ||           // English Name
      name_fr match $q ||        // French Name
      name_ar match $q ||        // Arabic Name
      category match $q ||       // Category (e.g. Dresses, Abayas)
      description match $q ||    // ✨ Description (Fabric, style details)
      colors[].colorName match $q // ✨ Colors (Black, Pink, etc.)
    )] | order(_createdAt desc)[0...10] {
      _id,
      name,
      name_fr,
      name_ar,
      price,
      "slug": slug.current,
      image,
      category
    }`;

    // 🔥 CONTAINS SEARCH (order independent)
    const results = await client.fetch(query, {
      q: `*${term}*`
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { results: [], error: "Failed to fetch" },
      { status: 500 }
    );
  }
}