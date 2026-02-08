import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const key = "AIzaSyALkbomzaKjkMVWbdBOA801UEwLIA5O8G0";
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-images:generateImages?key=${key}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          safetySetting: "BLOCK_LOW_AND_ABOVE"
        }
      }),
    });

    const responseText = await response.text();
    
    if (!responseText) {
      return NextResponse.json({ error: "API retornou resposta vazia." }, { status: 500 });
    }

    const data = JSON.parse(responseText);
    
    if (data.error) {
      return NextResponse.json({ error: data.error.message || "Erro na API do Google" }, { status: 400 });
    }

    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
      const b64 = data.predictions[0].bytesBase64Encoded;
      return NextResponse.json({ url: `data:image/png;base64,${b64}` });
    }

    return NextResponse.json({ error: "Nenhuma imagem foi gerada (Filtro de Segurança)." }, { status: 400 });

  } catch (error: any) {
    console.error("Erro interno Image:", error);
    return NextResponse.json({ error: "Falha na comunicação com o motor Nano Banana." }, { status: 500 });
  }
} // <--- Esta chave estava faltando ou mal posicionada!
