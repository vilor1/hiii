import { NextResponse } from 'next/server';

const API_KEY = "sk-pmSCr71xefZ3twXQaJCj6T1C8JA9h";
const BASE_URL = "https://api.apifree.ai";

export async function POST(req: Request) {
  try {
    const { prompt, imageUrl } = await req.json();
    
    const payload = {
      "enable_prompt_expansion": true,
      "end_image_strength": 1,
      "fps": 25,
      "generate_audio": true,
      "image_strength": 1,
      "image_url": imageUrl || "https://static.apifree.ai/static/i/20260210/22b0114825e521ce690a00726117d148.jpg",
      "interpolation_direction": "forward",
      "model": "lightricks/ltx-2-19b-distilled/image-to-video",
      "negative_prompt": "blurry, out of focus, low quality, distorted, extra limbs, artifacts",
      "num_frames": 32, // Ajustado conforme solicitado
      "prompt": prompt,
      "use_multiscale": true,
      "video_output_type": "X264 (.mp4)",
      "video_quality": "high",
      "video_size_height": 480, // Ajustado conforme solicitado
      "video_size_width": 480,  // Ajustado conforme solicitado
      "video_write_mode": "balanced"
    };

    const response = await fetch(`${BASE_URL}/v1/video/submit`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return NextResponse.json({ requestId: data.resp_data.request_id });
  } catch (error) {
    return NextResponse.json({ error: "Erro na Matrix" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const headers = { "Authorization": `Bearer ${API_KEY}` };

  const res = await fetch(`${BASE_URL}/v1/video/${id}/status`, { headers });
  const statusData = await res.json();
  
  if (statusData?.resp_data?.status === "success") {
    const result = await fetch(`${BASE_URL}/v1/video/${id}/result`, { headers });
    const finalData = await result.json();
    return NextResponse.json({ status: "success", url: finalData.resp_data.video_list[0] });
  }
  
  return NextResponse.json({ status: statusData?.resp_data?.status || "pending" });
}
