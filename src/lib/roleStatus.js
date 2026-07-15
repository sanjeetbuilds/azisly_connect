import { ROLE_STATES } from '../data/roles.js'

// The roles list shows exactly one consolidated status per role, never a more
// granular internal state. `action` says which of Discard / Close applies, if
// either: 'discard' before a role has real candidates, 'close' once it does.
export function roleStatusMeta(role) {
  switch (role.state) {
    case 'ready':
      return { kind: 'needs', label: `${role.candidatesReady} ready to review`, priority: 0, action: 'close' }
    case 'matching':
      return { kind: 'progress', label: 'Matching', priority: 1, action: 'close' }
    case 'defined':
      return { kind: 'setup', label: 'Ready to submit', priority: 2, action: 'discard' }
    case 'being_defined':
      return role.define_by === 'hiring_manager'
        ? {
            kind: 'setup',
            label: `Shared, waiting on ${role.sharedWith ?? 'hiring manager'}`,
            priority: 3,
            action: 'discard',
          }
        : { kind: 'setup', label: 'Draft', priority: 4, action: 'discard' }
    case 'created':
      return { kind: 'setup', label: 'Draft', priority: 4, action: 'discard' }
    case 'closed':
      return { kind: 'done', label: 'Closed', priority: 5, action: null }
    default:
      return { kind: 'setup', label: ROLE_STATES[role.state] ?? role.state, priority: 4, action: null }
  }
}

export const CONFIRM_COPY = {
  discard: {
    title: 'Discard this role?',
    message: 'Everything captured while defining it will be lost.',
    confirmLabel: 'Discard',
    tone: 'danger',
  },
  close: {
    title: 'Close this role?',
    message: 'No new candidates will be found. Everyone already found stays fully accessible.',
    confirmLabel: 'Close',
    tone: 'default',
  },
}
