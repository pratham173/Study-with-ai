import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { theme } = await req.json();

    // Validate theme value
    const validThemes = ['light', 'dark', 'solarized', 'high-contrast'];
    if (!validThemes.includes(theme)) {
      return NextResponse.json(
        { success: false, error: 'Invalid theme value' },
        { status: 400 }
      );
    }

    // Update user's theme preference
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { theme },
    });

    return NextResponse.json({
      success: true,
      theme: user.theme,
    });
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}
