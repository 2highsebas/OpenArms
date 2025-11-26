import { NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;
    const category = formData.get("category") as string;
    const genre = formData.get("genre") as string;
    const subgenre = formData.get("subgenre") as string;
    const bpm = formData.get("bpm") as string;
    const key = formData.get("key") as string;
    const mood = formData.get("mood") as string;
    const license = formData.get("license") as string;
    const coverImage = formData.get("coverImage") as File | null;

    if (!file || !title) {
      return NextResponse.json(
        { error: "File and title are required" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "..", "backend", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const safeFilename = `${timestamp}_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${fileExtension}`;
    const filePath = path.join(uploadsDir, safeFilename);

    // Save audio file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Save cover image if provided
    let coverImagePath = null;
    if (coverImage) {
      const coverExtension = path.extname(coverImage.name);
      const coverFilename = `${timestamp}_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_cover${coverExtension}`;
      coverImagePath = path.join(uploadsDir, coverFilename);
      
      const coverBytes = await coverImage.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);
      fs.writeFileSync(coverImagePath, coverBuffer);
    }

    // Create metadata JSON
    const metadata = {
      id: timestamp.toString(),
      title,
      description,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      category,
      genre,
      subgenre,
      bpm: bpm ? parseInt(bpm) : null,
      key,
      mood,
      license,
      filename: safeFilename,
      coverImage: coverImagePath ? path.basename(coverImagePath) : null,
      uploadDate: new Date().toISOString(),
      fileSize: buffer.length,
    };

    // Save metadata
    const metadataPath = path.join(uploadsDir, `${timestamp}_metadata.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      message: "Upload successful",
      data: {
        id: metadata.id,
        title: metadata.title,
        category: metadata.category,
        filename: safeFilename,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve uploads
export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "..", "backend", "uploads");
    
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json({ uploads: [] });
    }

    const files = fs.readdirSync(uploadsDir);
    const metadataFiles = files.filter((f) => f.endsWith("_metadata.json"));

    const uploads = metadataFiles.map((file) => {
      const filePath = path.join(uploadsDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    });

    // Sort by upload date (newest first)
    uploads.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return NextResponse.json(
      { error: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}
