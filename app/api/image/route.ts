import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    // Chave que você forneceu
    const GEMINI_KEY = "AIzaSyALkbomzaKjkMVWbdBOA801UEwLIA5O8G0";
    
    // URL oficial do Imagen 3 via Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-images:generateImages?key=${GEMINI_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { 
          sampleCount: 1,
          aspectRatio: "1:1",
          outputMimeType: "image/png"
        }
      }),
    });

    const data = await response.json();

    // Log para debug no console da Vercel
    if (data.error) {
      console.error("Erro Gemini:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 400 });
    }

    // O Imagen retorna a imagem em bytesBase64Encoded dentro de predictions
    const base64Image = data.predictions[0].bytesBase64Encoded;
    
    if (!base64Image) throw new Error("Imagem não gerada");

    return NextResponse.json({ url: `data:image/png;base64,${base64Image}` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao conectar com Gemini" }, { status: 500 });
  }
}
