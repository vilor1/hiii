import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const GROQ_KEY = "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";

  try {
    const { messages } = await req.json();
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2-instruct-0905",
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
       return NextResponse.json({ content: "Erro na API da Groq: " + (data.error?.message || "Desconhecido") }, { status: response.status });
    }

    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ content: "Erro interno no servidor VilorAI." }, { status: 500 });
  }
}
