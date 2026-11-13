// Interview questions — the recruiter-editable question list (rebuilt from the
// parked post-mvp/role-define-rework model, fitted to master's role families).
//
// Every question maps to fixed competencies (how it is scored); its wording is
// the recruiter's to edit (what is asked). Editing the wording never changes
// what it scores. A question built from an Essential criterion is MUST ASK and
// cannot be removed; everything else is asked at the AI's discretion unless the
// recruiter marks it must ask.
//
// Question wording is AUTHORED here per family criterion. A family whose
// criteria ship empty gets only the warm-up, and the screen flags AUTHORING
// NEEDED — never a default or a guess.

import { UNIVERSAL_COMPETENCIES, matchFamily } from './roleFamilies.js'

export const INTERVIEW_SECTIONS = [
  { key: 'warmup', title: 'Warm-up', purpose: 'Settles them in. Lightly scored.' },
  { key: 'core', title: 'Core', purpose: 'Tests what you marked Essential. Always asked.' },
  { key: 'role', title: 'Role', purpose: 'Tests the rest of the craft. The AI picks what to ask from here.' },
]

// The competencies a question may map to: the six universals plus this role's
// domain. Recruiter-added questions pick from exactly this set, so nothing scores
// against an unmapped dimension.
export function rubricFor(title = '') {
  const family = matchFamily(title)
  return family ? [...UNIVERSAL_COMPETENCIES, family.domainCompetency] : [...UNIVERSAL_COMPETENCIES]
}

// A short screen: roughly four minutes a question, aiming for 20 to 30 minutes.
export const MINUTES_PER_QUESTION = 4
export const TARGET_MAX_MINUTES = 30
export const MAX_QUESTIONS = 10
export const estimatedMinutes = (count) => count * MINUTES_PER_QUESTION

const WARMUP = {
  text: 'To start, tell me about a project you worked on with others, and what your part was.',
  competencies: ['Collaboration'],
}

// Authored question per criterion text, with the competencies it tests. Keyed by
// the exact criterion text in roleFamilies.js. 'domain' resolves to the family's
// domain competency.
const QUESTION_FOR_CRITERION = {
  // Product Manager
  "Starts from the user's problem, not the feature": {
    text: 'Tell me about something you built or changed. Who was it for, and what problem did it solve for them?',
    competencies: ['domain'],
  },
  'Explains why they dropped something, not just what they built': {
    text: 'Tell me about an idea you decided not to pursue. Why did you drop it?',
    competencies: ['domain', 'Problem Solving'],
  },
  'Names a metric that would show it worked, and says what that metric hides': {
    text: 'Pick something you worked on. How would you know it worked, and what would that number not tell you?',
    competencies: ['domain', 'Problem Solving'],
  },
  'Weighs a trade-off out loud instead of jumping to the obvious side': {
    text: 'Tell me about a choice between two good options. How did you weigh them?',
    competencies: ['Problem Solving'],
  },
  'Can say what they would build first, and why that order': {
    text: 'You have three things to build and time for one. Walk me through how you would choose.',
    competencies: ['domain', 'Execution'],
  },
  'Has an opinion about a product they use, and can defend it': {
    text: 'What is a product you use often? What would you change about it, and why?',
    competencies: ['domain', 'Communication'],
  },

  // Software Engineer
  'Writes working code for a problem they have not seen before': {
    text: 'Walk me through how you would solve a small problem you have not seen before, step by step.',
    competencies: ['domain', 'Problem Solving'],
  },
  'Finds the cause of a bug instead of guessing at fixes': {
    text: 'Tell me about the hardest bug you have tracked down. How did you find the cause?',
    competencies: ['Problem Solving', 'Ownership'],
  },
  'Explains a design choice and says what it costs': {
    text: 'Tell me about a design choice you made in your code. What did it cost you?',
    competencies: ['domain', 'Communication'],
  },
  'Picks a simple structure and can say when it would break': {
    text: 'Sketch a simple way to build something you have built. Where would it break first?',
    competencies: ['domain'],
  },
  'Writes code another person can read months later': {
    text: 'How do you make sure someone else can understand your code months later?',
    competencies: ['domain', 'Collaboration'],
  },

  // Data Analyst
  'Gets the data into a shape they can use, without being told how': {
    text: 'Tell me about a messy dataset you had to clean up. What did you do first?',
    competencies: ['domain', 'Ownership'],
  },
  'Notices when a number is wrong before anyone else does': {
    text: 'Tell me about a time a number looked wrong to you. How did you check it?',
    competencies: ['domain', 'Problem Solving'],
  },
  'Says what the chart is meant to prove, not just what it shows': {
    text: 'Think of a chart you made. What was it meant to prove to the person reading it?',
    competencies: ['domain', 'Communication'],
  },
  'Defines a metric precisely enough to argue about': {
    text: 'Define a metric you have used, precisely enough that two people would count it the same way.',
    competencies: ['domain'],
  },
  'Knows when a difference is not a difference': {
    text: 'Two numbers differ a little. How do you decide whether the difference is real?',
    competencies: ['domain', 'Problem Solving'],
  },
  'Has looked at a dataset nobody asked them to look at': {
    text: 'Tell me about some data you explored just because you were curious. What did you find?',
    competencies: ['Learning Agility'],
  },
}

let seq = 0
const nextId = () => `q${++seq}`

function resolve(competencies, domain) {
  return competencies.map((c) => (c === 'domain' ? domain : c)).filter(Boolean)
}

// The suggested interview for a role: a warm-up, one Core question per Essential
// criterion (must ask, locked), and one Role question per remaining criterion.
// Recruiter probes ride on the first question that tests the same competency.
export function buildInterview({ title = '', probes = [] } = {}) {
  const family = matchFamily(title)
  const domain = family?.domainCompetency
  const rows = [{ id: nextId(), section: 'warmup', text: WARMUP.text, competencies: WARMUP.competencies, mustAsk: false, locked: false, origin: 'suggested' }]

  for (const c of family?.criteria ?? []) {
    const authored = QUESTION_FOR_CRITERION[c.text]
    if (!authored) continue
    const essential = c.tier === 'Essential'
    rows.push({
      id: nextId(),
      section: essential ? 'core' : 'role',
      text: authored.text,
      suggestedText: authored.text,
      competencies: resolve(authored.competencies, domain),
      criterion: c.text,
      tier: c.tier,
      mustAsk: essential,
      locked: essential,
      origin: 'suggested',
    })
  }

  // Attach each probe's exact phrase to the first question testing its competency.
  const used = new Set()
  for (const p of probes) {
    const q = rows.find((r) => !used.has(r.id) && r.competencies.includes(p.competency))
    if (q) {
      q.phrase = p.phrase
      used.add(q.id)
    }
  }
  return rows
}

// A blank recruiter-added question.
export function newQuestion({ text, competencies, section = 'role', mustAsk = false }) {
  return { id: nextId(), section, text, competencies, mustAsk, locked: false, origin: 'added' }
}

// The plain-language "why this question" line. Same helper for suggested and
// recruiter-added questions, so the reason always reads the same.
export function questionWhy(q) {
  let s = q.criterion
    ? `Checks: ${q.criterion.charAt(0).toLowerCase()}${q.criterion.slice(1)}.`
    : q.section === 'warmup'
      ? 'Settles them in before the questions that count.'
      : 'You added this.'
  if (q.phrase) s += ` From your words: “${q.phrase}”.`
  if (q.locked) s += ' Essential, so it is always asked.'
  else if (q.mustAsk) s += ' You marked it must ask.'
  return s
}

// Which of the rubric's competencies no question tests yet.
export function untestedCompetencies(title, questions) {
  const tested = new Set(questions.flatMap((q) => q.competencies))
  return rubricFor(title).filter((c) => !tested.has(c))
}
