import { NextResponse } from "next/server";

async function translateText(text: string, target: "fr" | "ar"): Promise<string> {
  if (!text || !text.trim()) return "";
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`;
  const res = await fetch(url);
  if (!res.ok) return "";
  const data = await res.json();
  return data?.responseData?.translatedText || "";
}

export async function POST(req: Request) {
  try {
    const { name, description } = await req.json();

    const [name_fr, name_ar, description_fr, description_ar] = await Promise.all([
      translateText(name, "fr"),
      translateText(name, "ar"),
      description ? translateText(description, "fr") : Promise.resolve(""),
      description ? translateText(description, "ar") : Promise.resolve(""),
    ]);

    return NextResponse.json({ name_fr, name_ar, description_fr, description_ar });
  } catch (error: any) {
    console.error("Translate API error:", error);
    return NextResponse.json({ error: error.message || "Translation failed" }, { status: 500 });
  }
}