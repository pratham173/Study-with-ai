import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;

    const note = await prisma.note.findUnique({
      where: {
        id: resolvedParams.id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    if (note.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

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
    console.error("Failed to fetch note:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch note",
      },
      { status: 500 }
    );
  }
}
