"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronLeft, ChevronRight, Filter, Loader2, BookOpen } from "lucide-react";

interface FlashcardData {
  id: string;
  question: string;
  answer: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  noteId: string;
  note?: {
    id: string;
    title: string;
  };
}

type DifficultyFilter = 'ALL' | 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';

function FlashcardsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get('noteId');
  
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('ALL');
  const [studyMode, setStudyMode] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, [noteIdParam]);

  const fetchFlashcards = async () => {
    try {
      const url = noteIdParam 
        ? `/api/flashcards?noteId=${noteIdParam}`
        : '/api/flashcards';
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setFlashcards(data.flashcards);
      }
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlashcards = flashcards.filter(
    fc => difficultyFilter === 'ALL' || fc.difficulty === difficultyFilter
  );

  const currentCard = filteredFlashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredFlashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredFlashcards.length) % filteredFlashcards.length);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BASIC':
        return 'bg-green-500';
      case 'INTERMEDIATE':
        return 'bg-yellow-500';
      case 'ADVANCED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const groupedFlashcards = flashcards.reduce((acc, fc) => {
    const noteTitle = fc.note?.title || 'Unknown Note';
    if (!acc[noteTitle]) {
      acc[noteTitle] = [];
    }
    acc[noteTitle].push(fc);
    return acc;
  }, {} as Record<string, FlashcardData[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/notes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Card className="mt-6">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No flashcards yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate flashcards from your notes to start studying
              </p>
              <Button onClick={() => router.push("/dashboard/notes")}>
                Go to Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (studyMode && filteredFlashcards.length > 0) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStudyMode(false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Study Mode
            </Button>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-white text-sm ${getDifficultyColor(currentCard.difficulty)}`}>
                {currentCard.difficulty}
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Card {currentIndex + 1} of {filteredFlashcards.length}
          </div>

          {/* Flashcard */}
          <div 
            className="relative h-96 cursor-pointer perspective-1000"
            onClick={handleFlip}
          >
            <div 
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <Card 
                className={`absolute w-full h-full backface-hidden ${!isFlipped ? 'z-10' : ''}`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <CardContent className="h-full flex flex-col items-center justify-center p-8">
                  <p className="text-xs text-muted-foreground mb-4">QUESTION</p>
                  <p className="text-xl text-center">{currentCard.question}</p>
                  <p className="text-sm text-muted-foreground mt-8">Click to reveal answer</p>
                </CardContent>
              </Card>

              {/* Back */}
              <Card 
                className={`absolute w-full h-full backface-hidden ${isFlipped ? 'z-10' : ''}`}
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <CardContent className="h-full flex flex-col items-center justify-center p-8">
                  <p className="text-xs text-muted-foreground mb-4">ANSWER</p>
                  <p className="text-lg text-center whitespace-pre-line">{currentCard.answer}</p>
                  <p className="text-sm text-muted-foreground mt-8">Click to see question</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handlePrevious}
              disabled={filteredFlashcards.length <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleNext}
              disabled={filteredFlashcards.length <= 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / filteredFlashcards.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/notes")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">Flashcards</h1>
              <p className="text-muted-foreground mt-1">
                {flashcards.length} flashcards available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={difficultyFilter === 'ALL' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter('ALL')}
            >
              All
            </Button>
            <Button
              variant={difficultyFilter === 'BASIC' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter('BASIC')}
            >
              Basic
            </Button>
            <Button
              variant={difficultyFilter === 'INTERMEDIATE' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter('INTERMEDIATE')}
            >
              Intermediate
            </Button>
            <Button
              variant={difficultyFilter === 'ADVANCED' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDifficultyFilter('ADVANCED')}
            >
              Advanced
            </Button>
          </div>
        </div>

        {filteredFlashcards.length > 0 && (
          <Button onClick={() => setStudyMode(true)} size="lg" className="w-full">
            <BookOpen className="mr-2 h-5 w-5" />
            Start Study Mode ({filteredFlashcards.length} cards)
          </Button>
        )}

        {noteIdParam ? (
          <div className="space-y-4">
            {filteredFlashcards.map((card, index) => (
              <Card key={card.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Card {index + 1}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${getDifficultyColor(card.difficulty)}`}>
                      {card.difficulty}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Question:</p>
                    <p>{card.question}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Answer:</p>
                    <p className="whitespace-pre-line">{card.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedFlashcards).map(([noteTitle, cards]) => {
              const filteredCards = cards.filter(
                fc => difficultyFilter === 'ALL' || fc.difficulty === difficultyFilter
              );
              
              if (filteredCards.length === 0) return null;

              return (
                <Card key={noteTitle}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{noteTitle}</span>
                      <span className="text-sm text-muted-foreground font-normal">
                        {filteredCards.length} cards
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {filteredCards.slice(0, 3).map((card, index) => (
                      <div key={card.id} className="border-l-4 border-primary pl-4 py-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm flex-1">{card.question}</p>
                          <span className={`px-2 py-1 rounded text-white text-xs whitespace-nowrap ${getDifficultyColor(card.difficulty)}`}>
                            {card.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                    {filteredCards.length > 3 && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push(`/dashboard/flashcards?noteId=${cards[0].noteId}`)}
                      >
                        View all {filteredCards.length} cards
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <FlashcardsContent />
    </Suspense>
  );
}
