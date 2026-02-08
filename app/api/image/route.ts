import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const key = "AIzaSyALkbomzaKjkMVWbdBOA801UEwLIA5O8G0";
    
    // Testamos a versão estável mais recente do endpoint
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-images:generateImages?key=${key}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          safetySetting: "BLOCK_ONLY_HIGH" // Menos restritivo para testes
        }
      }),
    });

    const responseText = await response.text();
    
    // Caso o Google responda com erro de HTML ou Vazio
    if (!responseText || responseText.startsWith('<!DOCTYPE')) {
      return NextResponse.json({ 
        error: "O Google bloqueou a requisição ou o serviço Imagen 3 não está ativo nesta API Key." 
      }, { status: 500 });
    }

    const data = JSON.parse(responseText);
    
    if (data.error) {
      return NextResponse.json({ 
        error: `Erro Google (${data.error.code}): ${data.error.message}` 
      }, { status: 400 });
    }

    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
      const b64 = data.predictions[0].bytesBase64Encoded;
      return NextResponse.json({ url: `data:image/png;base64,${b64}` });
    }

    return NextResponse.json({ 
      error: "O modelo processou, mas não gerou imagem. Tente um prompt mais simples." 
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: "Erro na ponte VilorAI -> Nano Banana." }, { status: 500 });
  }
}
