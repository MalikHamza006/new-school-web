/**
 * Sample question banks and pure helpers for the Paper Generator demo.
 *
 * WHAT THESE QUESTIONS ARE
 * ------------------------
 * Hand-written *sample* questions, not syllabus-verified material. They are
 * labelled "Demo Mode — Sample Questions" everywhere they appear, and the
 * school has not approved them for real assessment. The point is to show what a
 * generated paper looks like, with genuinely subject-shaped content, without
 * pretending the demo knows any particular class syllabus.
 *
 * Each question carries the inclusive class range it suits (`classes`) and a
 * `difficulty`, so a class-9 Physics paper does not come back full of class-6
 * questions. Selection is deterministic (see `paperGeneratorService`).
 */
import type {
  BankChoiceQuestion,
  BankWrittenQuestion,
  ClassName,
  Difficulty,
  MarksPlan,
  MarksPlanResult,
  PaperFormInput,
  PaperType,
  SubjectName,
  SubjectBank,
} from './paperGeneratorTypes';

/* ------------------------------------------------------------------ */
/* Options offered by the form                                        */
/* ------------------------------------------------------------------ */

export const CLASS_OPTIONS: readonly ClassName[] = ['6', '7', '8', '9', '10', '11', '12'];

export const SUBJECT_OPTIONS: readonly SubjectName[] = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Urdu',
];

export const PAPER_TYPE_OPTIONS: readonly PaperType[] = [
  'Weekly Test',
  'Monthly Test',
  'Midterm',
  'Final Exam',
];

export const DIFFICULTY_OPTIONS: readonly Difficulty[] = ['Easy', 'Medium', 'Hard'];

/**
 * Upper bounds on how many questions a single paper may ask. They exist because
 * the sample bank is finite: asking for more than the bank holds would silently
 * pad the paper, which is worse than telling the teacher the limit.
 */
export const MAX_MCQ = 10;
export const MAX_SHORT = 6;
export const MAX_LONG = 4;

/* ------------------------------------------------------------------ */
/* Bank factories (local, to keep the data readable)                  */
/* ------------------------------------------------------------------ */

function mcq(
  id: string,
  text: string,
  options: readonly string[],
  answerIndex: number,
  classes: readonly [number, number],
  difficulty: Difficulty,
  explanation: string
): BankChoiceQuestion {
  return { id, text, options, answerIndex, classes, difficulty, explanation };
}

function written(
  id: string,
  text: string,
  answer: string,
  classes: readonly [number, number],
  difficulty: Difficulty
): BankWrittenQuestion {
  return { id, text, answer, classes, difficulty };
}

/* ------------------------------------------------------------------ */
/* Question banks                                                     */
/* ------------------------------------------------------------------ */

export const questionBanks: Record<SubjectName, SubjectBank> = {
  'Computer Science': {
    mcq: [
      mcq('cs1', 'Which of the following is an input device?', ['Keyboard', 'Printer', 'Monitor', 'Speaker'], 0, [6, 8], 'Easy', 'A keyboard sends data into the computer; the others output it.'),
      mcq('cs2', 'One byte is equal to how many bits?', ['4', '8', '16', '32'], 1, [6, 8], 'Easy', 'One byte contains eight bits.'),
      mcq('cs3', 'Which of the following is system software?', ['Windows', 'MS Word', 'Photos', 'Web browser'], 0, [6, 10], 'Medium', 'An operating system manages the computer itself; the others are application software.'),
      mcq('cs4', 'HTML stands for:', ['HyperText Markup Language', 'High Text Machine Language', 'Hyper Transfer Markup Link', 'Home Tool Markup Language'], 0, [9, 12], 'Medium', 'HTML is the markup language used to structure web pages.'),
      mcq('cs5', 'Which data type stores only true or false?', ['Integer', 'String', 'Boolean', 'Float'], 2, [9, 12], 'Easy', 'A Boolean holds one of two values: true or false.'),
      mcq('cs6', 'The CPU is often called the ______ of the computer.', ['brain', 'memory', 'display', 'storage'], 0, [6, 9], 'Easy', 'The CPU carries out the instructions that control the whole system.'),
      mcq('cs7', 'Which network connects computers within a single building?', ['LAN', 'WAN', 'MAN', 'Internet'], 0, [9, 12], 'Medium', 'A Local Area Network covers a small area such as one building.'),
      mcq('cs8', 'The binary number 1010 equals which decimal number?', ['8', '10', '12', '14'], 1, [9, 11], 'Medium', '1010 = 8 + 0 + 2 + 0 = 10.'),
      mcq('cs9', 'Which of the following is a programming language?', ['HTML', 'Python', 'HTTP', 'FTP'], 1, [10, 12], 'Medium', 'Python is a general-purpose programming language; the others are markup or protocols.'),
      mcq('cs10', 'A collection of related records is called a:', ['field', 'record', 'file', 'bit'], 2, [10, 12], 'Hard', 'Related records together form a file.'),
    ],
    short: [
      written('cs-s1', 'Define a computer and state two of its main functions.', 'A computer is an electronic device that accepts data, processes it according to instructions and produces output. Main functions: input, processing, storage and output of data.', [6, 8], 'Easy'),
      written('cs-s2', 'Differentiate between hardware and software with one example each.', 'Hardware is the physical part of a computer (e.g. keyboard); software is the set of programs that tell the hardware what to do (e.g. MS Word).', [6, 9], 'Easy'),
      written('cs-s3', 'What is an algorithm? Write one simple example.', 'An algorithm is a step-by-step set of instructions to solve a problem. Example: to add two numbers — take the two numbers, add them, display the result.', [9, 10], 'Medium'),
      written('cs-s4', 'Name any three input devices and give one use of each.', 'Keyboard — typing text; mouse — pointing and clicking; scanner — converting a paper document into digital form.', [6, 8], 'Easy'),
      written('cs-s5', 'Explain the difference between RAM and ROM.', 'RAM is temporary, read/write memory that holds data while the computer is on. ROM is permanent, read-only memory that stores the start-up instructions.', [9, 12], 'Medium'),
      written('cs-s6', 'What is a variable in programming? Give one example.', 'A variable is a named storage location whose value can change while a program runs. Example: age = 15.', [10, 12], 'Medium'),
    ],
    long: [
      written('cs-l1', 'Draw and explain the block diagram of a computer system, describing the function of each unit.', 'The block diagram shows input unit, CPU (control unit, arithmetic logic unit, registers), memory unit and output unit. Input devices feed data; the control unit coordinates; the ALU performs calculations; memory stores data and instructions; the output unit presents results.', [9, 10], 'Medium'),
      written('cs-l2', 'Explain the three basic control structures used in programming, with an example of each.', 'Sequence — instructions run one after another. Selection — a condition chooses between paths (if/else). Repetition — a block repeats while a condition holds (loops). Each is illustrated with a short example.', [10, 12], 'Hard'),
      written('cs-l3', 'Describe the stages of the software development life cycle in order.', 'Requirement gathering, analysis, design, implementation (coding), testing, deployment and maintenance. Each stage produces an output that feeds the next.', [11, 12], 'Hard'),
      written('cs-l4', 'Discuss the advantages and disadvantages of computer networks.', 'Advantages: resource sharing, communication, centralised data and backup. Disadvantages: security risks, cost of setup and maintenance, and dependency on the network.', [9, 12], 'Medium'),
    ],
  },

  Mathematics: {
    mcq: [
      mcq('m1', 'The value of 7 squared (7²) is:', ['14', '49', '42', '21'], 1, [6, 7], 'Easy', '7 × 7 = 49.'),
      mcq('m2', 'The LCM of 6 and 8 is:', ['24', '12', '48', '16'], 0, [6, 8], 'Easy', 'The lowest common multiple of 6 and 8 is 24.'),
      mcq('m3', 'Simplify: 3x + 5x', ['8x', '15x', '8', '2x'], 0, [7, 9], 'Easy', 'Like terms add: 3x + 5x = 8x.'),
      mcq('m4', 'The sum of the interior angles of a triangle is:', ['90°', '180°', '270°', '360°'], 1, [6, 9], 'Easy', 'The three angles of any triangle add up to 180°.'),
      mcq('m5', 'The square root of 144 is:', ['12', '14', '16', '24'], 0, [6, 8], 'Easy', '12 × 12 = 144.'),
      mcq('m6', 'If f(x) = 2x + 3, then f(4) equals:', ['11', '8', '14', '10'], 0, [9, 10], 'Medium', 'f(4) = 2(4) + 3 = 11.'),
      mcq('m7', 'The derivative of x² with respect to x is:', ['x', '2x', '2', 'x²'], 1, [11, 12], 'Medium', 'By the power rule, d(x²)/dx = 2x.'),
      mcq('m8', 'The value of sin 30° is:', ['1/2', '√3/2', '1', '√2/2'], 0, [10, 12], 'Medium', 'sin 30° = 1/2.'),
      mcq('m9', 'The solution of 2x − 6 = 0 is:', ['x = 3', 'x = −3', 'x = 2', 'x = 6'], 0, [8, 10], 'Easy', '2x = 6, so x = 3.'),
      mcq('m10', 'The area of a circle of radius r is:', ['2πr', 'πr²', 'πd', 'πr'], 1, [8, 10], 'Easy', 'Area of a circle = π × radius².'),
    ],
    short: [
      written('m-s1', 'Solve for x: 5x − 7 = 18.', '5x = 25, therefore x = 5.', [7, 9], 'Easy'),
      written('m-s2', 'Find the HCF and LCM of 12 and 18.', '12 = 2² × 3 and 18 = 2 × 3²; HCF = 6 and LCM = 36.', [6, 8], 'Easy'),
      written('m-s3', 'Factorise: x² − 9.', 'x² − 9 = (x − 3)(x + 3), using the difference of two squares.', [8, 10], 'Medium'),
      written('m-s4', 'State the Pythagoras theorem and give one example.', 'In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: a² + b² = c². Example: a 3-4-5 triangle.', [8, 10], 'Medium'),
      written('m-s5', 'Differentiate x³ + 2x with respect to x.', 'd/dx (x³ + 2x) = 3x² + 2.', [11, 12], 'Medium'),
      written('m-s6', 'Convert 45° into radians.', '45° = 45 × π/180 = π/4 radians.', [10, 12], 'Medium'),
    ],
    long: [
      written('m-l1', 'Prove that the sum of the interior angles of a triangle is 180°.', 'Draw a line through one vertex parallel to the opposite side. Alternate angles give two angles equal to the other two interior angles; these with the vertex angle form a straight line (180°), proving the sum.', [8, 10], 'Medium'),
      written('m-l2', 'Solve the pair of equations by substitution: x + y = 7 and 2x − y = 5.', 'From x + y = 7, y = 7 − x. Substituting: 2x − (7 − x) = 5 → 3x = 12 → x = 4, so y = 3. Solution: x = 4, y = 3.', [9, 10], 'Medium'),
      written('m-l3', 'Find the roots of x² − 5x + 6 = 0 by factorisation.', 'x² − 5x + 6 = (x − 2)(x − 3) = 0, so x = 2 or x = 3.', [10, 11], 'Medium'),
      written('m-l4', 'Using integration, find the area under y = x from x = 0 to x = 3.', 'Area = ∫₀³ x dx = [x²/2]₀³ = 9/2 = 4.5 square units.', [11, 12], 'Hard'),
    ],
  },

  Physics: {
    mcq: [
      mcq('p1', 'The SI unit of force is the:', ['newton', 'joule', 'watt', 'pascal'], 0, [7, 9], 'Easy', 'Force is measured in newtons (N).'),
      mcq('p2', 'Speed is equal to distance divided by:', ['time', 'mass', 'force', 'work'], 0, [6, 8], 'Easy', 'Speed = distance / time.'),
      mcq('p3', 'The acceleration due to gravity on Earth is about:', ['9.8 m/s²', '3.0 m/s²', '12.5 m/s²', '1.6 m/s²'], 0, [9, 12], 'Easy', 'g is approximately 9.8 m/s².'),
      mcq('p4', 'Which of these is a vector quantity?', ['mass', 'speed', 'velocity', 'temperature'], 2, [9, 11], 'Medium', 'Velocity has both magnitude and direction.'),
      mcq('p5', 'Energy stored in a stretched spring is:', ['kinetic', 'elastic potential', 'thermal', 'nuclear'], 1, [7, 10], 'Medium', 'A stretched spring stores elastic potential energy.'),
      mcq('p6', 'Ohm\u2019s law states that V equals:', ['I × R', 'I / R', 'I × R²', 'R² / I'], 0, [9, 12], 'Medium', 'Voltage = current × resistance.'),
      mcq('p7', 'The unit of power is the:', ['watt', 'newton', 'ampere', 'volt'], 0, [7, 10], 'Easy', 'Power is measured in watts (W).'),
      mcq('p8', 'Light travels fastest in:', ['water', 'glass', 'a vacuum', 'air'], 2, [8, 11], 'Medium', 'Light travels fastest in a vacuum.'),
      mcq('p9', 'Force equals mass multiplied by:', ['velocity', 'acceleration', 'distance', 'time'], 1, [9, 12], 'Easy', 'From Newton\u2019s second law, F = m × a.'),
      mcq('p10', 'A device that converts electrical energy into mechanical energy is a:', ['motor', 'generator', 'battery', 'transformer'], 0, [10, 12], 'Medium', 'An electric motor converts electrical energy into motion.'),
    ],
    short: [
      written('p-s1', 'Define speed and state its SI unit.', 'Speed is the distance travelled per unit time. Its SI unit is metres per second (m/s).', [6, 8], 'Easy'),
      written('p-s2', 'State Newton\u2019s first law of motion with one example.', 'An object stays at rest or in uniform motion unless acted on by a resultant force. Example: a book on a table stays at rest until pushed.', [9, 10], 'Medium'),
      written('p-s3', 'Differentiate between distance and displacement.', 'Distance is the total path length (a scalar); displacement is the straight-line change in position with direction (a vector).', [8, 10], 'Medium'),
      written('p-s4', 'What is kinetic energy? Write its formula.', 'Kinetic energy is the energy of a moving body, given by KE = ½mv².', [7, 10], 'Easy'),
      written('p-s5', 'State Ohm\u2019s law and write its mathematical form.', 'The current through a conductor is directly proportional to the voltage across it at constant temperature: V = IR.', [9, 12], 'Medium'),
      written('p-s6', 'Define pressure and give its SI unit.', 'Pressure is force acting normally per unit area. Its SI unit is the pascal (Pa).', [8, 10], 'Easy'),
    ],
    long: [
      written('p-l1', 'State and explain Newton\u2019s three laws of motion, giving one example of each.', 'First law (inertia) — a body resists change in motion. Second law — F = ma. Third law — every action has an equal and opposite reaction. Suitable examples are given for each.', [9, 10], 'Hard'),
      written('p-l2', 'Describe the difference between series and parallel circuits and give one advantage of each.', 'In a series circuit components share one path and the current is the same; an advantage is simplicity. In a parallel circuit components share the voltage; an advantage is that one branch can fail without stopping the others.', [9, 12], 'Medium'),
      written('p-l3', 'Derive the equations of motion for uniformly accelerated motion.', 'Starting from the definitions of acceleration and average velocity, s = vt, v = u + at, s = ut + ½at² and v² = u² + 2as are derived in turn.', [10, 12], 'Hard'),
      written('p-l4', 'Explain the principle of conservation of energy with a suitable example.', 'Energy cannot be created or destroyed, only changed in form. Example: a falling ball converts potential energy into kinetic energy.', [10, 12], 'Medium'),
    ],
  },

  Chemistry: {
    mcq: [
      mcq('c1', 'The chemical formula for water is:', ['H₂O', 'CO₂', 'O₂', 'NaCl'], 0, [6, 8], 'Easy', 'Water is made of two hydrogen atoms and one oxygen atom.'),
      mcq('c2', 'The smallest particle of an element is a(n):', ['atom', 'molecule', 'ion', 'compound'], 0, [6, 9], 'Easy', 'An atom is the smallest particle of an element.'),
      mcq('c3', 'The atomic number of carbon is:', ['6', '12', '14', '8'], 0, [8, 10], 'Medium', 'Carbon has six protons, so its atomic number is 6.'),
      mcq('c4', 'Which gas is essential for combustion?', ['nitrogen', 'oxygen', 'hydrogen', 'argon'], 1, [7, 9], 'Easy', 'Burning needs oxygen.'),
      mcq('c5', 'The pH of a neutral solution is:', ['0', '7', '14', '1'], 1, [9, 12], 'Medium', 'A neutral solution has a pH of 7.'),
      mcq('c6', 'The number of protons in an atom is its:', ['mass number', 'atomic number', 'valency', 'atomic mass'], 1, [9, 12], 'Medium', 'The atomic number equals the number of protons.'),
      mcq('c7', 'Which of these is a noble gas?', ['helium', 'oxygen', 'chlorine', 'nitrogen'], 0, [8, 11], 'Medium', 'Helium belongs to Group 18, the noble gases.'),
      mcq('c8', 'The formula H₂SO₄ represents:', ['sulphuric acid', 'hydrochloric acid', 'nitric acid', 'carbonic acid'], 0, [9, 12], 'Medium', 'H₂SO₄ is sulphuric acid.'),
      mcq('c9', 'A bond formed by sharing electrons is:', ['ionic', 'covalent', 'metallic', 'hydrogen'], 1, [10, 12], 'Medium', 'A covalent bond shares a pair of electrons.'),
      mcq('c10', 'Oxidation is the loss of:', ['electrons', 'protons', 'neutrons', 'mass'], 0, [10, 12], 'Hard', 'Oxidation is loss of electrons (OIL RIG).'),
    ],
    short: [
      written('c-s1', 'Define an element and a compound with one example each.', 'An element is a pure substance of one kind of atom (e.g. oxygen). A compound is two or more elements chemically combined (e.g. water).', [6, 8], 'Easy'),
      written('c-s2', 'Differentiate between a physical and a chemical change.', 'A physical change alters form but not composition and is usually reversible (e.g. melting ice). A chemical change forms a new substance and is usually irreversible (e.g. burning).', [6, 9], 'Easy'),
      written('c-s3', 'What is a chemical formula? Write the formula of common salt.', 'A chemical formula shows the elements and their ratio in a compound. Common salt is NaCl.', [7, 10], 'Easy'),
      written('c-s4', 'State the difference between an acid and a base.', 'An acid gives hydrogen ions (H⁺) in water and has a pH below 7; a base accepts hydrogen ions and has a pH above 7.', [9, 10], 'Medium'),
      written('c-s5', 'Define valency and give the valency of sodium.', 'Valency is the combining power of an atom, equal to the number of electrons gained, lost or shared. Sodium has a valency of 1.', [9, 12], 'Medium'),
      written('c-s6', 'Write the balanced equation for the reaction between hydrogen and oxygen.', '2H₂ + O₂ → 2H₂O.', [10, 12], 'Medium'),
    ],
    long: [
      written('c-l1', 'Describe the structure of an atom and the properties of its sub-atomic particles.', 'An atom has a small, dense nucleus of protons and neutrons, surrounded by electrons in shells. Protons are positive, electrons negative and neutrons neutral; the atom is electrically neutral overall.', [9, 10], 'Medium'),
      written('c-l2', 'Explain the difference between ionic and covalent bonding with examples.', 'Ionic bonding transfers electrons between a metal and a non-metal, forming oppositely charged ions (e.g. NaCl). Covalent bonding shares electron pairs between non-metals (e.g. H₂O).', [10, 12], 'Hard'),
      written('c-l3', 'Write a note on the periodic table, stating how elements are arranged in periods and groups.', 'Elements are arranged by increasing atomic number. Horizontal rows are periods; vertical columns are groups whose members share similar chemical properties. Elements in a group have the same number of outer electrons.', [10, 12], 'Medium'),
      written('c-l4', 'Explain the process of electrolysis with one industrial application.', 'Electrolysis uses a direct current to break an ionic compound into its elements at the electrodes. Industrially it is used to extract aluminium from molten alumina.', [11, 12], 'Hard'),
    ],
  },

  Biology: {
    mcq: [
      mcq('b1', 'The basic unit of life is the:', ['cell', 'tissue', 'organ', 'molecule'], 0, [6, 8], 'Easy', 'All living things are made of cells.'),
      mcq('b2', 'Which organ pumps blood around the body?', ['lungs', 'heart', 'liver', 'kidney'], 1, [6, 8], 'Easy', 'The heart pumps blood.'),
      mcq('b3', 'The green pigment in plants is:', ['chlorophyll', 'haemoglobin', 'chlorine', 'carotene'], 0, [6, 9], 'Easy', 'Chlorophyll traps light energy for photosynthesis.'),
      mcq('b4', 'The powerhouse of the cell is the:', ['nucleus', 'ribosome', 'mitochondrion', 'vacuole'], 2, [8, 11], 'Medium', 'Mitochondria release energy through respiration.'),
      mcq('b5', 'Photosynthesis produces glucose and:', ['nitrogen', 'oxygen', 'carbon dioxide', 'water'], 1, [7, 10], 'Easy', 'Oxygen is released as a by-product.'),
      mcq('b6', 'Which system carries messages around the body?', ['digestive', 'nervous', 'respiratory', 'skeletal'], 1, [6, 9], 'Easy', 'The nervous system carries electrical messages.'),
      mcq('b7', 'The cell division that produces gametes is:', ['mitosis', 'meiosis', 'fusion', 'osmosis'], 1, [10, 12], 'Medium', 'Meiosis produces sex cells with half the chromosome number.'),
      mcq('b8', 'Blood is carried away from the heart by:', ['veins', 'arteries', 'capillaries', 'nerves'], 1, [8, 11], 'Medium', 'Arteries carry blood away from the heart.'),
      mcq('b9', 'The study of heredity is called:', ['ecology', 'genetics', 'physiology', 'taxonomy'], 1, [10, 12], 'Medium', 'Genetics studies how traits are inherited.'),
      mcq('b10', 'In humans, exchange of gases takes place in the:', ['alveoli', 'bronchi', 'trachea', 'larynx'], 0, [9, 12], 'Medium', 'Gas exchange occurs across the alveoli in the lungs.'),
    ],
    short: [
      written('b-s1', 'Define a cell and name two of its parts.', 'A cell is the smallest structural and functional unit of life. Two parts: the cell membrane and the nucleus.', [6, 8], 'Easy'),
      written('b-s2', 'Differentiate between plants and animals, giving two points.', 'Plants make their own food and usually do not move from place to place; animals take in ready-made food and can move about.', [6, 8], 'Easy'),
      written('b-s3', 'State the function of the heart.', 'The heart is a muscular pump that circulates blood, carrying oxygen and nutrients around the body and removing waste.', [6, 9], 'Easy'),
      written('b-s4', 'What is photosynthesis? Write its word equation.', 'Photosynthesis is how green plants make food using light. Word equation: carbon dioxide + water → glucose + oxygen (in the presence of light and chlorophyll).', [7, 10], 'Medium'),
      written('b-s5', 'Differentiate between arteries and veins.', 'Arteries carry blood away from the heart under high pressure and have thick elastic walls; veins carry blood back to the heart under low pressure and have valves.', [8, 11], 'Medium'),
      written('b-s6', 'Define heredity and variation.', 'Heredity is the passing of traits from parents to offspring; variation is the difference in those traits among individuals.', [10, 12], 'Medium'),
    ],
    long: [
      written('b-l1', 'Draw a labelled diagram of a plant cell and state the function of any three parts.', 'A plant cell has a cell wall, cell membrane, cytoplasm, nucleus, chloroplasts and a large vacuole. Functions: the cell wall gives support; chloroplasts carry out photosynthesis; the vacuole stores water and keeps the cell firm.', [8, 10], 'Medium'),
      written('b-l2', 'Describe the human digestive system, naming the main organs and their functions.', 'Food passes through the mouth, oesophagus, stomach, small intestine and large intestine. The mouth and stomach begin digestion, the small intestine absorbs nutrients and the large intestine absorbs water.', [9, 10], 'Medium'),
      written('b-l3', 'Explain how the human respiratory system works, from the nose to the exchange of gases.', 'Air enters through the nose, passes the trachea and bronchi into the lungs, and reaches the alveoli where oxygen diffuses into the blood and carbon dioxide diffuses out.', [9, 12], 'Hard'),
      written('b-l4', 'Explain the process of photosynthesis and the factors that affect its rate.', 'Chlorophyll traps light, splitting water and combining hydrogen with carbon dioxide to form glucose, releasing oxygen. The rate depends on light intensity, carbon dioxide concentration and temperature.', [10, 12], 'Medium'),
    ],
  },

  English: {
    mcq: [
      mcq('e1', 'Choose the correct plural of "child".', ['childs', 'childes', 'children', 'childs\u2019'], 2, [6, 8], 'Easy', 'The plural of child is children.'),
      mcq('e2', 'Choose the correct article: ___ apple a day keeps the doctor away.', ['a', 'an', 'the', 'no article'], 1, [6, 8], 'Easy', '"Apple" begins with a vowel sound, so "an" is used.'),
      mcq('e3', 'Choose the synonym of "happy".', ['sad', 'joyful', 'angry', 'tired'], 1, [7, 10], 'Easy', 'Joyful means the same as happy.'),
      mcq('e4', 'Identify the verb in: "She sings well."', ['She', 'sings', 'well', 'none'], 1, [6, 9], 'Easy', '"Sings" is the action word.'),
      mcq('e5', 'Choose the correct past tense of "go".', ['goed', 'went', 'gone', 'going'], 1, [7, 10], 'Easy', 'The past tense of go is went.'),
      mcq('e6', 'Which of these is a conjunction?', ['quickly', 'and', 'beautiful', 'run'], 1, [7, 10], 'Medium', '"And" joins words or clauses.'),
      mcq('e7', 'Choose the antonym of "ancient".', ['old', 'modern', 'historic', 'past'], 1, [8, 11], 'Medium', 'Modern is the opposite of ancient.'),
      mcq('e8', 'Pick the correctly spelt word.', ['recieve', 'receive', 'receeve', 'riceive'], 1, [8, 12], 'Medium', 'The correct spelling is "receive" (i before e except after c).'),
      mcq('e9', 'In "He runs quickly", the word "quickly" is a(n):', ['noun', 'adjective', 'adverb', 'pronoun'], 2, [8, 11], 'Medium', '"Quickly" describes how he runs, so it is an adverb.'),
      mcq('e10', 'Choose the passive voice of "Ali wrote a letter".', ['A letter was written by Ali', 'Ali is writing a letter', 'A letter writes Ali', 'Ali has written a letter'], 0, [10, 12], 'Hard', 'In the passive, the object becomes the subject: "A letter was written by Ali".'),
    ],
    short: [
      written('e-s1', 'Write the past tense of the verbs: go, eat and write.', 'go → went; eat → ate; write → wrote.', [6, 8], 'Easy'),
      written('e-s2', 'Use "beautiful" in a sentence of your own.', 'Example: The garden was full of beautiful flowers. (Any correct sentence using "beautiful" is accepted.)', [6, 8], 'Easy'),
      written('e-s3', 'Define a noun and give two examples.', 'A noun is a word that names a person, place, thing or idea. Examples: teacher, Lahore.', [6, 9], 'Easy'),
      written('e-s4', 'Change into the negative: "She is reading a book."', 'She is not reading a book.', [7, 10], 'Easy'),
      written('e-s5', 'Differentiate between a phrase and a clause.', 'A phrase is a group of words without a subject and verb (e.g. "in the morning"); a clause contains a subject and a verb (e.g. "she arrived").', [9, 11], 'Medium'),
      written('e-s6', 'Write a short paragraph (4–5 lines) on "My School".', 'A short descriptive paragraph naming the school, what is studied there and why it is liked. Clear sentences and correct punctuation are expected.', [8, 12], 'Medium'),
    ],
    long: [
      written('e-l1', 'Write a letter to your friend inviting him or her to your school\u2019s annual function.', 'A friendly letter with the sender\u2019s address, date, salutation, a body inviting the friend and mentioning the date and time of the function, and a closing.', [8, 10], 'Medium'),
      written('e-l2', 'Write an essay (around 150 words) on "The Importance of Education".', 'An organised essay with an introduction, two or three body paragraphs on how education shapes knowledge, character and opportunity, and a conclusion.', [9, 11], 'Medium'),
      written('e-l3', 'Write an application to the principal requesting leave for three days.', 'A formal application with the sender\u2019s details, a subject line, a polite request stating the reason and dates for the leave, and a closing with thanks.', [8, 11], 'Medium'),
      written('e-l4', 'Write a story with the moral "Honesty is the best policy".', 'A short narrative in which a character tells the truth despite difficulty and is rewarded, ending with the stated moral.', [9, 12], 'Hard'),
    ],
  },

  Urdu: {
    mcq: [
      mcq('u1', 'اردو کا پہلا حرف کون سا ہے؟', ['ا', 'ب', 'پ', 'ت'], 0, [6, 8], 'Easy', 'اردو حروفِ تہجی کا پہلا حرف "ا" ہے۔'),
      mcq('u2', '"کتاب" کی جمع کیا ہے؟', ['کتابیں', 'کتابوں', 'کتبے', 'کتبہ'], 0, [6, 9], 'Easy', '"کتاب" کی جمع "کتابیں" ہے۔'),
      mcq('u3', '"خوبصورت" کا متضاد کیا ہے؟', ['بدصورت', 'حسین', 'پیارا', 'اچھا'], 0, [6, 10], 'Easy', 'خوبصورت کا متضاد بدصورت ہے۔'),
      mcq('u4', '"وہ سکول جاتا ہے" میں فعل کون سا ہے؟', ['وہ', 'سکول', 'جاتا ہے', 'کوئی نہیں'], 2, [6, 9], 'Easy', '"جاتا ہے" فعل ہے۔'),
      mcq('u5', '"پھول" کی جمع کیا ہے؟', ['پھول', 'پھولوں', 'پھولیں', 'پھولا'], 0, [6, 8], 'Medium', 'اردو میں "پھول" کی جمع "پھول" ہی استعمال ہوتی ہے۔'),
      mcq('u6', '"علم" کا مترادف کیا ہے؟', ['ہنر', 'دانش', 'دولت', 'ہمت'], 1, [7, 10], 'Medium', 'علم کا مترادف دانش ہے۔'),
      mcq('u7', 'جملہ مکمل کریں: "میں نے کتاب ___"', ['پڑھی', 'پڑھا', 'پڑھے', 'پڑھنا'], 0, [7, 10], 'Medium', 'کتاب مؤنث ہے، اس لیے "پڑھی" درست ہے۔'),
      mcq('u8', '"احمد بہت محنتی ہے" یہ کس قسم کا جملہ ہے؟', ['سوالیہ', 'خبریہ', 'تعجب', 'نفی'], 1, [8, 11], 'Medium', 'یہ ایک خبریہ (بیانیہ) جملہ ہے۔'),
      mcq('u9', '"دن" کا متضاد کیا ہے؟', ['رات', 'صبح', 'شام', 'دوپہر'], 0, [6, 8], 'Easy', 'دن کا متضاد رات ہے۔'),
      mcq('u10', '"استاد" کی جمع کیا ہے؟', ['استادوں', 'استادیں', 'استاد', 'استادے'], 0, [8, 12], 'Hard', 'استاد کی جمع استادوں ہے۔'),
    ],
    short: [
      written('u-s1', 'اپنے سکول کے بارے میں تین جملے لکھیں۔', 'تین مکمل جملوں میں سکول کا نام، کلاس اور پسندیدہ بات بیان کی جائے۔', [6, 8], 'Easy'),
      written('u-s2', '"کتاب" اور "قلم" کے دو دو مترادف الفاظ لکھیں۔', 'کتاب: کتاب، تصنیف۔ قلم: قلم، خامہ۔', [6, 9], 'Medium'),
      written('u-s3', 'اسم، فعل اور صفت کی تعریف لکھیں۔', 'اسم وہ کلمہ ہے جو کسی شخص، جگہ یا چیز کا نام ہو۔ فعل کام یا حالت کو ظاہر کرتا ہے۔ صفت اسم کی خوبی یا حالت بیان کرتی ہے۔', [7, 10], 'Medium'),
      written('u-s4', 'درج ذیل جملے میں فعل اور فاعل الگ کریں: "علی نے خط لکھا۔"', 'فاعل: علی۔ فعل: لکھا۔ مفعول: خط۔', [7, 10], 'Medium'),
      written('u-s5', '"محنت" کی اہمیت پر پانچ سطریں لکھیں۔', 'محنت کامیابی کی کنجی ہے؛ محنت کرنے والا انسان ترقی کرتا ہے اور اپنے مقصد تک پہنچتا ہے۔', [9, 12], 'Medium'),
      written('u-s6', '"دوستی" کے موضوع پر مختصر مضمون لکھیں۔', 'دوستی ایک قیمتی رشتہ ہے جو بھروسے، خلوص اور تعاون پر قائم ہوتا ہے؛ اچھا دوست مشکل وقت میں ساتھ دیتا ہے۔', [9, 12], 'Medium'),
    ],
    long: [
      written('u-l1', 'اپنے دوست کو سالانہ تقریب میں شرکت کی دعوت دیتے ہوئے خط لکھیں۔', 'خط میں تعارف، والدین کی اجازت، تقریب کی تاریخ اور وقت کا ذکر کرتے ہوئے دوست کو شرکت کی دعوت دی جائے۔', [8, 10], 'Medium'),
      written('u-l2', '"تعلیم کی اہمیت" کے موضوع پر مضمون لکھیں۔', 'مضمون میں تعلیم کے ذریعے علم، کردار اور ذریعہ معاش پر روشنی ڈالی جائے اور نتیجہ بیان کیا جائے۔', [9, 11], 'Medium'),
      written('u-l3', 'پرنسپل کو تین دن کی رخصت کے لیے درخواست لکھیں۔', 'درخواست میں مخاطب، سوال کا موضوع، رخصت کی وجہ اور تاریخ کا ذکر ہو اور آخر میں اجازت کی درخواست ہو۔', [8, 11], 'Medium'),
      written('u-l4', '"ایمانداری بہترین حکمت عملی ہے" کے موضوع پر ایک کہانی لکھیں۔', 'ایسی کہانی لکھیں جس میں ایک ایماندار کردار مشکل کے باوجود سچ بولتا ہے اور اُسے کامیابی ملتی ہے، پھر مذکورہ نتیجہ بیان ہو۔', [9, 12], 'Hard'),
    ],
  },
};

/* ------------------------------------------------------------------ */
/* Marks planning                                                     */
/* ------------------------------------------------------------------ */

/** Sensible per-question mark ranges, by section. */
export const MARK_RANGES = {
  mcq: { min: 1, max: 2 },
  short: { min: 2, max: 5 },
  long: { min: 5, max: 10 },
} as const;

/** Preferred per-question marks for each difficulty, used to break ties. */
const MARK_TARGETS: Record<Difficulty, { mcq: number; short: number; long: number }> = {
  Easy: { mcq: 1, short: 2, long: 5 },
  Medium: { mcq: 1, short: 3, long: 7 },
  Hard: { mcq: 2, short: 4, long: 9 },
};

/**
 * Choose per-section marks so that
 * `mcqCount·mcqMarks + shortCount·shortMarks + longCount·longMarks` equals the
 * requested total exactly.
 *
 * The search is small and exhaustive, so the result is deterministic. If no
 * assignment fits, it returns the achievable range instead of silently
 * generating a paper whose marks do not add up — a wrong total on a printed
 * paper is worse than asking the teacher to adjust the counts.
 */
export function planMarks(input: PaperFormInput): MarksPlanResult {
  const mcqCount = Math.max(0, Math.floor(input.mcqCount || 0));
  const shortCount = Math.max(0, Math.floor(input.shortCount || 0));
  const longCount = Math.max(0, Math.floor(input.longCount || 0));
  const total = Math.floor(input.totalMarks || 0);

  const min = mcqCount * MARK_RANGES.mcq.min + shortCount * MARK_RANGES.short.min + longCount * MARK_RANGES.long.min;
  const max = mcqCount * MARK_RANGES.mcq.max + shortCount * MARK_RANGES.short.max + longCount * MARK_RANGES.long.max;

  if (mcqCount + shortCount + longCount === 0) {
    return { ok: false, message: 'Add at least one question.', min: 0, max: 0 };
  }

  if (total < min || total > max) {
    return {
      ok: false,
      message: `With ${mcqCount} MCQ, ${shortCount} short and ${longCount} long questions, the total can only be between ${min} and ${max} marks. Adjust the question counts or the total marks.`,
      min,
      max,
    };
  }

  const target = MARK_TARGETS[input.difficulty] ?? MARK_TARGETS.Medium;
  let best: MarksPlan | null = null;
  let bestCost = Number.POSITIVE_INFINITY;

  for (let m = MARK_RANGES.mcq.min; m <= MARK_RANGES.mcq.max; m += 1) {
    for (let s = MARK_RANGES.short.min; s <= MARK_RANGES.short.max; s += 1) {
      for (let l = MARK_RANGES.long.min; l <= MARK_RANGES.long.max; l += 1) {
        const allocated = mcqCount * m + shortCount * s + longCount * l;
        if (allocated !== total) continue;

        const cost =
          (mcqCount ? Math.abs(m - target.mcq) : 0) +
          (shortCount ? Math.abs(s - target.short) : 0) +
          (longCount ? Math.abs(l - target.long) : 0);

        if (cost < bestCost) {
          bestCost = cost;
          best = { mcqMarks: m, shortMarks: s, longMarks: l, allocated };
        }
      }
    }
  }

  if (!best) {
    return {
      ok: false,
      message: `The total of ${total} marks cannot be divided exactly between the requested questions. It can range from ${min} to ${max} marks.`,
      min,
      max,
    };
  }

  return { ok: true, plan: best };
}

/* ------------------------------------------------------------------ */
/* Form validation                                                    */
/* ------------------------------------------------------------------ */

export type PaperFormField = keyof PaperFormInput;

export interface PaperFormValidation {
  errors: Partial<Record<PaperFormField, string>>;
  marks: MarksPlanResult | null;
  isValid: boolean;
}

const TOTAL_MARKS_MIN = 10;
const TOTAL_MARKS_MAX = 200;
const DURATION_MIN = 15;
const DURATION_MAX = 240;

/** Validate the paper form. Pure, so it can run in the component and the thunk. */
export function validatePaperInput(input: PaperFormInput): PaperFormValidation {
  const errors: Partial<Record<PaperFormField, string>> = {};

  if (!input.className) errors.className = 'Choose a class.';
  if (!input.subject) errors.subject = 'Choose a subject.';
  if (!input.paperType) errors.paperType = 'Choose a paper type.';
  if (!input.topics.trim()) errors.topics = 'List at least one topic or chapter.';

  if (!Number.isFinite(input.totalMarks) || input.totalMarks < TOTAL_MARKS_MIN || input.totalMarks > TOTAL_MARKS_MAX) {
    errors.totalMarks = `Total marks must be between ${TOTAL_MARKS_MIN} and ${TOTAL_MARKS_MAX}.`;
  }
  if (
    !Number.isFinite(input.durationMinutes) ||
    input.durationMinutes < DURATION_MIN ||
    input.durationMinutes > DURATION_MAX
  ) {
    errors.durationMinutes = `Duration must be between ${DURATION_MIN} and ${DURATION_MAX} minutes.`;
  }

  if (input.mcqCount < 0 || input.mcqCount > MAX_MCQ) {
    errors.mcqCount = `Between 0 and ${MAX_MCQ}.`;
  }
  if (input.shortCount < 0 || input.shortCount > MAX_SHORT) {
    errors.shortCount = `Between 0 and ${MAX_SHORT}.`;
  }
  if (input.longCount < 0 || input.longCount > MAX_LONG) {
    errors.longCount = `Between 0 and ${MAX_LONG}.`;
  }

  // Marks can only be planned once the counts and total are individually sane.
  const countsSane =
    !errors.mcqCount && !errors.shortCount && !errors.longCount && !errors.totalMarks;

  let marks: MarksPlanResult | null = null;
  if (countsSane) {
    marks = planMarks(input);
    if (!marks.ok) errors.totalMarks = marks.message;
  }

  return { errors, marks, isValid: Object.keys(errors).length === 0 };
}
