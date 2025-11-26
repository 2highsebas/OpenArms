import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Save uploaded file to temp directory
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const inputPath = path.join(tempDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputPath, buffer);

    // Call Python tempo analyzer
    const result = await new Promise<any>((resolve, reject) => {
      const backendPath = path.join(process.cwd(), "..", "backend", "analyze_tempo.py");
      
      const python = spawn("python", [backendPath, inputPath]);

      let output = "";
      let errorOutput = "";

      python.stdout.on("data", (data) => {
        output += data.toString();
      });

      python.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error("Python stderr:", data.toString());
      });

      python.on("close", (code) => {
        if (code !== 0) {
          console.error("Python process failed with code:", code);
          console.error("Error output:", errorOutput);
          reject(`Tempo analysis failed: ${errorOutput}`);
        } else {
          // Extract JSON from output
          const jsonMatch = output.match(/__RESULT_JSON__\s*\n([\s\S]*)/);
          if (jsonMatch) {
            try {
              const result = JSON.parse(jsonMatch[1]);
              resolve(result);
            } catch (e) {
              reject("Failed to parse analysis result");
            }
          } else {
            reject("No result found in output");
          }
        }
      });

      python.on("error", (err) => {
        reject(`Failed to start Python: ${err.message}`);
      });
    });

    // Clean up temp file
    try {
      fs.unlinkSync(inputPath);
    } catch (e) {
      console.error("Failed to clean up temp file:", e);
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("Tempo analysis error:", e);
    return NextResponse.json({ 
      success: false,
      error: e?.toString() 
    }, { status: 500 });
  }
}
