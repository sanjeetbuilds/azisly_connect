// The role scorecard model.
//
// A role is NOT a set of percentages that sum to 100. It has four distinct parts,
// shown separately and never merged into one flat weighted list:
//
//   1. Domain    the one competency that makes this role what it is: the
//                differentiator, derived from the role title/family.
//   2. Emphasis  the one or two universal competencies this role leans on extra,
//                shown as a tier (High), never as a percentage.
//   3. Baseline  all six universal competencies, always checked at a strong bar.
//                This is the floor, not a per-role setting: one quiet line, never
//                six scored rows.
//   4. Gates     the hard must-haves, the deal-breakers.

import { CORE_COMPETENCIES } from './candidates.js'

// The six universal competencies every role is held to at a strong baseline.
export const BASELINE_COMPETENCIES = CORE_COMPETENCIES

// The importance ladder. Exactly three colour-coded rungs, used consistently
// wherever the role card shows how much a quality matters. There is no numeric
// weight and no fourth rung: a quality is a gate, an emphasis, or the floor.
//   must-have      (red)   a gate: a hard exclude.
//   very-important (amber) an emphasis: turned up above the floor.
//   baseline       (grey)  the floor: always checked, never set per role.
export const LADDER = {
  mustHave: { label: 'Must have', pill: 'bg-danger-soft text-danger' },
  veryImportant: { label: 'Very important', pill: 'bg-warning-soft text-attention' },
  baseline: { label: 'Baseline', pill: 'bg-ink/[0.05] text-muted' },
}

// The baseline, phrased as the one line the card shows.
export const BASELINE_LINE =
  'All candidates are also held to a strong bar on the fundamentals: communication, problem solving, ownership, learning agility, execution, and collaboration.'

// Role families. The title maps to exactly one family, which is the ONLY source
// of the domain and the two competencies we always check closely. These come from
// our framework, never from the recruiter, so the card can state them with a
// clear source and never assert something specific the recruiter did not tell us.
//
//   domain          the one competency that makes the family what it is.
//   checkedClosely  the two competencies the AI interview gates for this family.
//   patterns        universals roles like this OFTEN lean on: suggestions only,
//                   framed as patterns, never asserted as this role's needs.
export const FAMILIES = {
  product: { key: 'product', label: 'Product', domain: 'Product craft', checkedClosely: ['Problem Solving', 'Product craft'], patterns: ['Ownership', 'Collaboration'] },
  engineering: { key: 'engineering', label: 'Engineering', domain: 'System design', checkedClosely: ['Problem Solving', 'System design'], patterns: ['Ownership', 'Execution'] },
  frontend: { key: 'frontend', label: 'Frontend', domain: 'Frontend engineering', checkedClosely: ['Execution', 'Frontend engineering'], patterns: ['Collaboration', 'Communication'] },
  design: { key: 'design', label: 'Design', domain: 'Design craft', checkedClosely: ['Collaboration', 'Design craft'], patterns: ['Communication', 'Ownership'] },
  'eng-management': { key: 'eng-management', label: 'Engineering management', domain: 'Engineering leadership', checkedClosely: ['Communication', 'Engineering leadership'], patterns: ['Ownership', 'Collaboration'] },
  data: { key: 'data', label: 'Data', domain: 'Data engineering', checkedClosely: ['Problem Solving', 'Data engineering'], patterns: ['Execution', 'Ownership'] },
  ml: { key: 'ml', label: 'Applied ML', domain: 'Applied ML', checkedClosely: ['Problem Solving', 'Applied ML'], patterns: ['Learning Agility', 'Ownership'] },
}
export const FAMILY_LIST = Object.values(FAMILIES)

// Ordered most-specific first (so "Engineering Manager" beats "Engineer", and
// "Product Engineer" beats a generic engineer). A title that maps to nothing
// returns null: the load-bearing ops-flag case, surfaced, never silently guessed.
const FAMILY_RULES = [
  { test: /product\s+manager|\bpm\b|product\s+owner|product\s+engineer/i, key: 'product' },
  { test: /design|\bux\b|\bui\b/i, key: 'design' },
  { test: /engineering\s+manager|head\s+of\s+eng|eng\s+manager/i, key: 'eng-management' },
  { test: /data\s+engineer|data\s+platform/i, key: 'data' },
  { test: /data\s+scien|machine\s+learning|\bml\b|\bai\b/i, key: 'ml' },
  { test: /frontend|front-end/i, key: 'frontend' },
  { test: /backend|back-end|platform|infrastructure|systems?|software\s+engineer|developer|\bengineer\b/i, key: 'engineering' },
]

export function roleFamily(title = '') {
  for (const rule of FAMILY_RULES) if (rule.test.test(title)) return rule.key
  return null
}

export function roleDomain(title = '') {
  const key = roleFamily(title)
  return key ? FAMILIES[key].domain : null
}

// ── Criteria (recruiter-facing) ──────────────────────────────────────────────
//
// The define screen shows ONE uniform list of criteria, in the recruiter's
// language. Each criterion has a name, a plain description, an importance, and an
// internal `comp` (which of our seven it maps to). The recruiter never sees comp,
// domain, gate, or any framework word. Exactly two criteria are pre-set to the
// top rung; they are the family's two gates, expressed as a recruiter would. We
// hire freshers, so no criterion is ever about tenure, only capability.
const CRITERIA_BY_FAMILY = {
  product: [
    { name: 'Product Sense', importance: 'essential', comp: 'Product craft', desc: 'Can look at a product and say what is working, what is not, and why.' },
    { name: 'Communication', importance: 'essential', comp: 'Communication', desc: 'Explains their thinking clearly, in writing and out loud.' },
    { name: 'Problem Solving', importance: 'veryImportant', comp: 'Problem Solving', desc: 'Breaks a messy problem into parts and reasons to a call.' },
    { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Sees something through without being chased.' },
    { name: 'User Empathy', importance: 'veryImportant', comp: 'Collaboration', desc: 'Starts from the user’s problem, not the feature.' },
    { name: 'Data Literacy', importance: 'nice', comp: 'Learning Agility', desc: 'Comfortable reading numbers and drawing a conclusion.' },
    { name: 'Collaboration', importance: 'nice', comp: 'Collaboration', desc: 'Works well with engineers and designers.' },
  ],
  engineering: [
    { name: 'Problem Solving', importance: 'essential', comp: 'Problem Solving', desc: 'Breaks a hard technical problem down and reasons to a solution.' },
    { name: 'Code Quality', importance: 'essential', comp: 'System design', desc: 'Writes code others can read, run, and build on.' },
    { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Takes a task from unclear to shipped without being chased.' },
    { name: 'Systems Thinking', importance: 'veryImportant', comp: 'System design', desc: 'Thinks about how the parts fit and where they break.' },
    { name: 'Communication', importance: 'veryImportant', comp: 'Communication', desc: 'Explains technical choices clearly to anyone.' },
    { name: 'Learning Speed', importance: 'nice', comp: 'Learning Agility', desc: 'Picks up a new stack or domain quickly.' },
    { name: 'Collaboration', importance: 'nice', comp: 'Collaboration', desc: 'Works cleanly with the rest of the team.' },
  ],
  frontend: [
    { name: 'UI Execution', importance: 'essential', comp: 'Frontend engineering', desc: 'Ships polished, accessible interfaces.' },
    { name: 'Collaboration', importance: 'essential', comp: 'Collaboration', desc: 'Works closely with design and backend.' },
    { name: 'Problem Solving', importance: 'veryImportant', comp: 'Problem Solving', desc: 'Untangles tricky UI and state problems.' },
    { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Takes a feature from design to shipped.' },
    { name: 'Communication', importance: 'veryImportant', comp: 'Communication', desc: 'Explains trade-offs clearly.' },
    { name: 'Learning Speed', importance: 'nice', comp: 'Learning Agility', desc: 'Keeps up with a fast-moving stack.' },
    { name: 'Attention to Detail', importance: 'nice', comp: 'Execution', desc: 'Catches the small things that add up.' },
  ],
  design: [
    { name: 'Craft', importance: 'essential', comp: 'Design craft', desc: 'Turns a fuzzy problem into clear, usable design.' },
    { name: 'Collaboration', importance: 'essential', comp: 'Collaboration', desc: 'Works closely with product and engineering, not in a silo.' },
    { name: 'User Empathy', importance: 'veryImportant', comp: 'Collaboration', desc: 'Starts from the user’s problem, not the pixels.' },
    { name: 'Communication', importance: 'veryImportant', comp: 'Communication', desc: 'Can explain and defend a design decision.' },
    { name: 'Problem Solving', importance: 'veryImportant', comp: 'Problem Solving', desc: 'Reasons through constraints to a considered call.' },
    { name: 'Curiosity', importance: 'nice', comp: 'Learning Agility', desc: 'Explores, tests, and learns from what does not work.' },
    { name: 'Ownership', importance: 'nice', comp: 'Ownership', desc: 'Follows a design through to shipped.' },
  ],
  'eng-management': [
    { name: 'People Leadership', importance: 'essential', comp: 'Engineering leadership', desc: 'Grows engineers and gets the best from them.' },
    { name: 'Communication', importance: 'essential', comp: 'Communication', desc: 'Sets direction clearly and listens well.' },
    { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Owns the team’s outcomes, good and bad.' },
    { name: 'Judgement', importance: 'veryImportant', comp: 'Problem Solving', desc: 'Makes sound calls with incomplete information.' },
    { name: 'Collaboration', importance: 'veryImportant', comp: 'Collaboration', desc: 'Works across teams to get things done.' },
    { name: 'Coaching', importance: 'nice', comp: 'Learning Agility', desc: 'Helps people grow past where they are.' },
    { name: 'Delivery', importance: 'nice', comp: 'Execution', desc: 'Keeps the team shipping steadily.' },
  ],
  data: [
    { name: 'Problem Solving', importance: 'essential', comp: 'Problem Solving', desc: 'Frames a messy question as something you can actually answer.' },
    { name: 'Data Rigour', importance: 'essential', comp: 'Data engineering', desc: 'Builds pipelines and analyses others can trust.' },
    { name: 'Execution', importance: 'veryImportant', comp: 'Execution', desc: 'Ships reliable work, not just prototypes.' },
    { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Owns the data others depend on.' },
    { name: 'Communication', importance: 'veryImportant', comp: 'Communication', desc: 'Turns numbers into a clear conclusion.' },
    { name: 'Learning Speed', importance: 'nice', comp: 'Learning Agility', desc: 'Picks up new tools and domains fast.' },
    { name: 'Collaboration', importance: 'nice', comp: 'Collaboration', desc: 'Works well with the teams they serve.' },
  ],
  ml: [
    { name: 'Problem Solving', importance: 'essential', comp: 'Problem Solving', desc: 'Frames a business problem as something a model can solve.' },
    { name: 'ML Foundations', importance: 'essential', comp: 'Applied ML', desc: 'Solid grounding in how models actually work.' },
    { name: 'Experimentation', importance: 'veryImportant', comp: 'Learning Agility', desc: 'Runs experiments and learns from them fast.' },
    { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Takes a model from idea to production.' },
    { name: 'Communication', importance: 'veryImportant', comp: 'Communication', desc: 'Explains a model and its limits plainly.' },
    { name: 'Execution', importance: 'nice', comp: 'Execution', desc: 'Ships models that hold up in production.' },
    { name: 'Collaboration', importance: 'nice', comp: 'Collaboration', desc: 'Works well with product and engineering.' },
  ],
}

const GENERIC_CRITERIA = [
  { name: 'Problem Solving', importance: 'essential', comp: 'Problem Solving', desc: 'Breaks a messy problem into parts and reasons to a call.' },
  { name: 'Communication', importance: 'essential', comp: 'Communication', desc: 'Explains their thinking clearly, in writing and out loud.' },
  { name: 'Ownership', importance: 'veryImportant', comp: 'Ownership', desc: 'Sees something through without being chased.' },
  { name: 'Learning Speed', importance: 'veryImportant', comp: 'Learning Agility', desc: 'Picks up unfamiliar work quickly.' },
  { name: 'Collaboration', importance: 'nice', comp: 'Collaboration', desc: 'Works well with the people around them.' },
]

// The generated criteria list for a title. Each gets a stable id.
export function roleCriteria(title = '') {
  const key = roleFamily(title)
  const list = (key && CRITERIA_BY_FAMILY[key]) || GENERIC_CRITERIA
  return list.map((c, i) => ({ id: `c${i}`, ...c }))
}

// Extra criteria the AI can suggest, per family. Filtered against what is already
// on the list at call sites.
const SUGGEST_POOL = {
  product: [
    { name: 'Prioritisation', comp: 'Problem Solving', desc: 'Chooses what to build next and can defend it.' },
    { name: 'Storytelling', comp: 'Communication', desc: 'Makes a case that moves people to a decision.' },
    { name: 'Execution', comp: 'Execution', desc: 'Turns a plan into shipped, measured work.' },
  ],
  _generic: [
    { name: 'Adaptability', comp: 'Learning Agility', desc: 'Stays effective when the plan changes.' },
    { name: 'Initiative', comp: 'Ownership', desc: 'Starts useful work without being told to.' },
    { name: 'Attention to Detail', comp: 'Execution', desc: 'Catches the small things that add up.' },
  ],
}
export function suggestionsFor(title = '') {
  const key = roleFamily(title)
  return (key && SUGGEST_POOL[key]) || SUGGEST_POOL._generic
}

// Criteria the recruiter has used on other roles, to reuse here.
export const REUSE_POOL = [
  { name: 'Systems Thinking', comp: 'System design', desc: 'Thinks about how the parts fit and where they break.', from: 'Backend Engineer' },
  { name: 'Design Craft', comp: 'Design craft', desc: 'Turns a fuzzy problem into clear, usable design.', from: 'Product Designer' },
  { name: 'Experimentation', comp: 'Learning Agility', desc: 'Runs experiments and learns from them fast.', from: 'Data Scientist' },
]

// What the domain means for this role, by family. Keeps the card concrete without
// implying a measured weight.
const DOMAIN_SUMMARY = {
  'Product craft':
    'Owns product-facing outcomes end to end: shaping the problem, shipping, and measuring the impact.',
  'System design':
    'Designs and reasons about systems that stay correct and fast as they scale.',
  'Design craft': 'Turns fuzzy problems into clear, usable, considered product design.',
  'Engineering leadership':
    'Grows engineers and sets the technical direction for their area.',
  'Data engineering': 'Builds reliable data pipelines and platforms others can trust.',
  'Applied ML': 'Frames problems as models and ships them into production.',
  'Frontend engineering': 'Builds fast, accessible, maintainable user-facing interfaces.',
}

export function domainSummary(domain) {
  return DOMAIN_SUMMARY[domain] ?? 'The core competency this role is built around.'
}

// What each universal means in plain words, so a criterion card never shows a
// bare competency name with no explanation of what it tests.
const COMPETENCY_MEANING = {
  Communication: 'Explains their thinking clearly, in writing and out loud, to any audience.',
  'Problem Solving': 'Reasons through messy, ambiguous problems and lands on a call.',
  Ownership: 'Takes a feature from shaping to shipping without being chased.',
  'Learning Agility': 'Picks up unfamiliar tools and domains fast, and puts them to work.',
  Execution: 'Ships steadily and predictably, without letting quality slip.',
  Collaboration: 'Works cleanly across people and teams to move the work forward.',
}

export function competencyMeaning(name) {
  return COMPETENCY_MEANING[name] ?? 'A quality this role is assessed on.'
}

// The six universal fundamentals, in reading order, for the card's fundamentals
// line. Every candidate is held to a strong bar on all six; this is not per-role.
export const FUNDAMENTALS = CORE_COMPETENCIES

// The full scorecard for a role, assembled from its confirmed title plus the
// emphasis and gates gathered in the define conversation. Domain always comes
// from the confirmed title, so the card can never show a mismatched template.
//
// emphasis: the 1-2 universals turned up, each { name, tier }. May be empty (a
//   balanced role names no single emphasis; the card must not fabricate one).
// gates: the hard must-haves. May be empty (the domain then acts as the implicit
//   gate; the review step confirms this rather than shipping zero gates silently).
export function roleScorecard({ title = 'New role', emphasis, gates } = {}) {
  return {
    title,
    domain: roleDomain(title),
    emphasis: emphasis ?? DEFAULT_EMPHASIS,
    gates: gates ?? DEFAULT_GATES,
  }
}

// Demo defaults for the Senior Product Engineer walkthrough. In a live flow these
// come from the conversation; here they stand in so the prototype reads true.
export const DEFAULT_EMPHASIS = [
  { name: 'Ownership', tier: 'High' },
  { name: 'Problem Solving', tier: 'High' },
]

// Nothing is pre-filled as a deal-breaker: we hire freshers, and asserting a
// requirement nobody set (an experience bar, a degree) quietly excludes good
// juniors. Deal-breakers come only from the recruiter, if they name one.
export const DEFAULT_GATES = []

// ── The draft ──────────────────────────────────────────────────────────────
//
// The define flow is inverted: rather than asking into a blank slate, we map the
// title to a role family and draft the whole card up front, then ask only what
// cannot be guessed. Everything below is the per-family starting guess: the
// emphasis it usually leans on, the gates that usually matter, and the interview
// questions that would test them. It is framed to the recruiter as "what usually
// matters for this kind of role", an invitation to correct, never an answer.
//
// Gates here are SUGGESTIONS only. They are never locked silently: the flow asks
// the gate question explicitly and the recruiter must actively confirm before a
// role carries any gate.
const DRAFT_BY_DOMAIN = {
  'Product craft': {
    emphasis: [
      { name: 'Ownership', tier: 'High' },
      { name: 'Problem Solving', tier: 'High' },
    ],
    gates: [
      'Has owned a product feature end to end, from shaping to shipping',
      '3+ years building production web applications',
    ],
    questions: [
      'Walk me through a feature you took from a vague problem to launch.',
      'Tell me about a time you cut scope to ship. What did you drop, and why?',
    ],
  },
  'System design': {
    emphasis: [
      { name: 'Problem Solving', tier: 'High' },
      { name: 'Ownership', tier: 'High' },
    ],
    gates: [
      'Strong system-design fundamentals',
      'Has owned a production service, on-call included',
    ],
    questions: [
      'Design a system for this, then tell me where it breaks at ten times the load.',
      'Tell me about a production incident you owned end to end.',
    ],
  },
  'Design craft': {
    emphasis: [
      { name: 'Collaboration', tier: 'High' },
      { name: 'Communication', tier: 'High' },
    ],
    gates: [
      'A portfolio of shipped product design',
      'Can defend a design decision with clear reasoning',
    ],
    questions: [
      'Show me a project where research changed your design.',
      'Walk me through a tradeoff you made between a user need and a constraint.',
    ],
  },
  'Engineering leadership': {
    emphasis: [
      { name: 'Communication', tier: 'High' },
      { name: 'Ownership', tier: 'High' },
    ],
    gates: [
      'Has managed engineers directly',
      'A track record of growing people',
    ],
    questions: [
      'Tell me about someone underperforming you turned around, or exited.',
      'How did you set technical direction across a team that disagreed?',
    ],
  },
  'Data engineering': {
    emphasis: [
      { name: 'Problem Solving', tier: 'High' },
      { name: 'Execution', tier: 'High' },
    ],
    gates: [
      'Has built and owned production data pipelines',
      'Strong SQL and at least one pipeline framework',
    ],
    questions: [
      'Describe a pipeline you built, and the way it failed on you.',
      'How do you make data others can actually trust?',
    ],
  },
  'Applied ML': {
    emphasis: [
      { name: 'Problem Solving', tier: 'High' },
      { name: 'Learning Agility', tier: 'High' },
    ],
    gates: [
      'Has shipped a model to production',
      'Solid grounding in ML fundamentals',
    ],
    questions: [
      'Walk me through a model you took all the way to production.',
      'It works offline but fails in production. What do you check first?',
    ],
  },
  'Frontend engineering': {
    emphasis: [
      { name: 'Execution', tier: 'High' },
      { name: 'Collaboration', tier: 'High' },
    ],
    gates: [
      'Strong with a modern frontend framework',
      'Cares about accessibility and performance',
    ],
    questions: [
      'Tell me about a complex interface you built, and the tradeoffs.',
      'How do you keep a large frontend fast and accessible as it grows?',
    ],
  },
}

// ── Translation layer ────────────────────────────────────────────────────────
//
// The recruiter's words drive WHAT GETS ASKED. Our competencies drive HOW IT GETS
// SCORED. When a recruiter names something specific ("cross-timezone
// collaboration"), we map it onto our fixed rubric and say so, keeping their exact
// words as a probe on the interview question. A recruiter phrase never becomes a
// new scoring dimension and never changes the rubric.

// A first-person base question per universal. The recruiter's phrase rides on top
// of one of these as a probe; it shapes what is asked, not how it is scored.
const COMPETENCY_QUESTION = {
  Communication: 'Walk me through how you keep people aligned on your work.',
  'Problem Solving': 'Walk me through a hard problem you untangled.',
  Ownership: 'Tell me about something you owned end to end.',
  'Learning Agility': 'Tell me about picking up something unfamiliar, fast.',
  Execution: 'Tell me about consistently shipping to a deadline.',
  Collaboration: 'Tell me about working closely with people outside your team.',
}

// Maps a recruiter concern to the competencies we score it under. Ordered
// most-specific first. The first matched rule wins; comps[0] is the primary, the
// one the concern is surfaced against on the card.
const CONCERN_RULES = [
  { test: /time\s*zone|cross-?time|\basync\b|distributed team|remote-?first/i, comps: ['Collaboration', 'Communication'] },
  { test: /stakeholder|cross-?functional|align|influenc|buy-?in/i, comps: ['Communication', 'Collaboration'] },
  { test: /mentor|coach|grow(ing)?\s+(people|juniors?|the team)|level up/i, comps: ['Ownership', 'Communication'] },
  { test: /ambigu|from scratch|0\s*to\s*1|zero\s*to\s*one|greenfield|figure (it|things) out|unstructured|undefined/i, comps: ['Problem Solving', 'Ownership'] },
  { test: /\bship|deliver|deadline|pace|velocity|move fast/i, comps: ['Execution'] },
  { test: /learn|pick(s|ed)? up|ramp|new (stack|tech|domain)|adapt/i, comps: ['Learning Agility'] },
  { test: /own(ership)?|end.to.end|autonom|drive(s|n)?\b|without hand-?holding/i, comps: ['Ownership'] },
  { test: /writ|documentation|\bdocs\b|articulate/i, comps: ['Communication'] },
]

// Translate a recruiter's phrase into our rubric. Returns the mapped competencies
// and their exact words, or null when nothing specific was named (so we never
// invent a mapping). Keeps the phrase verbatim: it is theirs.
export function translateConcern(text = '') {
  const phrase = text.trim().replace(/\s+/g, ' ')
  if (phrase.length < 3) return null
  for (const rule of CONCERN_RULES) {
    if (rule.test.test(phrase)) {
      return { phrase, competencies: rule.comps, primary: rule.comps[0] }
    }
  }
  return null
}

// Turn a translation into the probe that hangs off an interview question. The
// probe carries the recruiter's exact phrase; it shapes the question, never the
// rubric.
export function buildProbe(translation) {
  const { primary } = translation
  return {
    ...translation,
    baseQuestion: COMPETENCY_QUESTION[primary] ?? 'Tell me about a relevant recent example.',
    instruction: `Probe for “${translation.phrase}”: ask for a concrete recent example and what they personally did.`,
  }
}

// The starting draft for a title, or null when the title does not map cleanly to
// a family (an unusual or hybrid role). A null draft is the exception path: the
// flow falls back to the fuller question set rather than anchoring the recruiter
// on a guess it is not confident in.
export function roleDraft(title = '') {
  const domain = roleDomain(title)
  const base = domain && DRAFT_BY_DOMAIN[domain]
  if (!base) return null
  return {
    title,
    domain,
    summary: domainSummary(domain),
    emphasis: base.emphasis,
    gates: base.gates,
    questions: base.questions,
  }
}

// ── The interview ────────────────────────────────────────────────────────────
//
// The interview the AI builds from a confirmed role card. Every question maps to
// fixed competencies (how it is scored); its text is the recruiter's to edit
// (what is asked). Editing the text never changes the competencies. A question
// that tests a gate is MUST ASK and cannot be skipped; everything else is AI
// discretion by default.

// The competencies a question may map to: the six universals plus this role's
// domain. Recruiter-added questions pick from exactly this fixed set, so nothing
// scores against an unmapped dimension.
export function rubricFor(title = '') {
  const domain = roleDomain(title)
  return domain ? [...BASELINE_COMPETENCIES, domain] : [...BASELINE_COMPETENCIES]
}

// The plain-language "why this question" line, from its mapping. Same helper for
// generated and recruiter-added questions, so the reason always reads the same.
export function questionWhy(q) {
  const tests = q.competencies.join(' and ')
  let s = `${q.probes} Tests ${tests}.`
  if (q.phrase) s += ` From your words: “${q.phrase}”.`
  if (q.gate) s += ' This is a deal-breaker, so it is always asked.'
  return s
}

// The interview is a screen, not a replacement for the offline rounds: short,
// sectioned, 5 to 7 questions. It derives cleanly from the criteria list: every
// question exists to test exactly one criterion the recruiter saw and approved.
export const INTERVIEW_SECTIONS = [
  { key: 'warmup', title: 'Warm-up', purpose: 'Settles them in. Lightly scored.' },
  { key: 'core', title: 'Core', purpose: 'Tests your deal-breakers and what you marked most important.' },
  { key: 'role', title: 'Role', purpose: 'Tests the craft of the role.' },
]

// A short interview: roughly four minutes a question, held to the 20 to 30 minute
// band. One estimate, shared by the completion screen and the review screen.
export function estimatedMinutes(count) {
  return Math.min(30, Math.max(20, Math.round((count * 4) / 5) * 5))
}

// A behavioural question that tests a criterion. Keyed by criterion name so it
// reads naturally; a generic fallback covers anything recruiter-added.
const QUESTION_FOR = {
  'Product Sense': 'Walk me through a product you think is well made, and one you think is not. What is the difference?',
  Communication: 'Explain something you built to me as if I have no background in it.',
  'Problem Solving': 'Tell me about a messy, ambiguous problem you untangled. How did you get to a call?',
  Ownership: 'Tell me about something you took from unclear to done without being chased.',
  'User Empathy': 'Tell me about a time you started from the user’s problem, not the feature you wanted to build.',
  'Data Literacy': 'Walk me through a decision you made by reading the numbers. What did they tell you?',
  Collaboration: 'To start, tell me about a project you worked on with others, and what your part was.',
  'Code Quality': 'Walk me through a piece of code you are proud of, and why.',
  'Systems Thinking': 'Design a simple system for something, then tell me where it breaks first.',
  'Learning Speed': 'Tell me about picking up something unfamiliar fast, and how you did it.',
  Craft: 'Show me a project where research or feedback changed your design.',
  Curiosity: 'Tell me about something you explored just to understand it better.',
  'People Leadership': 'Tell me about someone you helped grow, and what you actually did.',
  Judgement: 'Tell me about a call you made with incomplete information.',
  Coaching: 'How do you help someone get past where they are stuck?',
  Delivery: 'How do you keep a team shipping steadily?',
  'ML Foundations': 'Walk me through how a model you have used actually works.',
  Experimentation: 'Tell me about an experiment you ran and what you learned.',
  Execution: 'Tell me about consistently shipping something to a deadline.',
  'Data Rigour': 'How do you make sure data that others rely on is trustworthy?',
  'UI Execution': 'Tell me about a polished interface you built, and the trade-offs.',
  'Attention to Detail': 'Tell me about catching a small thing that would have caused a big problem.',
  Prioritisation: 'How do you choose what to build next, and defend it?',
  Storytelling: 'Tell me about a time you moved people to a decision.',
  Adaptability: 'Tell me about a time the plan changed and how you adjusted.',
  Initiative: 'Tell me about useful work you started without being told to.',
  'Design Craft': 'Show me a project where research changed your design.',
}
export function questionFor(name) {
  return QUESTION_FOR[name] ?? `Tell me about a time you showed ${name.toLowerCase()}.`
}

// How we interview for a criterion, in plain recruiter language: the approach (no
// question text, since the AI adapts live) and what we listen for. Communication
// is read from how they answer everything, not a separate question.
const INTERVIEW_APPROACH = {
  'Product Sense': { approach: 'We give them a real product situation and ask what they would change and why.', listen: 'whether they reason from the user’s problem, or from features.' },
  Communication: { mode: 'read', approach: 'We do not ask a separate question for this. We read it from how they answer everything.', listen: 'whether they explain their thinking clearly, in writing and out loud.' },
  'Problem Solving': { approach: 'We hand them a messy, open-ended problem and follow how they break it down.', listen: 'whether they structure it and reach a call, or go in circles.' },
  Ownership: { approach: 'We ask them to walk through something they carried end to end.', listen: 'whether they drove it, or were carried along.' },
  'User Empathy': { approach: 'We ask about building for a user unlike themselves.', listen: 'whether they start from the user’s problem, or their own idea.' },
  'Data Literacy': { approach: 'We give them a simple set of numbers and ask what they would conclude.', listen: 'whether they read it soundly, or reach past the evidence.' },
  Collaboration: { approach: 'We ask about working through a disagreement with another team.', listen: 'whether they move it forward, or dig in.' },
  'Code Quality': { approach: 'We look at a piece of code with them and ask what they would change.', listen: 'whether they think about the next reader, or only correctness.' },
  'Systems Thinking': { approach: 'We ask them to sketch a simple system and find where it breaks first.', listen: 'whether they see the failure points, or only the happy path.' },
  'Learning Speed': { approach: 'We ask about the last unfamiliar thing they had to pick up fast.', listen: 'whether they went deep, or stayed on the surface.' },
  'UI Execution': { approach: 'We walk through an interface they built and the trade-offs they made.', listen: 'whether they weigh polish, access, and speed, or chase one.' },
  Craft: { approach: 'We look at a project and ask how research or feedback changed it.', listen: 'whether the work is considered, or first-draft.' },
  'People Leadership': { approach: 'We ask about someone they helped grow, and what they actually did.', listen: 'whether they take responsibility for people, not only tasks.' },
  Judgement: { approach: 'We put them in a call with incomplete information.', listen: 'whether they reason to a decision, or wait for certainty.' },
  'Data Rigour': { approach: 'We ask how they make data others rely on trustworthy.', listen: 'whether they build in checks, or hope for the best.' },
  Execution: { approach: 'We ask about shipping something real to a deadline.', listen: 'whether they finish cleanly, or leave loose ends.' },
  'ML Foundations': { approach: 'We ask them to explain how a model they have used actually works.', listen: 'whether the understanding is real, or borrowed.' },
  Experimentation: { approach: 'We ask about an experiment they ran and what it taught them.', listen: 'whether they learn from it, or just report it.' },
}

// Some criteria cannot be assessed in a conversation (a language, a location, a
// credential). Those are checked from the profile, and we say so.
const PROFILE_RE = /language|location|degree|visa|authoris|eligib|based in|relocat/i

export function approachFor(name = '') {
  if (PROFILE_RE.test(name)) {
    return { mode: 'profile', approach: 'Checked from their profile, not the interview.', listen: null }
  }
  return (
    INTERVIEW_APPROACH[name] ?? {
      approach: `We ask for a concrete example of ${name.toLowerCase()} in their work.`,
      listen: 'whether it holds up under a follow-up, or thins out.',
    }
  )
}

// One interview question, built to test a single criterion. Its wording is the
// recruiter's to edit; what is locked (for an Essential) is only the priority.
function questionForCriterion(section, c, id) {
  const locked = c.importance === 'essential'
  return {
    id,
    section,
    text: questionFor(c.name),
    criterion: { name: c.name, importance: c.importance, desc: c.desc, comp: c.comp },
    priority: locked ? 'must' : 'discretion',
    locked,
    lockReason: locked ? c.name : null,
  }
}

// Assemble the interview from the criteria list. Warm-up is one soft opener; Core
// holds the Essential criteria (always, locked) plus Very Important up to a cap of
// three; Role tests the rest. A role with more high-priority criteria than the
// short interview can hold leaves some untested, surfaced by the coverage check.
export function buildInterview({ title = 'New role', criteria } = {}) {
  const list = criteria ?? roleCriteria(title)
  const essential = list.filter((c) => c.importance === 'essential')
  const veryImportant = list.filter((c) => c.importance === 'veryImportant')
  const nice = list.filter((c) => c.importance === 'nice')

  const rows = []
  let n = 0

  // WARM-UP: one soft opener, from a Nice to have (a settling, low-stakes ask).
  const warm = nice[nice.length - 1]
  if (warm) rows.push(questionForCriterion('warmup', warm, `q${++n}`))

  // CORE: every Essential, then Very Important up to a cap of three total.
  const CORE_CAP = 3
  essential.forEach((c) => rows.push(questionForCriterion('core', c, `q${++n}`)))
  const coreVi = Math.max(0, CORE_CAP - essential.length)
  veryImportant.slice(0, coreVi).forEach((c) => rows.push(questionForCriterion('core', c, `q${++n}`)))

  // ROLE: the remaining Very Important and Nice criteria, minus the warm-up.
  const rest = [...veryImportant.slice(coreVi), ...nice.filter((c) => !warm || c.name !== warm.name)]
  rest.slice(0, 3).forEach((c) => rows.push(questionForCriterion('role', c, `q${++n}`)))

  return rows
}

// The Essential and Very Important criteria a short interview left untested, so a
// criterion the recruiter marked as mattering is never silently dropped.
export function untestedEssentials(title = '', questions = []) {
  const tested = new Set(questions.map((q) => q.criterion?.name))
  return roleCriteria(title)
    .filter((c) => c.importance === 'essential' || c.importance === 'veryImportant')
    .filter((c) => !tested.has(c.name))
}
