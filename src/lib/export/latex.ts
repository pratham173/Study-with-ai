import { NoteContent } from '@/types/index';

export function generateLatex(title: string, content: NoteContent): string {
  let latex = `\\documentclass[12pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}

\\geometry{margin=1in}
\\title{${escapeLatex(title)}}
\\author{Study with AI}
\\date{\\today}

\\begin{document}

\\maketitle
\\tableofcontents
\\newpage

\\section{Brief Overview}
${escapeLatex(content.briefOverview)}

\\section{Important Definitions}
\\begin{description}
${content.definitions.map(def => 
  `\\item[${escapeLatex(def.term)}] ${escapeLatex(def.definition)}`
).join('\n')}
\\end{description}

\\section{Formulas}
${content.formulas.map((formula, index) => {
  return `\\subsection{Formula ${index + 1}}
\\begin{equation}
${formula.latex}
\\end{equation}

${escapeLatex(formula.explanation)}

\\textbf{Where:}
\\begin{itemize}
${formula.symbols.map(sym => 
  `\\item $${sym.symbol}$ = ${escapeLatex(sym.meaning)}`
).join('\n')}
\\end{itemize}

\\textbf{Units:} ${escapeLatex(formula.units)}

\\textbf{Significance:} ${escapeLatex(formula.significance)}
`;
}).join('\n')}

\\section{How to Use the Formula}
${escapeLatex(content.howToUse)}

\\section{Solved Problems}
${generateProblems(content.solvedProblems)}

\\section{Real Life Applications}
\\begin{enumerate}
${content.realLifeApplications.map(app => 
  `\\item ${escapeLatex(app)}`
).join('\n')}
\\end{enumerate}

\\section{Summary}
\\begin{itemize}
${content.summary.map(item => 
  `\\item ${escapeLatex(item)}`
).join('\n')}
\\end{itemize}

\\section{Compiled Formula Sheet}
${content.formulaSheet.map((formula, index) => 
  `\\begin{equation}\n${formula}\n\\end{equation}`
).join('\n')}

\\end{document}`;

  return latex;
}

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function generateProblems(problems: any[]): string {
  const grouped = {
    easy: problems.filter(p => p.level === 'easy'),
    medium: problems.filter(p => p.level === 'medium'),
    tough: problems.filter(p => p.level === 'tough'),
  };

  let result = '';
  
  if (grouped.easy.length > 0) {
    result += '\\subsection{Easy Problems}\n';
    result += grouped.easy.map((p, i) => 
      `\\textbf{Question ${i + 1}:} ${escapeLatex(p.question)}

\\textbf{Solution:}
${escapeLatex(p.solution)}

\\textbf{Answer:} $${p.answer.replace(/^\\\\boxed\\{/, '').replace(/\\}$/, '')}$
`).join('\n\n');
  }

  if (grouped.medium.length > 0) {
    result += '\\subsection{Medium Problems}\n';
    result += grouped.medium.map((p, i) => 
      `\\textbf{Question ${i + 1}:} ${escapeLatex(p.question)}

\\textbf{Solution:}
${escapeLatex(p.solution)}

\\textbf{Answer:} $${p.answer.replace(/^\\\\boxed\\{/, '').replace(/\\}$/, '')}$
`).join('\n\n');
  }

  if (grouped.tough.length > 0) {
    result += '\\subsection{Tough Problems}\n';
    result += grouped.tough.map((p, i) => 
      `\\textbf{Question ${i + 1}:} ${escapeLatex(p.question)}

\\textbf{Solution:}
${escapeLatex(p.solution)}

\\textbf{Answer:} $${p.answer.replace(/^\\\\boxed\\{/, '').replace(/\\}$/, '')}$
`).join('\n\n');
  }

  return result;
}
