// Demo data for the candidate review prototype.
// Avatars are placeholder photos (pravatar) keyed by a stable id.

// One candidate lifecycle, used across the app. Ordered: each state makes the
// next action obvious.
//   Sourced       added, not yet invited
//   Invited       interview invite sent, awaiting the candidate
//   Interviewing  AI interview in progress
//   Scored        interview done, engine produced a score and verdict
//   Needs human   a gate failed or the candidate is flagged, needs a human look
//   Shared        sent to the hiring manager, awaiting their picks
//   Taken forward hiring manager approved, moving to offline rounds
//   Passed        not selected
export const STAGES = [
  'Sourced',
  'Invited',
  'Interviewing',
  'Scored',
  'Needs human',
  'Shared',
  'Taken forward',
  'Passed',
]

// The tag colour for each lifecycle state. Needs human is amber (attention);
// Taken forward green (positive); Passed rose (closed).
export const STAGE_META = {
  Sourced: { color: 'gray' },
  Invited: { color: 'blue' },
  Interviewing: { color: 'purple' },
  Scored: { color: 'gray' },
  'Needs human': { color: 'amber' },
  Shared: { color: 'blue' },
  'Taken forward': { color: 'green' },
  Passed: { color: 'rose' },
}

// The linear milestone track shown in the detail StageTracker. The branch and
// terminal states map onto a milestone: Needs human sits at Scored, and both
// Taken forward and Passed land on the final Decision step.
export const STAGE_TRACK = ['Sourced', 'Invited', 'Interviewing', 'Scored', 'Shared', 'Decision']
const TRACK_INDEX = {
  Sourced: 0,
  Invited: 1,
  Interviewing: 2,
  Scored: 3,
  'Needs human': 3,
  Shared: 4,
  'Taken forward': 5,
  Passed: 5,
}
export const stageTrackIndex = (stage) => TRACK_INDEX[stage] ?? 0

// Sources carry a functional colour (where the candidate came from).
export const SOURCES = {
  referral: { label: 'Referral', color: 'green' },
  linkedin: { label: 'LinkedIn', color: 'blue' },
  careers: { label: 'Careers page', color: 'gray' },
  agency: { label: 'Agency', color: 'purple' },
}

const avatar = (n) => `https://i.pravatar.cc/160?img=${n}`

export const candidates = [
  {
    id: 'maya-okonkwo',
    name: 'Maya Okonkwo',
    role: 'Senior Product Engineer',
    location: 'Lisbon',
    experience: '8 yrs',
    score: 86,
    verdict: 'strong',
    stage: 'Taken forward',
    source: 'referral',
    applied: 'Jun 18',
    appliedSort: 18,
    skills: ['React', 'TypeScript', 'System design', 'GraphQL'],
    avatar: avatar(47),
    competencies: [
      { name: 'System design', score: 88 },
      { name: 'Communication', score: 84 },
      { name: 'Ownership', score: 91 },
      { name: 'Code quality', score: 78 },
    ],
    evidence: [
      {
        quote:
          'I rewrote our ingestion pipeline to be idempotent, which let us replay a week of failed events without a single duplicate.',
        competency: 'System design',
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
    score: 90,
    verdict: 'strong',
    stage: 'Taken forward',
    source: 'linkedin',
    applied: 'Jun 21',
    appliedSort: 21,
    skills: ['React', 'Node.js', 'Product', 'Design systems'],
    avatar: avatar(9),
    competencies: [
      { name: 'System design', score: 86 },
      { name: 'Communication', score: 93 },
      { name: 'Ownership', score: 89 },
      { name: 'Code quality', score: 90 },
    ],
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
    verdict: 'strong',
    stage: 'Shared',
    source: 'careers',
    applied: 'Jun 15',
    appliedSort: 15,
    skills: ['React', 'CSS', 'Accessibility', 'Testing'],
    avatar: avatar(32),
    competencies: [
      { name: 'System design', score: 74 },
      { name: 'Communication', score: 88 },
      { name: 'Ownership', score: 83 },
      { name: 'Code quality', score: 86 },
    ],
    evidence: [
      {
        quote:
          'I built a component contract test suite that caught three regressions before they reached the design team.',
        competency: 'Code quality',
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
    score: 79,
    verdict: 'strong',
    stage: 'Scored',
    source: 'agency',
    applied: 'Jun 12',
    appliedSort: 12,
    skills: ['Go', 'Postgres', 'Kafka', 'Distributed systems'],
    avatar: avatar(12),
    competencies: [
      { name: 'System design', score: 85 },
      { name: 'Communication', score: 71 },
      { name: 'Ownership', score: 80 },
      { name: 'Code quality', score: 79 },
    ],
    evidence: [
      {
        quote:
          'I introduced a queue between the API and the workers so a slow downstream never takes the front door with it.',
        competency: 'System design',
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
    verdict: 'look-closer',
    stage: 'Needs human',
    source: 'linkedin',
    applied: 'Jun 09',
    appliedSort: 9,
    skills: ['Terraform', 'AWS', 'Kubernetes', 'CI/CD'],
    avatar: avatar(5),
    competencies: [
      { name: 'System design', score: 72 },
      { name: 'Communication', score: 58 },
      { name: 'Ownership', score: 66 },
      { name: 'Code quality', score: 61 },
    ],
    evidence: [
      {
        quote:
          'I standardised our Terraform modules, though I leaned on the existing patterns more than rethinking them.',
        competency: 'System design',
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
    verdict: 'look-closer',
    stage: 'Passed',
    source: 'careers',
    applied: 'Jun 05',
    appliedSort: 5,
    skills: ['Kubernetes', 'AWS', 'Observability'],
    avatar: avatar(51),
    competencies: [
      { name: 'System design', score: 64 },
      { name: 'Communication', score: 60 },
      { name: 'Ownership', score: 55 },
      { name: 'Code quality', score: 52 },
    ],
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
        competency: 'Code quality',
        source: 'Take-home review',
      },
    ],
  },

  // Early-lifecycle candidates: not yet scored, so no score or verdict.
  {
    id: 'noah-becker',
    name: 'Noah Becker',
    role: 'Backend Engineer',
    location: 'Berlin',
    experience: '6 yrs',
    score: null,
    verdict: null,
    stage: 'Sourced',
    source: 'referral',
    applied: 'Jun 26',
    appliedSort: 26,
    skills: ['Go', 'gRPC', 'Postgres', 'Redis'],
    avatar: avatar(13),
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
    verdict: null,
    stage: 'Sourced',
    source: 'agency',
    applied: 'Jun 25',
    appliedSort: 25,
    skills: ['Kubernetes', 'Terraform', 'AWS', 'Observability'],
    avatar: avatar(15),
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
    verdict: null,
    stage: 'Sourced',
    source: 'linkedin',
    applied: 'Jun 24',
    appliedSort: 24,
    skills: ['Python', 'Spark', 'dbt', 'Airflow'],
    avatar: avatar(45),
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
    verdict: null,
    stage: 'Invited',
    source: 'careers',
    applied: 'Jun 23',
    appliedSort: 23,
    skills: ['React', 'TypeScript', 'CSS', 'Testing'],
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
    verdict: null,
    stage: 'Interviewing',
    source: 'referral',
    applied: 'Jun 22',
    appliedSort: 22,
    skills: ['React', 'Node.js', 'Product', 'GraphQL'],
    avatar: avatar(33),
    competencies: [],
    evidence: [],
  },
]

export const workspace = {
  name: 'Aryan Mehta',
  role: 'Recruiting · Acme',
  avatar: avatar(68),
}
