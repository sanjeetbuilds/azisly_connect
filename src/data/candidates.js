// Demo data for the candidate review prototype.
// Avatars are placeholder photos (pravatar) keyed by a stable id.

export const STAGES = ['Sourced', 'Defined', 'Interviewed', 'Judged', 'Decided']

const avatar = (n) => `https://i.pravatar.cc/160?img=${n}`

export const candidates = [
  {
    id: 'maya-okonkwo',
    name: 'Maya Okonkwo',
    role: 'Senior Product Engineer',
    score: 86,
    verdict: 'strong',
    stage: 'Judged',
    avatar: avatar(47),
    experience: '8 yrs',
    location: 'Lisbon · Remote',
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
          'I paired with two new hires for their first month — both shipped to production in week two.',
        competency: 'Ownership',
        source: 'Interview · Round 1',
      },
    ],
  },
  {
    id: 'hana-kim',
    name: 'Hana Kim',
    role: 'Product Engineer',
    score: 90,
    verdict: 'strong',
    stage: 'Decided',
    avatar: avatar(9),
    experience: '6 yrs',
    location: 'Seoul · Remote',
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
    score: 82,
    verdict: 'strong',
    stage: 'Judged',
    avatar: avatar(32),
    experience: '7 yrs',
    location: 'Porto · Hybrid',
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
          'I write the empty and error states first — they tell you the most about a feature.',
        competency: 'Communication',
        source: 'Interview · Round 1',
      },
    ],
  },
  {
    id: 'daniel-reyes',
    name: 'Daniel Reyes',
    role: 'Backend Engineer',
    score: 79,
    verdict: 'strong',
    stage: 'Interviewed',
    avatar: avatar(12),
    experience: '9 yrs',
    location: 'Mexico City · Remote',
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
    score: 64,
    verdict: 'look-closer',
    stage: 'Interviewed',
    avatar: avatar(5),
    experience: '5 yrs',
    location: 'Bangalore · Remote',
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
          'I tend to go quiet when I am deep in a problem — something I am working on with my current lead.',
        competency: 'Communication',
        source: 'Interview · Round 1',
      },
    ],
  },
  {
    id: 'liam-patel',
    name: 'Liam Patel',
    role: 'Infrastructure Engineer',
    score: 58,
    verdict: 'look-closer',
    stage: 'Defined',
    avatar: avatar(51),
    experience: '4 yrs',
    location: 'Manchester · Hybrid',
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
]

export const workspace = {
  name: 'Aryan Mehta',
  role: 'Recruiting · Acme',
  avatar: avatar(68),
}
