import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";

    // Forward request to Python backend
    const response = await fetch(`${backendUrl}/api/tempo`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error("Tempo analysis error:", e);
    return NextResponse.json(
      {
        success: false,
        error: e?.toString(),
      },
      { status: 500 }
    );
  }
}
