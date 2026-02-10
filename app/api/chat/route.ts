import { NextResponse } from 'next/server';

const GROQ_KEY = "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";
const APIFREE_KEY = "sk-pp6h2ak4TBfcDhQbWPK4ya0zF0H3Z";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // LÓGICA DE VÍDEO (LTX-2)
    if (body.type === 'video') {
      const resp = await fetch("https://api.apifree.ai/v1/video/submit", {
        method: 'POST',
        headers: { "Authorization": `Bearer ${APIFREE_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "lightricks/ltx-2-19b-distilled/image-to-video",
          prompt: body.prompt,
          num_frames: 32,
          video_size_height: 480,
          video_size_width: 480,
          fps: 25,
          generate_audio: true
        })
      });
      const data = await resp.json();
      return NextResponse.json({ requestId: data.resp_data.request_id });
    }

    // LÓGICA DE CHAT (KIMI)
    const chatResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2-instruct-0905",
        messages: [{ role: "system", content: body.systemPrompt }, ...body.messages],
        temperature: 0.7,
      }),
    });
    const chatData = await chatResp.json();
    return NextResponse.json({ content: chatData.choices[0].message.content });

  } catch (error) {
    return NextResponse.json({ error: "System Failure" }, { status: 500 });
  }
}
