// Roles/jobs for the workspace. Starts empty (the post-login empty state);
// creating a role populates the same screen as a list.

export function makeFirstRole() {
  return {
    id: 'role-spe',
    title: 'Senior Product Engineer',
    location: 'Remote · Europe',
    type: 'Full-time',
    status: 'Open',
    candidates: 6,
    updated: 'Updated just now',
  }
}

export function makeDraftRole(index) {
  return {
    id: `role-draft-${index}`,
    title: 'Untitled role',
    location: 'Location TBD',
    type: 'Full-time',
    status: 'Draft',
    candidates: 0,
    updated: 'Created just now',
  }
}
