import { Configuration, OpenAIApi } from "openai";
import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from "formidable";
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

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

  try {
    // Create a readable stream for the file
    const fileStream = createReadStream(videoFilePath);
    
    const resp = await openai.createTranscription(
      fileStream as any,
      "whisper-1"
    );

    const transcript = resp?.data?.text;

    // Content moderation check
    const moderationResponse = await openai.createModeration({
      input: transcript,
    });

    if (moderationResponse?.data?.results[0]?.flagged) {
      // Clean up temporary file
      await unlink(videoFilePath).catch(() => {});
      
      return NextResponse.json(
        { error: "Inappropriate content detected. Please try again." },
        { status: 200 }
      );
    }

    // Clean up temporary file
    await unlink(videoFilePath).catch(() => {});

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error("server error", error);
    
    // Clean up temporary file
    await unlink(videoFilePath).catch(() => {});
    
    return NextResponse.json({ error: "Error processing transcription" }, { status: 500 });
  }
}