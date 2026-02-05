import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateLatex } from '@/lib/export/latex';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { noteId } = await req.json();

    if (!noteId) {
      return NextResponse.json(
        { success: false, error: 'Note ID is required' },
        { status: 400 }
      );
    }

    // Fetch the note
    const note = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || note.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Generate LaTeX
    const latex = generateLatex(note.title, note.content as any);

    return new NextResponse(latex, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${note.title.replace(/[^a-z0-9]/gi, '_')}.tex"`,
      },
    });
  } catch (error) {
    console.error('Error generating LaTeX:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate LaTeX' },
      { status: 500 }
    );
  }
}
