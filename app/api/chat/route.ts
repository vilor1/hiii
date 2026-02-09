import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer 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`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2-instruct-0905",
        messages: [
          { role: "system", content: systemPrompt || "Você é o VilorAI Quantum, um assistente de elite." },
          ...messages
        ],
        temperature: 0.6,
      }),
    });
    const data = await response.json();
    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: "Erro na API" }, { status: 500 });
  }
}
