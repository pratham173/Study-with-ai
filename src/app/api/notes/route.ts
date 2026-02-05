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

    const notes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        originalFileName: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch notes",
      },
      { status: 500 }
    );
  }
}
