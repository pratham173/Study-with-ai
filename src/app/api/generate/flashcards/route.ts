import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateFlashcards } from "@/lib/generators/flashcards";
import { NoteContent } from "@/types/index";

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
    const { noteId } = body;

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Fetch the note
    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: { flashcards: true },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: "Note not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (note.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if flashcards already exist for this note
    if (note.flashcards.length > 0) {
      return NextResponse.json(
        { success: false, error: "Flashcards already exist for this note" },
        { status: 400 }
      );
    }

    // Generate flashcards from note content
    const noteContent = note.content as unknown as NoteContent;
    const flashcardsData = generateFlashcards(noteContent);

    // Save flashcards to database
    const flashcards = await prisma.flashcard.createMany({
      data: flashcardsData.map(fc => ({
        ...fc,
        noteId: note.id,
        userId: session.user.id,
      })),
    });

    // Fetch the created flashcards to return them
    const createdFlashcards = await prisma.flashcard.findMany({
      where: {
        noteId: note.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      flashcards: createdFlashcards,
      count: flashcards.count,
    });
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate flashcards",
      },
      { status: 500 }
    );
  }
}
