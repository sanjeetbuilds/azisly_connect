// Roles/jobs for the workspace.

// The role lifecycle, in order. "Being defined" splits by who is writing the
// definition (see define_by below): the recruiter or the hiring manager.
export const ROLE_STATES = {
  created: 'Created',
  being_defined: 'Being defined',
  defined: 'Defined',
  matching: 'Matching',
  ready: 'Ready to review',
  closed: 'Closed',
}

// Two independent involvement switches, set at creation and editable later.
//   define_by:  'recruiter' | 'hiring_manager'        who writes the definition
//   approve_by: 'recruiter_alone' | 'hiring_manager'  who approves candidates
// All four combinations are valid. The app reads these two flags to decide what
// to show, rather than branching into separate flows per case.
export const DEFINE_BY_LABEL = {
  recruiter: 'Recruiter defines',
  hiring_manager: 'Hiring manager defines',
}
export const APPROVE_BY_LABEL = {
  recruiter_alone: 'Recruiter approves',
  hiring_manager: 'Hiring manager approves',
}

// A populated workspace spanning the lifecycle states.
export const seedRoles = [
  {
    id: 'r-spe',
    title: 'Product Engineer',
    location: 'Remote · Europe',
    type: 'Full-time',
    state: 'ready',
    define_by: 'recruiter',
    approve_by: 'hiring_manager',
    // Optional requirements — the matched list filter bar starts from these but
    // defaults to open so every match (including freshers) shows on first view.
    // This is a freshers product: there is no years-of-experience requirement.
    requirements: {
      location: null,
    },
    candidatesReady: 6,
    totalCandidates: 18,
    updated: 'Updated 2h ago',
  },
  {
    id: 'r-de',
    title: 'Data Engineer',
    location: 'Remote · Europe',
    type: 'Contract',
    state: 'matching',
    define_by: 'recruiter',
    approve_by: 'recruiter_alone',
    candidatesReady: 0,
    totalCandidates: 7,
    updated: 'Updated 5h ago',
  },
  {
    id: 'r-em',
    title: 'Engineering Manager',
    location: 'London · Onsite',
    type: 'Full-time',
    // Tom defined it via magic link, so it has just moved to Defined.
    state: 'defined',
    define_by: 'hiring_manager',
    approve_by: 'hiring_manager',
    definedBy: 'Tom',
    candidatesReady: 0,
    totalCandidates: 0,
    updated: 'Defined just now',
  },
  {
    id: 'r-pd',
    title: 'Product Designer',
    location: 'Remote · Global',
    type: 'Full-time',
    // A magic link is out; the hiring manager is still writing the definition.
    // Defined by the hiring manager, but the recruiter decides alone.
    state: 'being_defined',
    define_by: 'hiring_manager',
    approve_by: 'recruiter_alone',
    sharedWith: 'Priya Shah',
    candidatesReady: 0,
    totalCandidates: 0,
    updated: 'Awaiting hiring manager',
  },
  {
    id: 'r-be',
    title: 'Backend Engineer',
    location: 'Berlin · Hybrid',
    type: 'Full-time',
    state: 'created',
    define_by: 'recruiter',
    approve_by: 'recruiter_alone',
    candidatesReady: 0,
    totalCandidates: 0,
    updated: 'Created just now',
  },
  {
    id: 'r-fl',
    title: 'Frontend Lead',
    location: 'Remote · Global',
    type: 'Full-time',
    // Auto-closed 15 days after submission, no recruiter action taken.
    state: 'closed',
    autoClosed: true,
    define_by: 'recruiter',
    approve_by: 'recruiter_alone',
    candidatesReady: 0,
    totalCandidates: 12,
    updated: 'Closed after 15 days',
  },
]

export function makeRole(
  id,
  { title, define_by = 'recruiter', approve_by = 'recruiter_alone', requirements = null } = {},
) {
  return {
    id,
    title: title ?? 'New role',
    location: 'Remote · Europe',
    type: 'Full-time',
    state: 'matching',
    define_by,
    approve_by,
    requirements,
    candidatesReady: 0,
    totalCandidates: 0,
    updated: 'Updated just now',
  }
}

// The MVP requirement field: location only (this is a freshers product, so there
// is no years-of-experience requirement). Optional; the matched list filters only
// on what a recruiter actually set.
export const REQUIREMENT_FIELDS = [{ key: 'location', label: 'Location', kind: 'text' }]
