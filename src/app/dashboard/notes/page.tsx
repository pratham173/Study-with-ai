"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Loader2, Calendar, BookOpen } from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  createdAt: string;
  originalFileName?: string;
  flashcardCount?: number;
}

export default function NotesListPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();

      if (data.success) {
        // Fetch flashcard counts for each note
        const notesWithCounts = await Promise.all(
          data.notes.map(async (note: NoteItem) => {
            try {
              const flashcardsResponse = await fetch(`/api/flashcards?noteId=${note.id}`);
              const flashcardsData = await flashcardsResponse.json();
              return {
                ...note,
                flashcardCount: flashcardsData.success ? flashcardsData.flashcards.length : 0,
              };
            } catch {
              return { ...note, flashcardCount: 0 };
            }
          })
        );
        setNotes(notesWithCounts);
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">My Notes</h1>
            <p className="text-muted-foreground mt-2">
              All your generated study notes in one place
            </p>
          </div>
          <Button onClick={() => router.push("/dashboard/upload")}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Note
          </Button>
        </div>

        {notes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload a document to generate your first set of study notes
              </p>
              <Button onClick={() => router.push("/dashboard/upload")}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/dashboard/notes/${note.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <span className="line-clamp-2">{note.title}</span>
                  </CardTitle>
                  {note.originalFileName && (
                    <CardDescription className="text-xs">
                      From: {note.originalFileName}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(note.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    {note.flashcardCount !== undefined && note.flashcardCount > 0 && (
                      <div className="flex items-center text-sm text-primary">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {note.flashcardCount} cards
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
