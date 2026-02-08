import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const GEMINI_KEY = "AIzaSyALkbomzaKjkMVWbdBOA801UEwLIA5O8G0";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-images:generateImages?key=${GEMINI_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: { sampleCount: 1 }
      }),
    });

    const data = await response.json();
    const base64Image = data.predictions[0].bytesBase64Encoded;
    return NextResponse.json({ url: `data:image/png;base64,${base64Image}` });
  } catch (error) {
    return NextResponse.json({ error: "Erro na geração de imagem." }, { status: 500 });
  }
}
