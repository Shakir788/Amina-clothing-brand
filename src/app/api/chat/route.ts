import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getProducts } from '@/lib/getProducts';

// OpenRouter Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 1. Products fetch karo
  const products = await getProducts();
  
  // 2. Product context
  const productContext = products.map((p: any) => 
    `- ${p.name.en} (${p.price} DHS): Category ${p.category.en}`
  ).join('\n');

  // 3. System Prompt
  // 3. System Prompt
  const systemPrompt = `
    You are 'Amina AI', a luxury fashion stylist for a Moroccan clothing brand.
    Goal: Help customers choose the perfect Kaftan or Dress.
    Traits: Polite, short answers, use emojis ✨👗. Prices in DHS.
    
    IMPORTANT: Detect the user's language and reply in the SAME language.
    - If user asks in English -> Reply in English.
    - If user asks in French -> Reply in French.
    - If user asks in Arabic -> Reply in Arabic.
    
    Current Stock:
    ${productContext}
  `;

  // 4. Call AI
  const response = await openai.chat.completions.create({
    model: 'xiaomi/mimo-v2-flash:free',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
  });

  // 5. Stream Response
  const stream = OpenAIStream(response as any);
  
  return new StreamingTextResponse(stream);
}