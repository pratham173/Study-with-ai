"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { NoteContent } from "@/types/index";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface Note {
  id: string;
  title: string;
  content: NoteContent;
  createdAt: string;
}

export default function NoteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['overview', 'definitions', 'formulas', 'howToUse', 'problems', 'applications', 'summary', 'formulaSheet'])
  );

  useEffect(() => {
    fetchNote();
  }, [noteId]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}`);
      const data = await response.json();

      if (data.success) {
        setNote(data.note);
      } else {
        setError(data.error || "Failed to load note");
      }
    } catch (err) {
      setError("Failed to load note");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="p-6">
              <p className="text-destructive">{error || "Note not found"}</p>
              <Button onClick={() => router.push("/dashboard/notes")} className="mt-4">
                Back to Notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const SectionHeader = ({ title, sectionKey }: { title: string; sectionKey: string }) => (
    <div
      className="flex items-center justify-between cursor-pointer select-none"
      onClick={() => toggleSection(sectionKey)}
    >
      <h2 className="text-2xl font-bold">{title}</h2>
      {expandedSections.has(sectionKey) ? (
        <ChevronUp className="h-5 w-5" />
      ) : (
        <ChevronDown className="h-5 w-5" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/notes")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold">{note.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Created on {new Date(note.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Brief Overview */}
        <Card>
          <CardHeader>
            <SectionHeader title="1. Brief Overview" sectionKey="overview" />
          </CardHeader>
          {expandedSections.has('overview') && (
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{note.content.briefOverview}</p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 2: Important Definitions */}
        <Card>
          <CardHeader>
            <SectionHeader title="2. Important Definitions" sectionKey="definitions" />
          </CardHeader>
          {expandedSections.has('definitions') && (
            <CardContent>
              <div className="space-y-4">
                {note.content.definitions.map((def, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h3 className="font-bold text-lg">{def.term}</h3>
                    <p className="text-muted-foreground mt-1">{def.definition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 3: Formulas */}
        <Card>
          <CardHeader>
            <SectionHeader title="3. Formulas Section" sectionKey="formulas" />
          </CardHeader>
          {expandedSections.has('formulas') && (
            <CardContent>
              <div className="space-y-6">
                {note.content.formulas.map((formula, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="text-center text-2xl py-2">
                      <BlockMath math={formula.latex} />
                    </div>
                    <p className="font-semibold">{formula.explanation}</p>
                    
                    <div className="space-y-1">
                      <p className="font-medium">Where:</p>
                      <ul className="list-none space-y-1 ml-4">
                        {formula.symbols.map((sym, i) => (
                          <li key={i}>
                            <InlineMath math={sym.symbol} /> = {sym.meaning}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p><span className="font-medium">Units:</span> {formula.units}</p>
                    <p><span className="font-medium">Significance:</span> {formula.significance}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 4: How to Use the Formula */}
        <Card>
          <CardHeader>
            <SectionHeader title="4. How to Use the Formula" sectionKey="howToUse" />
          </CardHeader>
          {expandedSections.has('howToUse') && (
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-line">{note.content.howToUse}</div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 5: Solved Problems */}
        <Card>
          <CardHeader>
            <SectionHeader title="5. Solved Problems" sectionKey="problems" />
          </CardHeader>
          {expandedSections.has('problems') && (
            <CardContent>
              <div className="space-y-6">
                {['easy', 'medium', 'tough'].map((level) => {
                  const problems = note.content.solvedProblems.filter(p => p.level === level);
                  if (problems.length === 0) return null;
                  
                  return (
                    <div key={level}>
                      <h3 className="text-xl font-bold mb-3 capitalize">
                        {level === 'easy' ? '📗 Easy' : level === 'medium' ? '📘 Medium' : '📕 Tough'} Problems
                      </h3>
                      <div className="space-y-4">
                        {problems.map((problem, index) => (
                          <div key={index} className="border rounded-lg p-4 space-y-3">
                            <p className="font-semibold">Question {index + 1}:</p>
                            <p>{problem.question}</p>
                            <div className="bg-muted/50 rounded p-3">
                              <p className="font-medium mb-2">Solution:</p>
                              <div className="whitespace-pre-line text-sm">{problem.solution}</div>
                            </div>
                            <div className="bg-primary/10 rounded p-3 text-center">
                              <p className="font-medium mb-1">Answer:</p>
                              <BlockMath math={problem.answer.replace(/^\\boxed\{/, '').replace(/\}$/, '')} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 6: Real Life Applications */}
        <Card>
          <CardHeader>
            <SectionHeader title="6. Real Life Applications" sectionKey="applications" />
          </CardHeader>
          {expandedSections.has('applications') && (
            <CardContent>
              <div className="space-y-4">
                {note.content.realLifeApplications.map((app, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <p>{app}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Section 7: Summary */}
        <Card>
          <CardHeader>
            <SectionHeader title="7. Summary" sectionKey="summary" />
          </CardHeader>
          {expandedSections.has('summary') && (
            <CardContent>
              <ul className="space-y-2">
                {note.content.summary.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>

        {/* Section 8: Compiled Formula Sheet */}
        <Card>
          <CardHeader>
            <SectionHeader title="8. Compiled Formula Sheet" sectionKey="formulaSheet" />
          </CardHeader>
          {expandedSections.has('formulaSheet') && (
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                {note.content.formulaSheet.map((formula, index) => (
                  <div key={index} className="text-center text-lg py-1 border-b last:border-b-0">
                    <BlockMath math={formula} />
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
