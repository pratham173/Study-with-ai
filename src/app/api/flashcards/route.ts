import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const noteId = searchParams.get('noteId');

    if (noteId) {
      // Get flashcards for a specific note
      const flashcards = await prisma.flashcard.findMany({
        where: {
          noteId,
          userId: session.user.id,
        },
        orderBy: { createdAt: 'asc' },
      });

      return NextResponse.json({
        success: true,
        flashcards,
      });
    } else {
      // Get all flashcards for the user, grouped by note
      const flashcards = await prisma.flashcard.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          note: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: [
          { noteId: 'asc' },
          { createdAt: 'asc' },
        ],
      });

      return NextResponse.json({
        success: true,
        flashcards,
      });
    }
  } catch (error) {
    console.error("Flashcards fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch flashcards",
      },
      { status: 500 }
    );
  }
}
