import { NextRequest, NextResponse } from "next/server";
import { parsePDF } from "@/lib/parsers/pdf";
import { parseDOCX } from "@/lib/parsers/docx";
import { parseTXT } from "@/lib/parsers/txt";
import { parsePPT } from "@/lib/parsers/ppt";
import { parseImage } from "@/lib/parsers/image";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = {
  "application/pdf": { ext: "pdf", parser: parsePDF },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { ext: "docx", parser: parseDOCX },
  "text/plain": { ext: "txt", parser: parseTXT },
  "application/vnd.ms-powerpoint": { ext: "ppt", parser: parsePPT },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { ext: "pptx", parser: parsePPT },
  "image/jpeg": { ext: "jpg", parser: parseImage },
  "image/png": { ext: "png", parser: parseImage },
};

function cleanText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const fileType = file.type;
    const fileConfig = ALLOWED_TYPES[fileType as keyof typeof ALLOWED_TYPES];

    if (!fileConfig) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type. Allowed types: PDF, DOCX, TXT, PPT, JPG, PNG`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let content: string;
    try {
      content = await fileConfig.parser(buffer);
    } catch (parseError) {
      const errorMessage = parseError instanceof Error ? parseError.message : "Failed to parse file";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    const cleanedContent = cleanText(content);

    if (!cleanedContent || cleanedContent.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "File appears to be empty or contains no readable text",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      content: cleanedContent,
      fileName: file.name,
      fileType: fileConfig.ext,
      fileSize: file.size,
      metadata: {
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process file",
      },
      { status: 500 }
    );
  }
}
