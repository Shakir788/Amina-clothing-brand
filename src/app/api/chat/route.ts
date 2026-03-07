import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getProducts } from '@/lib/getProducts';

// OpenRouter Config
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export const runtime = 'edge';

// Helper: Shuffle Array
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 1. Fetch products
    let products = await getProducts();

    console.log('🔥 AI Products Found:', products?.length || 0);

    // Safety: no products = empty array
    if (!products || products.length === 0) {
      products = [];
    }

    // 2. Shuffle & limit
    products = shuffleArray(products);
    const selectedProducts = products.slice(0, 15);

    // 3. Build context
    const productContext = selectedProducts
      .map((p: any) => {
        const productId = p._id || 'unknown';
        const title = p.name?.en || p.name || 'Product';
        const price = p.price || 'N/A';
        const category = p.category?.en || 'Fashion';
        const slug =
          typeof p.slug === 'string' ? p.slug : p.slug?.current || '';
        const imageUrl =
          typeof p.image === 'string'
            ? p.image
            : p.image?.asset?.url || '';

        return `- ${title} (${price} DHS): ${category} | ID: ${productId} | Slug: ${slug} | Image: ${imageUrl}`;
      })
      .join('\n');

    // 4. System Prompt
    const systemPrompt = `
    You are **Amina AI**, the official virtual stylist of **AMINA**, a premium Moroccan fashion brand.

    Your role is NOT to sell aggressively.
    Your role is to GUIDE, STYLE, and RECOMMEND with elegance.

    You ONLY recommend products from the CURRENT STOCK below.

    CURRENT STOCK (Limited & Curated):
    ${productContext}

    🛑 STRICT BRAND RULES:
    1. Language:
       - Reply ONLY in the user's language (Arabic, Darija, French, or English).
       - DO NOT hallucinate languages like Chinese.

    2. Brand Safety:
       - NEVER invent sizes, availability, delivery times, or return policies.
       - If unsure, say politely: “Please confirm via WhatsApp ✨”

    3. Tone:
       - Luxury, calm, warm, and confident.
       - Short answers only (Max 2 sentences).
       - Use max 1–2 emojis ✨🤍

    4. Recommendations:
       - Suggest at most **1 product per reply**.
       - NEVER repeat the same product in consecutive replies.
       - Explain *why* it suits the customer.

    5. Role Awareness:
       - You are a stylist, not customer support.
       - Redirect logistics questions to WhatsApp.

    ✨ Remember:
    AMINA is a curated brand, not a marketplace.
    Less is more. Elegance over excitement.

    💎 TECHNICAL INSTRUCTION (HIDDEN):
    If you recommend a product, append this JSON at the END of your response:

    [PRODUCT_DATA:{"id":"PRODUCT_ID","name":"PRODUCT_NAME","price":"PRODUCT_PRICE","slug":"PRODUCT_SLUG","image":"IMAGE_URL"}]

    ⚠️ Do NOT use Markdown images. Only the JSON format above.
    `;

    // 5. Call AI (Requested Model)
    const response = await openai.chat.completions.create({
      model: 'arcee-ai/trinity-large-preview:free',
      stream: true,
      temperature: 0.4,
      top_p: 0.9,
      max_tokens: 400, 
      frequency_penalty: 0.4,
      presence_penalty: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);

  } catch (error) {
    
    console.error("❌ AI Error:", error);
    return new Response("Amina is currently offline. Please try again later.", { status: 503 });
  }
}