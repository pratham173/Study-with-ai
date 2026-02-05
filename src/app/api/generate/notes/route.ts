import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateNotes } from "@/lib/generators/notes";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, title, fileName, fileType } = body;

    if (!content || !title) {
      return NextResponse.json(
        { success: false, error: "Content and title are required" },
        { status: 400 }
      );
    }

    const noteContent = generateNotes(content, title);

    const note = await prisma.note.create({
      data: {
        userId: session.user.id,
        title: title,
        content: noteContent as any,
        originalFileName: fileName,
        fileType: fileType,
      },
    });

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
      },
    });
  } catch (error) {
    console.error("Notes generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate notes",
      },
      { status: 500 }
    );
  }
}
