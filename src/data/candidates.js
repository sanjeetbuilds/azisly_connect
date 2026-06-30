// Demo data for the candidate review prototype.
// Avatars are placeholder photos (pravatar) keyed by a stable id.

// The ABI engine scores seven competencies. Six are fixed; the seventh (Domain)
// takes a label that changes per role. For the Senior Product Engineer role the
// Domain label is "Product craft". A competency scored below the gate threshold
// fails a gate, even when the overall is healthy.
export const GATE = 50
export const CORE_COMPETENCIES = [
  'Communication',
  'Problem Solving',
  'Ownership',
  'Learning Agility',
  'Execution',
  'Collaboration',
]
export const DOMAIN_LABEL = 'Product craft'

// The engine outputs three verdicts: recommend, promising, not-yet. We key them
// as strong | promising | not-yet and label them Strong | Promising | Not yet.
export const VERDICTS = ['strong', 'promising', 'not-yet']

// One candidate lifecycle. A scored candidate shows the next meaningful state
// (Ready to review or Needs human), never "Scored" itself.
export const STAGES = [
  'Sourced',
  'Invited',
  'Interviewing',
  'Ready to review',
  'Needs human',
  'Shared',
  'Taken forward',
  'Passed',
]

const SHARED_OR_DECIDED = ['Shared', 'Taken forward', 'Passed']
// Scored = the engine has produced a verdict.
export const isScored = (c) => Boolean(c.verdict)

// The competencies this role gates, checked against GATE. Shown and explained in
// the candidate detail.
export const GATED_COMPETENCIES = ['Communication', 'Ownership']

// The candidate's interview status in plain recruiter language, derived from the
// lifecycle. The list shows this single status; the score carries the verdict.
export function interviewStatus(c) {
  if (c.score != null) return 'Done' // interview completed and judged
  if (c.lapsed) return 'Lapsed' // invite expired with no interview
  if (c.stage === 'Interviewing') return 'Pending' // invited, not yet completed
  if (c.stage === 'Invited') return 'Invite sent'
  return 'Not invited' // Sourced
}
// Ready to review = scored and not yet shared or decided. One source of truth.
export const isReadyToReview = (c) => isScored(c) && !SHARED_OR_DECIDED.includes(c.stage)

// Overall = the mean of assessed competencies. Not-assessed (null) is excluded,
// never counted as 0.
export const assessedAverage = (comps = []) => {
  const vals = comps.map((c) => c.score).filter((v) => v != null)
  if (!vals.length) return null
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

// The linear milestone track shown in the detail StageTracker. Branch and
// terminal states map onto a milestone.
export const STAGE_TRACK = ['Sourced', 'Invited', 'Interviewing', 'Scored', 'Shared', 'Decided']
const TRACK_INDEX = {
  Sourced: 0,
  Invited: 1,
  Interviewing: 2,
  'Ready to review': 3,
  'Needs human': 3,
  Shared: 4,
  'Taken forward': 5,
  'Moving forward': 5,
  Passed: 5,
}
export const stageTrackIndex = (stage) => TRACK_INDEX[stage] ?? 0

// Mocked contact details, unlocked once a candidate is taken forward.
export function contactsFor(name) {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.')
  return { email: `${slug}@gmail.com`, phone: '+351 912 345 678' }
}

// Sources carry a functional colour (where the candidate came from).
export const SOURCES = {
  referral: { label: 'Referral', color: 'green' },
  linkedin: { label: 'LinkedIn', color: 'blue' },
  careers: { label: 'Careers page', color: 'gray' },
  agency: { label: 'Agency', color: 'purple' },
}

const avatar = (n) => `https://i.pravatar.cc/160?img=${n}`

// Build the seven-competency array (six core + one domain), null = not assessed.
const comps = ({ communication, problem, ownership, learning, execution, collaboration, domain }) => [
  { name: 'Communication', score: communication },
  { name: 'Problem Solving', score: problem },
  { name: 'Ownership', score: ownership },
  { name: 'Learning Agility', score: learning },
  { name: 'Execution', score: execution },
  { name: 'Collaboration', score: collaboration },
  { name: DOMAIN_LABEL, score: domain },
]

export const candidates = [
  {
    id: 'maya-okonkwo',
    name: 'Maya Okonkwo',
    role: 'Senior Product Engineer',
    location: 'Lisbon',
    experience: '8 yrs',
    score: 86,
    confidence: 92,
    verdict: 'strong',
    gate: null,
    stage: 'Taken forward',
    source: 'referral',
    applied: 'Jun 18',
    appliedSort: 18,
    skills: ['React', 'TypeScript', 'Product', 'GraphQL'],
    match: 88,
    avatar: avatar(47),
    competencies: comps({
      communication: 84,
      problem: 85,
      ownership: 91,
      learning: 82,
      execution: 88,
      collaboration: 86,
      domain: 84,
    }),
    evidence: [
      {
        quote:
          'I rewrote our ingestion pipeline to be idempotent, which let us replay a week of failed events without a single duplicate.',
        competency: 'Problem Solving',
        source: 'Interview · Round 2',
      },
      {
        quote:
          'I paired with two new hires for their first month, and both shipped to production in week two.',
        competency: 'Ownership',
        source: 'Interview · Round 1',
      },
    ],
  },
  {
    id: 'hana-kim',
    name: 'Hana Kim',
    role: 'Product Engineer',
    location: 'Seoul',
    experience: '6 yrs',
    score: 89,
    confidence: 96,
    verdict: 'strong',
    gate: null,
    stage: 'Taken forward',
    source: 'linkedin',
    applied: 'Jun 21',
    appliedSort: 21,
    skills: ['React', 'Node.js', 'Product', 'Design systems'],
    match: 91,
    avatar: avatar(9),
    competencies: comps({
      communication: 93,
      problem: 88,
      ownership: 89,
      learning: 86,
      execution: 90,
      collaboration: 91,
      domain: 88,
    }),
    evidence: [
      {
        quote:
          'I cut our onboarding flow from nine screens to three and watched activation climb 18 points in a month.',
        competency: 'Ownership',
        source: 'Take-home review',
      },
      {
        quote:
          'I keep a running design doc so reviewers see the trade-offs before they see the diff.',
        competency: 'Communication',
        source: 'Interview · Round 2',
      },
    ],
  },
  {
    id: 'sofia-almeida',
    name: 'Sofia Almeida',
    role: 'Frontend Engineer',
    location: 'Porto',
    experience: '7 yrs',
    score: 82,
    confidence: 88,
    verdict: 'strong',
    gate: null,
    stage: 'Shared',
    source: 'careers',
    applied: 'Jun 15',
    appliedSort: 15,
    skills: ['React', 'CSS', 'Accessibility', 'Testing'],
    match: 85,
    avatar: avatar(32),
    competencies: comps({
      communication: 88,
      problem: 74,
      ownership: 83,
      learning: 80,
      execution: 79,
      collaboration: 85,
      domain: 82,
    }),
    evidence: [
      {
        quote:
          'I built a component contract test suite that caught three regressions before they reached the design team.',
        competency: 'Execution',
        source: 'Interview · Round 2',
      },
      {
        quote:
          'I write the empty and error states first, because they tell you the most about a feature.',
        competency: 'Communication',
        source: 'Interview · Round 1',
      },
    ],
  },
  {
    id: 'daniel-reyes',
    name: 'Daniel Reyes',
    role: 'Backend Engineer',
    location: 'Mexico City',
    experience: '9 yrs',
    score: 73,
    confidence: 70,
    verdict: 'promising',
    gate: null,
    stage: 'Shared',
    source: 'agency',
    applied: 'Jun 12',
    appliedSort: 12,
    skills: ['Go', 'Postgres', 'Kafka', 'Distributed systems'],
    match: 80,
    avatar: avatar(12),
    // Product craft was not asked in this interview, so it is not assessed.
    competencies: comps({
      communication: 71,
      problem: 78,
      ownership: 74,
      learning: 70,
      execution: 76,
      collaboration: 68,
      domain: null,
    }),
    evidence: [
      {
        quote:
          'I introduced a queue between the API and the workers so a slow downstream never takes the front door with it.',
        competency: 'Problem Solving',
        source: 'Interview · Round 2',
      },
      {
        quote:
          'When the migration stalled at 2am I rolled it back myself and wrote the postmortem before standup.',
        competency: 'Ownership',
        source: 'Reference call',
      },
    ],
  },
  {
    id: 'priya-nair',
    name: 'Priya Nair',
    role: 'Platform Engineer',
    location: 'Bangalore',
    experience: '5 yrs',
    score: 64,
    confidence: 61,
    verdict: 'not-yet',
    // Strong overall, but Communication is below the gate, so a human is needed.
    gate: { competency: 'Communication', score: 44 },
    stage: 'Needs human',
    source: 'linkedin',
    applied: 'Jun 09',
    appliedSort: 9,
    skills: ['Terraform', 'AWS', 'Kubernetes', 'CI/CD'],
    match: 76,
    avatar: avatar(5),
    competencies: comps({
      communication: 44,
      problem: 72,
      ownership: 68,
      learning: 64,
      execution: 73,
      collaboration: 60,
      domain: 67,
    }),
    evidence: [
      {
        quote:
          'I standardised our Terraform modules, though I leaned on the existing patterns more than rethinking them.',
        competency: 'Execution',
        source: 'Interview · Round 1',
      },
      {
        quote:
          'I tend to go quiet when I am deep in a problem, something I am working on with my current lead.',
        competency: 'Communication',
        source: 'Interview · Round 1',
      },
    ],
  },
  {
    id: 'liam-patel',
    name: 'Liam Patel',
    role: 'Infrastructure Engineer',
    location: 'Manchester',
    experience: '4 yrs',
    score: 58,
    confidence: 54,
    verdict: 'promising',
    gate: null,
    stage: 'Ready to review',
    source: 'careers',
    applied: 'Jun 05',
    appliedSort: 5,
    skills: ['Kubernetes', 'AWS', 'Observability'],
    match: 70,
    avatar: avatar(51),
    competencies: comps({
      communication: 60,
      problem: 56,
      ownership: 55,
      learning: 58,
      execution: 57,
      collaboration: 60,
      domain: 60,
    }),
    evidence: [
      {
        quote:
          'I kept our clusters healthy through a noisy quarter, mostly by reacting fast rather than getting ahead of it.',
        competency: 'Ownership',
        source: 'Interview · Round 1',
      },
      {
        quote:
          'The on-call runbook I wrote helped, but a teammate had to fill the gaps on the database section.',
        competency: 'Execution',
        source: 'Take-home review',
      },
    ],
  },

  // Early-lifecycle candidates: not yet scored, so no verdict or competencies.
  {
    id: 'noah-becker',
    name: 'Noah Becker',
    role: 'Backend Engineer',
    location: 'Berlin',
    experience: '6 yrs',
    score: null,
    confidence: null,
    verdict: null,
    gate: null,
    stage: 'Sourced',
    source: 'referral',
    applied: 'Jun 26',
    appliedSort: 26,
    isNew: true, // matched by the AI after the recruiter's last view
    skills: ['Go', 'gRPC', 'Postgres', 'Redis'],
    match: 84,
    avatar: avatar(13),
    competencies: [],
    evidence: [],
  },
  {
    id: 'grace-liang',
    name: 'Grace Liang',
    role: 'Data Engineer',
    location: 'Singapore',
    experience: '5 yrs',
    score: null,
    confidence: null,
    verdict: null,
    gate: null,
    stage: 'Sourced',
    source: 'linkedin',
    applied: 'Jun 24',
    appliedSort: 24,
    isNew: true,
    skills: ['Python', 'Spark', 'dbt', 'Airflow'],
    match: 79,
    avatar: avatar(45),
    competencies: [],
    evidence: [],
  },
  {
    id: 'omar-haddad',
    name: 'Omar Haddad',
    role: 'Platform Engineer',
    location: 'Dubai',
    experience: '7 yrs',
    score: null,
    confidence: null,
    verdict: null,
    gate: null,
    stage: 'Invited',
    lapsed: true, // invite expired with no interview
    source: 'agency',
    applied: 'Jun 25',
    appliedSort: 25,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Observability'],
    match: 72,
    avatar: avatar(15),
    competencies: [],
    evidence: [],
  },
  {
    id: 'amara-diallo',
    name: 'Amara Diallo',
    role: 'Frontend Engineer',
    location: 'Dakar',
    experience: '6 yrs',
    score: null,
    confidence: null,
    verdict: null,
    gate: null,
    stage: 'Invited',
    source: 'careers',
    applied: 'Jun 23',
    appliedSort: 23,
    skills: ['React', 'TypeScript', 'CSS', 'Testing'],
    match: 88,
    avatar: avatar(44),
    competencies: [],
    evidence: [],
  },
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    role: 'Product Engineer',
    location: 'Tokyo',
    experience: '7 yrs',
    score: null,
    confidence: null,
    verdict: null,
    gate: null,
    stage: 'Interviewing',
    source: 'referral',
    applied: 'Jun 22',
    appliedSort: 22,
    skills: ['React', 'Node.js', 'Product', 'GraphQL'],
    match: 82,
    avatar: avatar(33),
    competencies: [],
    evidence: [],
  },
]

// One source of truth for the scoped role (Senior Product Engineer): the Roles
// screen number, the title count, and the ready count all derive from this.
export const roleTotals = {
  total: candidates.length,
  readyToReview: candidates.filter(isReadyToReview).length,
}

export const workspace = {
  name: 'Aryan Mehta',
  role: 'Recruiting · Acme',
  avatar: avatar(68),
}
