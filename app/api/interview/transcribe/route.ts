import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from "formidable";
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { generateWithOllama } from '@/lib/interview/ollama-client';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Note: For transcription, you'll need to set up a local Whisper model or use an alternative service
  // This is a placeholder that returns an error for now
  return NextResponse.json(
    { error: "Transcription service not configured. Please set up local Whisper or use alternative service." },
    { status: 501 }
  );

  // Parse form data
  const fData = await new Promise<{ fields: any; files: any }>(
    (resolve, reject) => {
      const form = new IncomingForm({
        multiples: false,
        uploadDir: "/tmp",
        keepExtensions: true,
      });
      
      form.parse(req as any, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    }
  );

  const videoFile = fData.files.file;
  const videoFilePath = videoFile?.filepath;
  
  if (!videoFilePath) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Clean up temporary file
  await unlink(videoFilePath).catch(() => {});
}