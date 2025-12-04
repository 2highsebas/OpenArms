import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    
    console.log(`[STEMS] Forwarding to: ${backendUrl}/api/stems`);
    
    // Forward the request to the Python backend
    const response = await fetch(`${backendUrl}/api/stems`, {
      method: "POST",
      body: formData,
    });

    console.log(`[STEMS] Backend response status: ${response.status}`);

    if (!response.ok) {
      const error = await response.text();
      console.error(`[STEMS] Backend error:`, error);
      return NextResponse.json({ error: `Backend error: ${error}` }, { status: response.status });
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await response.text();
      console.error(`[STEMS] Invalid content-type: ${contentType}. Response:`, text.substring(0, 200));
      return NextResponse.json({ error: `Backend returned invalid response (not JSON). Got: ${text.substring(0, 100)}` }, { status: 500 });
    }

    const data = await response.json();
    console.log(`[STEMS] Success! Got stems:`, Object.keys(data));
    return NextResponse.json(data);
  } catch (e) {
    console.error(`[STEMS] Error:`, e);
    return NextResponse.json({ error: e?.toString() }, { status: 500 });
  }
}
