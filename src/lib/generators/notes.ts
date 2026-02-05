import { NoteContent, Definition, Formula, SolvedProblem } from "@/types/index";

export function generateNotes(content: string, title: string): NoteContent {
  const topic = extractTopic(title, content);
  
  return {
    briefOverview: generateBriefOverview(topic),
    definitions: generateDefinitions(topic),
    formulas: generateFormulas(topic),
    howToUse: generateHowToUse(topic),
    solvedProblems: generateSolvedProblems(topic),
    realLifeApplications: generateRealLifeApplications(topic),
    summary: generateSummary(topic),
    formulaSheet: generateFormulaSheet(topic),
  };
}

function extractTopic(title: string, content: string): string {
  const cleanTitle = title.replace(/\.(pdf|docx|txt|ppt|pptx|jpg|png)$/i, '').trim();
  if (cleanTitle.length > 5) return cleanTitle;
  
  const lines = content.split('\n').filter(line => line.trim().length > 0);
  return lines[0]?.substring(0, 100) || 'Physics Concepts';
}

function generateBriefOverview(topic: string): string {
  return `This study material covers fundamental concepts related to ${topic}.

The topic is essential for understanding core principles in physics and mathematics. It has practical applications in engineering, technology, and everyday phenomena.

Key concepts include mathematical relationships, physical interpretations, and problem-solving techniques. The material is designed for students preparing for competitive exams and academic assessments.

By mastering this topic, you will develop strong analytical skills and be able to apply theoretical knowledge to real-world scenarios.`;
}

function generateDefinitions(topic: string): Definition[] {
  return [
    {
      term: "Primary Concept",
      definition: `The fundamental principle underlying ${topic}, which describes the relationship between physical quantities and their behavior.`
    },
    {
      term: "Physical Quantity",
      definition: "A measurable property of a physical system, expressed in standard units with magnitude and sometimes direction."
    },
    {
      term: "SI Unit",
      definition: "International System of Units - the modern form of the metric system used worldwide for scientific measurements."
    },
    {
      term: "Vector Quantity",
      definition: "A physical quantity that has both magnitude and direction, such as velocity, force, or displacement."
    },
    {
      term: "Scalar Quantity",
      definition: "A physical quantity that has only magnitude and no direction, such as mass, temperature, or energy."
    }
  ];
}

function generateFormulas(topic: string): Formula[] {
  return [
    {
      latex: "F = ma",
      explanation: "Newton's Second Law of Motion - Force equals mass times acceleration",
      symbols: [
        { symbol: "F", meaning: "Net force acting on the object" },
        { symbol: "m", meaning: "Mass of the object" },
        { symbol: "a", meaning: "Acceleration produced" }
      ],
      units: "Force (F): Newton (N) or kg⋅m/s², Mass (m): kilogram (kg), Acceleration (a): m/s²",
      significance: "This fundamental equation establishes the relationship between force, mass, and acceleration. It shows that force is directly proportional to both mass and acceleration, forming the basis of classical mechanics."
    },
    {
      latex: "E = mc^2",
      explanation: "Einstein's Mass-Energy Equivalence",
      symbols: [
        { symbol: "E", meaning: "Energy equivalent" },
        { symbol: "m", meaning: "Mass of the object" },
        { symbol: "c", meaning: "Speed of light in vacuum (3×10⁸ m/s)" }
      ],
      units: "Energy (E): Joule (J) or kg⋅m²/s², Mass (m): kilogram (kg)",
      significance: "This equation reveals that mass and energy are interchangeable. Even a small amount of mass contains enormous energy, explaining nuclear reactions and stellar processes."
    },
    {
      latex: "v = u + at",
      explanation: "First equation of motion for uniformly accelerated motion",
      symbols: [
        { symbol: "v", meaning: "Final velocity" },
        { symbol: "u", meaning: "Initial velocity" },
        { symbol: "a", meaning: "Constant acceleration" },
        { symbol: "t", meaning: "Time elapsed" }
      ],
      units: "Velocity (v, u): m/s, Acceleration (a): m/s², Time (t): second (s)",
      significance: "This equation helps calculate final velocity when an object undergoes constant acceleration. Essential for analyzing motion in one dimension."
    }
  ];
}

function generateHowToUse(topic: string): string {
  return `**Step-by-Step Approach to Solving Problems:**

**Step 1: Identify Given Information**
- Read the problem carefully and list all given values
- Note the units of each quantity
- Identify what needs to be found

**Step 2: Choose the Right Formula**
- Analyze which physical quantities are involved
- Select the formula that connects given and unknown quantities
- For F = ma, you need at least two of the three variables

**Step 3: Convert Units if Necessary**
- Ensure all quantities are in SI units
- Convert grams to kilograms, cm to meters, etc.
- Maintain consistency throughout calculations

**Step 4: Substitute and Solve**
- Substitute numerical values into the formula
- Perform calculations step by step
- Keep track of units during calculation

**Step 5: Verify the Answer**
- Check if units are correct
- Verify if the answer makes physical sense
- Compare magnitude with expected range

**Common Mistakes to Avoid:**
- Mixing different unit systems
- Forgetting to square or take square root where needed
- Incorrect sign conventions for vectors
- Not converting all values to SI units before calculation
- Rounding intermediate results too early`;
}

function generateSolvedProblems(topic: string): SolvedProblem[] {
  return [
    {
      level: "easy",
      question: "A force of 20 N is applied to an object of mass 5 kg. Calculate the acceleration produced.",
      solution: `**Given:**
- Force, F = 20 N
- Mass, m = 5 kg

**To find:** Acceleration, a

**Formula:** F = ma

**Solution:**
Rearranging the formula: a = F/m

Substituting values:
a = 20/5
a = 4 m/s²`,
      answer: "\\boxed{a = 4 \\text{ m/s}^2}"
    },
    {
      level: "easy",
      question: "An object starting from rest accelerates at 2 m/s² for 5 seconds. Find its final velocity.",
      solution: `**Given:**
- Initial velocity, u = 0 m/s (starting from rest)
- Acceleration, a = 2 m/s²
- Time, t = 5 s

**To find:** Final velocity, v

**Formula:** v = u + at

**Solution:**
Substituting values:
v = 0 + (2)(5)
v = 10 m/s`,
      answer: "\\boxed{v = 10 \\text{ m/s}}"
    },
    {
      level: "medium",
      question: "A car of mass 1200 kg accelerates from rest to 30 m/s in 10 seconds. Calculate the net force acting on the car.",
      solution: `**Given:**
- Mass, m = 1200 kg
- Initial velocity, u = 0 m/s
- Final velocity, v = 30 m/s
- Time, t = 10 s

**To find:** Net force, F

**Step 1:** Calculate acceleration
Using v = u + at
30 = 0 + a(10)
a = 30/10 = 3 m/s²

**Step 2:** Calculate force
Using F = ma
F = 1200 × 3
F = 3600 N`,
      answer: "\\boxed{F = 3600 \\text{ N}}"
    },
    {
      level: "medium",
      question: "Two forces of 8 N and 6 N act perpendicular to each other on an object. Find the magnitude of the resultant force.",
      solution: `**Given:**
- Force 1, F₁ = 8 N
- Force 2, F₂ = 6 N
- Angle between forces = 90°

**To find:** Resultant force, F

**Formula:** For perpendicular forces: F = √(F₁² + F₂²)

**Solution:**
F = √(8² + 6²)
F = √(64 + 36)
F = √100
F = 10 N`,
      answer: "\\boxed{F = 10 \\text{ N}}"
    },
    {
      level: "tough",
      question: "A block of mass 10 kg is pulled by a force of 50 N at an angle of 37° with the horizontal. If the coefficient of friction is 0.3, find the acceleration of the block. (Take g = 10 m/s², sin 37° = 0.6, cos 37° = 0.8)",
      solution: `**Given:**
- Mass, m = 10 kg
- Applied force, F = 50 N at 37°
- Coefficient of friction, μ = 0.3
- g = 10 m/s²

**To find:** Acceleration, a

**Step 1:** Resolve applied force
Horizontal component: Fₓ = F cos 37° = 50 × 0.8 = 40 N
Vertical component: Fᵧ = F sin 37° = 50 × 0.6 = 30 N

**Step 2:** Calculate normal force
N = mg - Fᵧ = 10(10) - 30 = 70 N

**Step 3:** Calculate friction force
f = μN = 0.3 × 70 = 21 N

**Step 4:** Calculate net horizontal force
Fₙₑₜ = Fₓ - f = 40 - 21 = 19 N

**Step 5:** Calculate acceleration
a = Fₙₑₜ/m = 19/10 = 1.9 m/s²`,
      answer: "\\boxed{a = 1.9 \\text{ m/s}^2}"
    },
    {
      level: "tough",
      question: "Two masses m₁ = 5 kg and m₂ = 3 kg are connected by a string passing over a frictionless pulley. Find the acceleration of the system and tension in the string. (Take g = 10 m/s²)",
      solution: `**Given:**
- Mass 1, m₁ = 5 kg
- Mass 2, m₂ = 3 kg
- g = 10 m/s²

**To find:** Acceleration (a) and Tension (T)

**Step 1:** Apply Newton's second law to m₁ (heavier mass, moving down)
m₁g - T = m₁a
5(10) - T = 5a
50 - T = 5a ... (1)

**Step 2:** Apply Newton's second law to m₂ (lighter mass, moving up)
T - m₂g = m₂a
T - 3(10) = 3a
T - 30 = 3a ... (2)

**Step 3:** Add equations (1) and (2)
50 - T + T - 30 = 5a + 3a
20 = 8a
a = 2.5 m/s²

**Step 4:** Substitute in equation (2)
T - 30 = 3(2.5)
T = 37.5 N`,
      answer: "\\boxed{a = 2.5 \\text{ m/s}^2, \\, T = 37.5 \\text{ N}}"
    }
  ];
}

function generateRealLifeApplications(topic: string): string[] {
  return [
    "**Automobile Safety Systems:** Airbags and seatbelts use principles of force and acceleration to protect passengers during collisions. The rapid deceleration is controlled to minimize injury.",
    "**Rocket Propulsion:** Space agencies apply Newton's laws to calculate the force needed to launch rockets. The relationship F = ma determines thrust requirements for different payload masses.",
    "**Elevator Design:** Engineers use force and acceleration calculations to design safe elevator systems. The maximum load capacity and acceleration limits ensure passenger comfort and cable strength.",
    "**Sports Physics:** Athletes use understanding of force and motion to improve performance. Shot put, javelin throw, and long jump all involve optimizing force application and trajectory.",
    "**Bridge and Building Construction:** Structural engineers calculate forces acting on buildings and bridges to ensure they can withstand loads, wind forces, and seismic activities.",
    "**Medical Applications:** Understanding force and pressure helps in designing prosthetics, surgical instruments, and physical therapy equipment. Blood pressure measurement also relies on force principles."
  ];
}

function generateSummary(topic: string): string[] {
  return [
    "**Core Concept:** Force is the product of mass and acceleration (F = ma), establishing fundamental relationship in mechanics",
    "**Units Matter:** Always use SI units - Force in Newtons (N), mass in kilograms (kg), acceleration in m/s²",
    "**Direct Proportionality:** Force is directly proportional to both mass and acceleration",
    "**Problem-Solving Steps:** Identify given values → Choose correct formula → Convert to SI units → Substitute → Verify answer",
    "**Common Applications:** Vehicle dynamics, rocket science, structural engineering, sports biomechanics",
    "**Vector Nature:** Force and acceleration are vector quantities (have direction), mass is scalar",
    "**Newton's Laws:** Second law forms the foundation for classical mechanics and motion analysis",
    "**Real-World Impact:** Understanding force-mass-acceleration relationship is crucial for engineering design and safety systems",
    "**Key Formulas:** F = ma (Newton's 2nd Law), v = u + at (equations of motion), E = mc² (mass-energy equivalence)",
    "**Exam Strategy:** Practice problems at all difficulty levels, focus on unit conversion, and understand physical significance"
  ];
}

function generateFormulaSheet(topic: string): string[] {
  return [
    "F = ma",
    "v = u + at",
    "s = ut + \\frac{1}{2}at^2",
    "v^2 = u^2 + 2as",
    "E = mc^2",
    "W = Fs\\cos\\theta",
    "P = \\frac{W}{t}",
    "KE = \\frac{1}{2}mv^2",
    "PE = mgh",
    "p = mv",
    "F_{net} = \\frac{dp}{dt}",
    "F_f = \\mu N"
  ];
}
