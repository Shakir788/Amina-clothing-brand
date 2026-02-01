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
    const query = `*[_type == "product" && (
      name match $q ||
      name.en match $q ||
      name.fr match $q ||
      name.ar match $q ||
      category->name.en match $q
    )] | order(_createdAt desc)[0...5] {
      _id,
      name,
      price,
      "slug": slug.current,
      image,
      category->
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
