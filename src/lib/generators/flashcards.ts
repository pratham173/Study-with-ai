import { NoteContent, Flashcard } from "@/types/index";

type FlashcardData = Omit<Flashcard, 'id' | 'createdAt' | 'noteId' | 'userId'>;

export function generateFlashcards(noteContent: NoteContent): FlashcardData[] {
  const flashcards: FlashcardData[] = [];

  // Generate flashcards from definitions (BASIC difficulty)
  noteContent.definitions.forEach((def) => {
    flashcards.push({
      question: `What is ${def.term}?`,
      answer: def.definition,
      difficulty: 'BASIC',
    });
  });

  // Generate flashcards from formulas (INTERMEDIATE difficulty)
  noteContent.formulas.forEach((formula) => {
    // Formula question
    flashcards.push({
      question: `Write the formula for: ${formula.explanation}`,
      answer: formula.latex,
      difficulty: 'INTERMEDIATE',
    });

    // Symbols meaning question
    const symbolsText = formula.symbols.map(s => `${s.symbol} = ${s.meaning}`).join('\n');
    flashcards.push({
      question: `In the formula ${formula.latex}, what do the symbols represent?`,
      answer: symbolsText,
      difficulty: 'INTERMEDIATE',
    });

    // Units question
    flashcards.push({
      question: `What are the units for the formula: ${formula.latex}?`,
      answer: formula.units,
      difficulty: 'BASIC',
    });
  });

  // Generate flashcards from solved problems (ADVANCED difficulty)
  noteContent.solvedProblems.forEach((problem) => {
    const difficulty = problem.level === 'easy' ? 'BASIC' : 
                      problem.level === 'medium' ? 'INTERMEDIATE' : 'ADVANCED';
    
    flashcards.push({
      question: problem.question,
      answer: `${problem.solution}\n\nAnswer: ${problem.answer}`,
      difficulty,
    });
  });

  // Generate flashcards from summary points (BASIC difficulty)
  noteContent.summary.slice(0, 3).forEach((point) => {
    const [concept, ...explanation] = point.split(':');
    if (explanation.length > 0) {
      flashcards.push({
        question: `Explain: ${concept.replace(/\*\*/g, '').trim()}`,
        answer: explanation.join(':').trim(),
        difficulty: 'BASIC',
      });
    }
  });

  // Generate flashcards from real-life applications (INTERMEDIATE difficulty)
  noteContent.realLifeApplications.slice(0, 2).forEach((app) => {
    const [title, ...description] = app.split(':');
    if (description.length > 0) {
      flashcards.push({
        question: `Describe the application of this concept in: ${title.replace(/\*\*/g, '').trim()}`,
        answer: description.join(':').trim(),
        difficulty: 'INTERMEDIATE',
      });
    }
  });

  return flashcards;
}
