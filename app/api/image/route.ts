import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const key = "AIzaSyALkbomzaKjkMVWbdBOA801UEwLIA5O8G0";
    
    // Endpoint atualizado para o modelo exato Imagen 4.0
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:generateImages?key=${key}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1", // Imagen 4 suporta "1:1", "4:3", "3:4", "16:9", "9:16"
          safetySetting: "BLOCK_ONLY_HIGH",
          personGeneration: "allow_all" // Permite geração de pessoas se a sua conta tiver permissão
        }
      }),
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      const errorData = JSON.parse(responseText);
      return NextResponse.json({ 
        error: `Erro Imagen 4 (${response.status}): ${errorData.error?.message || 'Falha na geração'}` 
      }, { status: response.status });
    }

    const data = JSON.parse(responseText);
    
    // O Imagen 4 mantém a estrutura de retorno em base64 nas predições
    if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
      const b64 = data.predictions[0].bytesBase64Encoded;
      return NextResponse.json({ url: `data:image/png;base64,${b64}` });
    }

    return NextResponse.json({ 
      error: "O Imagen 4 processou mas não retornou pixels. Verifique se o prompt não viola as novas políticas de segurança." 
    }, { status: 400 });

  } catch (error: any) {
    console.error("Critical Image Error:", error);
    return NextResponse.json({ error: "Erro na conexão com o Imagen 4.0" }, { status: 500 });
  }
}
