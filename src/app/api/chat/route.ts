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

    // 1. Fetch live products from database
    let products = await getProducts();
    console.log('🔥 AI Products Found:', products?.length || 0);

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
        const slug = typeof p.slug === 'string' ? p.slug : p.slug?.current || '';
        const imageUrl = typeof p.image === 'string' ? p.image : p.image?.asset?.url || '';

        return `- ${title} (${price} DHS): ${category} | ID: ${productId} | Slug: ${slug} | Image: ${imageUrl}`;
      })
      .join('\n');

    // 🧠 4. THE ULTIMATE "AI CLOSER" SYSTEM PROMPT
    const systemPrompt = `
    You are "Amina AI", a luxury fashion stylist and sales assistant for the Moroccan clothing brand AMINA.

    Your goal is to help customers choose products AND guide them toward placing an order naturally.

    CURRENT STOCK (Limited & Curated):
    ${productContext}

    ---
    BEHAVIOR RULES & SMART SELLING STRATEGY:
    1. Only answer what the customer asks, but gently guide them toward buying.
    2. Keep answers short, elegant, and persuasive (Max 2-3 sentences).
    3. Do NOT overwhelm with too much information.
    4. Be helpful, friendly, and confident. Never pushy.
    5. Soft Suggestion: If giving info about a product, add a gentle hook (e.g., "It's one of our most loved pieces right now ✨").
    6. Decision Maker: If the user shows interest, encourage them (e.g., "Would you like me to help you place the order? 🌿").
    7. Light Urgency: If available, subtly mention demand (e.g., "This model is in high demand these days ✨").
    8. Order Info: To place an order, tell them to provide: Name, City, Address, and Product.

    ---
    DELIVERY KNOWLEDGE (ONLY IF ASKED):
    - Delivery takes 2–3 days.
    - Payment is required before trying.
    - Customer can try at delivery. Immediate return is possible.
    - No home try before payment.
    CRITICAL RULE: DO NOT explain delivery rules, payment rules, or policies UNLESS specifically asked!

    ---
    COMMUNICATION STYLE:
    - Elegant, minimal, and slight persuasive tone.
    - Reply ONLY in the user's language (Arabic, Darija, French, or English).
    - Use light emojis ✨ 🌿.
    - Speak like a premium brand stylist.

    ---
    💎 TECHNICAL INSTRUCTION (HIDDEN UI TRIGGER):
    If you recommend a specific product from the CURRENT STOCK, you MUST append this exact JSON at the VERY END of your response. This will show a clickable UI card to the user:

    [PRODUCT_DATA:{"id":"PRODUCT_ID","name":"PRODUCT_NAME","price":"PRODUCT_PRICE","slug":"PRODUCT_SLUG","image":"IMAGE_URL"}]

    ⚠️ Do NOT use Markdown images. Only use the JSON format above. Never invent products not in the CURRENT STOCK.
    `;

    // 🚀 5. FALLBACK MODEL LIST (Teri bheji hui premium list)
    const fallbackModels = [
      "poolside/laguna-xs-2.1:free",
      "nvidia/nemotron-3.5-content-safety:free",
      "nvidia/nemotron-3-ultra-550b-a55b:free",
      "poolside/laguna-m.1:free",
      "google/gemma-4-26b-a4b-it:free",
      "google/gemma-4-31b-it:free",
      "openai/gpt-oss-20b:free"
    ];

    // 🔄 6. FALLBACK LOOP (Try until one succeeds)
    for (const currentModel of fallbackModels) {
      try {
        console.log(`⏳ Trying AI Model: ${currentModel}...`);
        
        const response = await openai.chat.completions.create({
          model: currentModel,
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

        console.log(`✅ Success with model: ${currentModel}`);
        
        // Agar response mil gaya, toh stream return kardo aur loop se baahar nikal jao
        const stream = OpenAIStream(response as any);
        return new StreamingTextResponse(stream);

      } catch (modelError) {
        // Agar model 404/503 deta hai, toh error pakdo aur agla try karo
        console.warn(`⚠️ Model ${currentModel} failed. Shifting to next...`);
      }
    }

    // Agar saare 7 models fail ho gaye (jo ki virtually impossible hai)
    throw new Error("All fallback models are currently down.");

  } catch (error) {
    console.error("❌ AI Error (All Models Failed):", error);
    return new Response("Amina AI is currently offline. Please try again later.", { status: 503 });
  }
}