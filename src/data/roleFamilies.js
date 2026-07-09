// Role families — the single source of truth for what a role IS.
//
// The engine scores seven competencies: six universal (below) plus one Domain
// competency whose label changes per family. A role family fixes the domain, the
// two gates, and — once authored by hand — the criteria.
//
// PROHIBITIONS honoured here: no entry names a number of years, a degree, a
// college, a college tier, a salary, a location, or a named tool. Not as a
// value, not in a pattern, not in a comment that renders.
//
// criteria is authored by hand, per family, never computed and never inferred.
// Two families are authored so far (Product Manager, Software Engineer). The
// other nine ship an empty criteria array, which the UI flags AUTHORING NEEDED —
// never filled with a default, a sample, or a guess. Each criterion is
// { text, tier }, tier ∈ Essential | Very important | Nice to have.

// The six universal competencies. The seventh is the family's Domain competency.
export const UNIVERSAL_COMPETENCIES = [
  'Communication',
  'Problem Solving',
  'Ownership',
  'Learning Agility',
  'Execution',
  'Collaboration',
]

// The eleven families, in the fixed order the product owns. matchFamily() walks
// this order and returns the first hit, so narrower families are placed before
// broader ones where their patterns could overlap.
//
// Gates are internal — never shown, and the recruiter can neither set, add, nor
// remove one. Each family gates on its own domain competency plus one universal.
// The universal is Problem Solving, except Sales and Marketing / Customer Success
// (Communication) and Operations and Supply Chain (Execution). Program Manager is
// the deliberate exception: two universal gates (Execution, Collaboration) and no
// domain gate.
export const ROLE_FAMILIES = [
  {
    name: 'Product Manager',
    titlePatterns: [/product\s+manager/i, /product\s+owner/i, /\bapm\b/i],
    domainCompetency: 'Product craft',
    gates: ['Product craft', 'Problem Solving'],
    criteria: [
      { text: "Starts from the user's problem, not the feature", tier: 'Essential' },
      { text: 'Explains why they dropped something, not just what they built', tier: 'Essential' },
      { text: 'Names a metric that would show it worked, and says what that metric hides', tier: 'Essential' },
      { text: 'Weighs a trade-off out loud instead of jumping to the obvious side', tier: 'Very important' },
      { text: 'Can say what they would build first, and why that order', tier: 'Very important' },
      { text: 'Has an opinion about a product they use, and can defend it', tier: 'Nice to have' },
    ],
  },
  {
    name: 'Program Manager',
    titlePatterns: [/program(me)?\s+manager/i, /technical\s+program/i, /\btpm\b/i, /delivery\s+manager/i],
    domainCompetency: 'Program delivery',
    gates: ['Execution', 'Collaboration'],
    criteria: [],
  },
  {
    name: 'Software Engineer',
    titlePatterns: [
      /software\s+engineer/i,
      /software\s+developer/i,
      /back\s?-?end\s+engineer/i,
      /front\s?-?end\s+engineer/i,
      /full\s?-?stack/i,
      /platform\s+engineer/i,
      /\bsde\b/i,
    ],
    domainCompetency: 'System design',
    gates: ['System design', 'Problem Solving'],
    criteria: [
      { text: 'Writes working code for a problem they have not seen before', tier: 'Essential' },
      { text: 'Finds the cause of a bug instead of guessing at fixes', tier: 'Essential' },
      { text: 'Explains a design choice and says what it costs', tier: 'Very important' },
      { text: 'Picks a simple structure and can say when it would break', tier: 'Very important' },
      { text: 'Writes code another person can read months later', tier: 'Nice to have' },
    ],
  },
  {
    name: 'AI/ML Engineer',
    titlePatterns: [/machine\s+learning/i, /\bml\b/i, /\bai\b/i, /\bmlops\b/i, /deep\s+learning/i, /data\s+scien/i],
    domainCompetency: 'Applied ML',
    gates: ['Applied ML', 'Problem Solving'],
    criteria: [],
  },
  {
    name: 'Data Analyst',
    titlePatterns: [/data\s+analyst/i, /business\s+analyst/i, /business\s+intelligence/i, /data\s+analytics/i],
    domainCompetency: 'Data analysis',
    gates: ['Data analysis', 'Problem Solving'],
    criteria: [],
  },
  {
    name: 'UI/UX Designer',
    titlePatterns: [/designer/i, /\bux\b/i, /\bui\b/i, /product\s+design/i, /user\s+experience/i],
    domainCompetency: 'Design craft',
    gates: ['Design craft', 'Problem Solving'],
    criteria: [],
  },
  {
    name: 'Sales and Marketing',
    titlePatterns: [/sales/i, /marketing/i, /account\s+executive/i, /\bae\b/i, /demand\s+gen/i, /growth\s+marketing/i],
    domainCompetency: 'Go-to-market craft',
    gates: ['Go-to-market craft', 'Communication'],
    criteria: [],
  },
  {
    name: 'Customer Success',
    titlePatterns: [/customer\s+success/i, /\bcsm\b/i, /account\s+manager/i, /client\s+success/i, /customer\s+experience/i],
    domainCompetency: 'Customer outcomes',
    gates: ['Customer outcomes', 'Communication'],
    criteria: [],
  },
  {
    name: 'Operations and Supply Chain',
    titlePatterns: [/operations/i, /\bops\b/i, /supply\s+chain/i, /logistics/i, /procurement/i, /fulfil/i],
    domainCompetency: 'Operations craft',
    gates: ['Operations craft', 'Execution'],
    criteria: [],
  },
  {
    name: 'Consulting Analyst',
    titlePatterns: [/consultant/i, /consulting/i, /strategy\s+analyst/i, /management\s+consult/i],
    domainCompetency: 'Structured problem solving',
    gates: ['Structured problem solving', 'Problem Solving'],
    criteria: [],
  },
  {
    name: 'Financial Analyst',
    titlePatterns: [/financ(e|ial)\s+analyst/i, /\bfp&a\b/i, /investment\s+analyst/i, /equity\s+analyst/i, /financial\s+planning/i],
    domainCompetency: 'Financial analysis',
    gates: ['Financial analysis', 'Problem Solving'],
    criteria: [],
  },
]

export const FAMILY_NAMES = ROLE_FAMILIES.map((f) => f.name)

// Exact match: the first family whose title patterns fire. Null means no family
// owns this title — the load-bearing unmatched case, handled on screen, never as
// a silent blank.
export function matchFamily(title = '') {
  if (!title) return null
  for (const family of ROLE_FAMILIES) {
    if (family.titlePatterns.some((re) => re.test(title))) return family
  }
  return null
}

export function familyByName(name) {
  return ROLE_FAMILIES.find((f) => f.name === name) ?? null
}

// STUB — closest-family ranking. The real system ranks families semantically.
// This interim version scores word overlap between the title and each family's
// name + domain label, and falls back to the first family on a tie. It decides
// nothing that ships: it only pre-selects the guess on the unmatched screen,
// which the recruiter confirms or overrides. Logged in STUBS.md.
export function guessFamily(title = '') {
  const exact = matchFamily(title)
  if (exact) return exact
  const words = new Set(title.toLowerCase().split(/[^a-z]+/).filter(Boolean))
  let best = ROLE_FAMILIES[0]
  let bestScore = -1
  for (const family of ROLE_FAMILIES) {
    const hay = `${family.name} ${family.domainCompetency}`.toLowerCase().split(/[^a-z]+/).filter(Boolean)
    const score = hay.reduce((n, w) => n + (words.has(w) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      best = family
    }
  }
  return best
}
