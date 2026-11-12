const curriculum = 'https://curriculum.nsw.edu.au/learning-areas/';
const nesa = 'https://www.nsw.gov.au/education-and-training/nesa/curriculum/';
export const courses = [
  { id:'mx1', icon:'graph', short:'Maths Ext 1', name:'Mathematics Extension 1', code:'X1', colour:'#416c55', year:'2024', url:curriculum+'mathematics/mathematics-extension-1-11-12-2024/overview/course', modules:[
    ['Proof by mathematical induction','Base case and inductive step','Induction with sums and inequalities'],
    ['Introduction to vectors','Vector operations and components','Dot product, angles and projections','Geometric applications'],
    ['Inverse trigonometric functions','Domain, range and graphs','Inverse trigonometric equations'],
    ['Further calculus skills','Integration by substitution','Trigonometric integrals'],
    ['Further applications of calculus','Differential equations','Motion and rates of change'],
    ['Binomial and sampling distributions','Binomial probabilities','Sampling distribution of the mean']
  ]},
  { id:'mx2', icon:'pi', short:'Maths Ext 2', name:'Mathematics Extension 2', code:'X2', colour:'#6b5590', year:'2024', url:curriculum+'mathematics/mathematics-extension-2-11-12-2024/overview/course', modules:[
    ['The nature of proof','Direct proof and counterexamples','Contrapositive and contradiction','Inequalities'],
    ['Further work with vectors','Vectors in three dimensions','Vector equations of lines','Angles and intersections'],
    ['Introduction to complex numbers','Cartesian form and conjugates','Argand diagrams and polar form','De Moivre’s theorem and roots','Loci and geometric reasoning'],
    ['Further integration','Integration by parts','Partial fractions and substitution','Reduction formulae'],
    ['Applications of calculus to mechanics','Forces and equations of motion','Resisted motion','Simple harmonic motion']
  ]},
  { id:'phy', icon:'atom', short:'Physics', name:'Physics', code:'PH', colour:'#376c88', year:'2017', url:nesa+'science/physics-stage-6-2017', modules:[
    ['M5 · Advanced Mechanics','Projectile motion','Circular motion','Gravitation and orbital motion'],
    ['M6 · Electromagnetism','Charged particles in fields','Motor effect and torque','Electromagnetic induction','Transformers and applications'],
    ['M7 · The Nature of Light','Wave models of light','Photons and the photoelectric effect','Light and special relativity'],
    ['M8 · From the Universe to the Atom','Stars and nucleosynthesis','Atomic models and spectra','Quantum mechanics','Nuclear and particle physics']
  ]},
  { id:'che', icon:'flask', short:'Chemistry', name:'Chemistry', code:'CH', colour:'#91602d', year:'2017', url:nesa+'science/chemistry-stage-6-2017', modules:[
    ['M5 · Equilibrium and Acid Reactions','Dynamic equilibrium and Le Châtelier','Equilibrium constants','Solubility equilibria'],
    ['M6 · Acid/Base Reactions','Acid–base models, strength and pH','Titrations and curves','Buffers and equilibrium'],
    ['M7 · Organic Chemistry','Naming, structures and isomers','Organic reactions and pathways','Polymers'],
    ['M8 · Applying Chemical Ideas','Qualitative and quantitative analysis','Spectroscopy and structure','Chemical synthesis']
  ]},
  { id:'eco', icon:'trend', short:'Economics', name:'Economics', code:'EC', colour:'#98563e', year:'2009', url:nesa+'hsie/economics-stage-6-2009', modules:[
    ['The Global Economy','Globalisation and trade','Protection and trade agreements','Development and country case study'],
    ['Australia’s Place in the Global Economy','Trade and financial flows','Balance of payments','Exchange rates and external stability'],
    ['Economic Issues','Growth and unemployment','Inflation','Distribution of income and wealth','Environmental sustainability'],
    ['Economic Policies and Management','Fiscal policy','Monetary policy','Microeconomic reform','Policy mix and trade-offs']
  ]},
  { id:'eng', icon:'feather', short:'English Adv', name:'English Advanced', code:'EN', colour:'#9a4f65', year:'2024', url:curriculum+'english/english-advanced-11-12-2024/overview/course', modules:[
    ['Texts and human experiences','Text evidence and close analysis','Unseen texts and short responses','Timed extended response'],
    ['Textual conversations','Context and intertextual links','Comparative evidence','Comparative thesis and response'],
    ['Critical study of literature','Textual form and style','Interpretations and textual evidence','Critical thesis and response'],
    ['The craft of writing','Mentor-text techniques','Composition for audience and purpose','Reflection on writing choices']
  ]}
];

export const templates = {
  'Active retrieval': { minutes:20, text:'1. Pick three prompts from this topic.\n2. Answer from memory with notes closed.\n3. Check each response and record the exact gap.\n4. Write one fresh prompt for the next session.' },
  'Timed practice': { minutes:40, text:'1. Choose a question set, paper section or writing prompt.\n2. Set the time limit and work under assessment conditions.\n3. Mark against the criteria and record time used.\n4. Log the highest-cost error and schedule a fresh retest.' },
  'Repair & retest': { minutes:25, text:'1. Explain what caused the error.\n2. Rework one example with feedback.\n3. Attempt a fresh question without help.\n4. Record the evidence and repeat later if the error returns.' }
};
