// Roles/jobs for the workspace.

// Plain-word status, with a functional colour for its tag.
export const ROLE_STATUS = {
  defining: { label: 'Defining', color: 'gray' },
  sourcing: { label: 'Sourcing', color: 'blue' },
  ready: { label: 'Ready to review', color: 'green' },
}

// A populated workspace with mixed statuses (Screen 6).
export const seedRoles = [
  {
    id: 'r-spe',
    title: 'Senior Product Engineer',
    location: 'Remote · Europe',
    type: 'Full-time',
    status: 'ready',
    candidatesReady: 6,
    totalCandidates: 18,
    updated: 'Updated 2h ago',
  },
  {
    id: 'r-de',
    title: 'Data Engineer',
    location: 'Remote · Europe',
    type: 'Contract',
    status: 'ready',
    candidatesReady: 3,
    totalCandidates: 7,
    updated: 'Updated 5h ago',
  },
  {
    id: 'r-pd',
    title: 'Product Designer',
    location: 'Remote · Global',
    type: 'Full-time',
    status: 'sourcing',
    candidatesReady: 0,
    totalCandidates: 11,
    updated: 'Updated yesterday',
  },
  {
    id: 'r-be',
    title: 'Backend Engineer',
    location: 'Berlin · Hybrid',
    type: 'Full-time',
    status: 'sourcing',
    candidatesReady: 0,
    totalCandidates: 9,
    updated: 'Updated 2d ago',
  },
  {
    id: 'r-em',
    title: 'Engineering Manager',
    location: 'London · Onsite',
    type: 'Full-time',
    status: 'defining',
    candidatesReady: 0,
    totalCandidates: 0,
    updated: 'Draft · just now',
  },
]

export function makeApprovedRole(id, title) {
  return {
    id,
    title,
    location: 'Remote · Europe',
    type: 'Full-time',
    status: 'sourcing',
    candidatesReady: 0,
    totalCandidates: 0,
    updated: 'Updated just now',
  }
}
