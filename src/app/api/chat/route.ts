import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  console.log('Mensagens:', JSON.stringify(messages, null, 2));

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(encoder.encode(chunk.choices[0]?.delta?.content || ""));
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  } catch (err) {
    console.error('Erro na API:', err);
    return NextResponse.json({ error: 'Erro ao conectar com a OpenAI' }, { status: 500 });
  }
}
