export interface NoteContent {
  briefOverview: string;
  definitions: Definition[];
  formulas: Formula[];
  howToUse: string;
  solvedProblems: SolvedProblem[];
  realLifeApplications: string[];
  summary: string[];
  formulaSheet: string[];
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Formula {
  latex: string;
  explanation: string;
  symbols: SymbolExplanation[];
  units: string;
  significance: string;
}

export interface SymbolExplanation {
  symbol: string;
  meaning: string;
}

export interface SolvedProblem {
  level: 'easy' | 'medium' | 'tough';
  question: string;
  solution: string;
  answer: string;
}

export interface Flashcard {
  id: string;
  noteId: string;
  userId: string;
  question: string;
  answer: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  createdAt: Date;
}

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: NoteContent;
  originalFileName?: string;
  fileType?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Theme = 'light' | 'dark' | 'solarized' | 'high-contrast';
