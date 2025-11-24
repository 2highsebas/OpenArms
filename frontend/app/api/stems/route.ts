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

    // Save uploaded file
    const tempDir = path.join(process.cwd(), "temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const inputPath = path.join(tempDir, file.name);
    const outputPath = path.join(tempDir, "output");
    if (!fs.existsSync(outputPath)) fs.mkdirSync(outputPath);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(inputPath, buffer);

    // CALL PYTHON SPLITTER
    await new Promise((resolve, reject) => {
      const backendPath = path.join(process.cwd(), "..", "backend", "process_stems.py");
      
      const python = spawn("python", [
        backendPath,
        inputPath,
        outputPath,
      ]);

      let errorOutput = "";
      let stdOutput = "";

      python.stdout.on("data", (data) => {
        stdOutput += data.toString();
        console.log("Python stdout:", data.toString());
      });

      python.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error("Python stderr:", data.toString());
      });

      python.on("close", (code) => {
        if (code !== 0) {
          console.error("Python process failed with code:", code);
          console.error("Error output:", errorOutput);
          reject(`Stem separation failed: ${errorOutput}`);
        } else {
          console.log("Stem separation successful!");
          resolve("Done");
        }
      });

      python.on("error", (err) => {
        reject(`Failed to start Python: ${err.message}`);
      });
    });

    const vocals = fs.readFileSync(path.join(outputPath, "vocals.wav"));
    const drums = fs.readFileSync(path.join(outputPath, "drums.wav"));
    const bass = fs.readFileSync(path.join(outputPath, "bass.wav"));
    const piano = fs.readFileSync(path.join(outputPath, "piano.wav"));
    const other = fs.readFileSync(path.join(outputPath, "other.wav"));

    return NextResponse.json({
      vocals: vocals.toString("base64"),
      drums: drums.toString("base64"),
      bass: bass.toString("base64"),
      piano: piano.toString("base64"),
      other: other.toString("base64"),
    });
  } catch (e) {
    return NextResponse.json({ error: e?.toString() }, { status: 500 });
  }
}
