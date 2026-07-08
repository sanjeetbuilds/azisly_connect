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

// The universal floor: the single flat baseline every candidate must clear on
// each universal competency. It is the SAME on every role (universals are not
// targeted per-role). Falling below it is disqualifying-level, not a soft
// shortfall. The gate (50) is the hard floor on gated universals; this floor
// (65) is the bar of a strong candidate on any universal.
export const UNIVERSAL_FLOOR = 65

// The role-specific target for the DOMAIN competency only. Unlike the universals,
// the domain has a real per-role target that varies by role. The detail draws a
// distinct marker here so "met what THIS role needs on its domain" reads apart
// from "cleared the flat universal floor everyone clears".
export const ROLE_TARGETS = {
  'Product craft': 75,
}

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

// The single most relevant experience item for the matched table. Freshers with
// no jobs return null (rendered as a dash); the full history lives in the panel.
export function topExperienceOf(c) {
  return c.work && c.work.length ? c.work[0] : null
}

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

// Only TWO scores exist in the product, always labelled separately:
//   match   0-100  pre-interview fit estimate — the ONLY score on the matched
//                  list, shown before any interview happens.
//   score   0-100  the interview score — appears later, in the candidate detail
//                  after the interview, and carries a verdict colour.
// Each candidate also carries pre-interview profile fields used by the matched
// list and its requirement filters: course, discipline, percentage (academics),
// expYears, strengths (competency hints), and work (roles incl. pre-MBA).

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
    course: 'BTech',
    discipline: 'Computer Science',
    percentage: 84,
    expYears: 8,
    strengths: ['Problem solving', 'Ownership', 'Execution'],
    work: ['Senior Engineer · Stripe · 3 yrs', 'Engineer · Feedzai · 3 yrs', 'Intern · Google · 6 mo'],
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
    course: 'BE',
    discipline: 'Computer Science',
    percentage: 88,
    expYears: 6,
    strengths: ['Communication', 'Collaboration', 'Product craft'],
    work: ['Product Engineer · Toss · 4 yrs', 'Intern · Naver · 6 mo'],
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
    course: 'BSc',
    discipline: 'Computer Science',
    percentage: 79,
    expYears: 7,
    strengths: ['Accessibility', 'Execution', 'Communication'],
    work: ['Frontend Engineer · Farfetch · 4 yrs', 'Intern · Talkdesk · 6 mo'],
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
    course: 'BE',
    discipline: 'Software Engineering',
    percentage: 76,
    expYears: 9,
    strengths: ['Distributed systems', 'Problem solving'],
    work: ['Backend Engineer · Nubank · 5 yrs', 'Engineer · Konfio · 3 yrs'],
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
    course: 'BTech',
    discipline: 'Information Technology',
    percentage: 72,
    expYears: 5,
    strengths: ['Infrastructure', 'Execution'],
    work: ['Platform Engineer · Razorpay · 3 yrs', 'Intern · Infosys · 6 mo'],
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
    course: 'BEng',
    discipline: 'Computer Science',
    percentage: 68,
    expYears: 4,
    strengths: ['Observability', 'Ownership'],
    work: ['Infra Engineer · Monzo · 2 yrs', 'Intern · ARM · 6 mo'],
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
    course: 'MSc',
    discipline: 'Computer Science',
    percentage: 81,
    expYears: 0,
    strengths: ['gRPC', 'Problem solving'],
    // Fresher: no formal jobs yet, only projects during and after graduation.
    work: [],
    projects: ['Open-source gRPC load balancer', 'Realtime chat app (side project)'],
    matchSummary: 'Strong on backend fundamentals and problem solving for this role.',
    matchReasons: [
      { competency: 'Problem Solving', note: 'Built an open-source gRPC load balancer, reasoning through backpressure and retries.' },
      { competency: 'Backend depth', note: 'Go, gRPC, Postgres, and Redis across side projects, close to the stack this role needs.' },
      { competency: 'Learning Agility', note: 'Shipped two substantial projects during and after graduation.' },
    ],
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
    course: 'BEng',
    discipline: 'Data Engineering',
    percentage: 83,
    expYears: 1,
    strengths: ['Data pipelines', 'Execution'],
    // Internship only: a single six-month stint during graduation.
    work: ['6 mo internship · Shopee'],
    matchSummary: 'Strong on data pipelines and delivery for this role.',
    matchReasons: [
      { competency: 'Execution', note: 'Ran dbt and Airflow pipelines end to end during a six-month internship.' },
      { competency: 'Data engineering', note: 'Python, Spark, dbt, and Airflow map directly to this role.' },
    ],
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
    course: 'MBA',
    discipline: 'Operations',
    percentage: 78,
    expYears: 7,
    strengths: ['Kubernetes', 'Ownership'],
    work: ['Platform Engineer · Careem · 3 yrs', 'Pre-MBA: Ops Analyst · Aramex · 3 yrs'],
    matchSummary: 'Strong on platform ownership and infrastructure depth for this role.',
    matchReasons: [
      { competency: 'Ownership', note: 'Owned platform reliability at Careem through a noisy quarter.' },
      { competency: 'Infrastructure', note: 'Kubernetes, Terraform, and AWS in production.' },
    ],
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
    course: 'BTech',
    discipline: 'Computer Science',
    percentage: 86,
    expYears: 6,
    strengths: ['React', 'TypeScript', 'Testing'],
    work: ['Frontend Engineer · Andela · 4 yrs', 'Intern · Wave · 6 mo'],
    matchSummary: 'Strong on frontend craft and testing for this role.',
    matchReasons: [
      { competency: 'Frontend craft', note: 'React and TypeScript at Andela, with a testing habit.' },
      { competency: 'Execution', note: 'Shipped features end to end with contract tests.' },
    ],
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
    stage: 'Invited',
    declinedInterview: true, // the candidate turned down the interview
    source: 'referral',
    applied: 'Jun 22',
    appliedSort: 22,
    skills: ['React', 'Node.js', 'Product', 'GraphQL'],
    match: 82,
    course: 'BE',
    discipline: 'Computer Science',
    percentage: 80,
    expYears: 7,
    strengths: ['React', 'Product craft'],
    work: ['Product Engineer · Mercari · 4 yrs', 'Intern · Rakuten · 6 mo'],
    matchSummary: 'Strong on product engineering for this role.',
    matchReasons: [
      { competency: 'Product craft', note: 'Product Engineer at Mercari, shipping user-facing features.' },
      { competency: 'Frontend', note: 'React, Node, and GraphQL across the stack.' },
    ],
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
