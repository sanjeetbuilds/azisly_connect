// Magic-link tokens are self-contained: a base64url-encoded JSON payload carried
// entirely in the URL. A pasted link opens a fresh tab with no app state, so the
// token is the only thing the manager view can rely on.

export function encodeToken(payload) {
  const json = JSON.stringify(payload)
  return btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeToken(token) {
  try {
    let b64 = String(token).replace(/-/g, '+').replace(/_/g, '/')
    while (b64.length % 4) b64 += '='
    return JSON.parse(atob(b64))
  } catch {
    return null
  }
}

const DAY_MS = 24 * 60 * 60 * 1000

// Build a real, pasteable define-role link. days < 0 produces an already-expired
// token (used by the "Preview expired link" affordance).
export function buildDefineLink(roleId, { days = 7, origin } = {}) {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const exp = Date.now() + days * DAY_MS
  return `${base}/m/define/${encodeToken({ roleId, type: 'define', exp })}`
}

// Build a real, per-candidate interview link (the candidate takes the interview).
// The token carries everything the landing needs so a hard load in a fresh tab
// resolves from the seed alone. Kept distinct from the review link type, which
// leads the recruiter or manager to watch a completed interview. days < 0
// produces an already-expired token (for the expired-link preview).
export function buildInterviewLink({ candidateId, roleId, companyId = 'acme' }, { days = 7, origin } = {}) {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const exp = Date.now() + days * DAY_MS
  return `${base}/i/${encodeToken({ candidateId, roleId, companyId, type: 'interview', exp })}`
}

// Build the recruiter's Set Password link (C1), sent in the Invited-transition
// welcome email (O2/o1 scope, not this). The email is carried in the token so
// the Set Password screen can show it prefilled with no shared app state.
// days < 0 produces an already-expired token (for the expired-link preview).
export function buildInviteLink({ email }, { days = 7, origin } = {}) {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const exp = Date.now() + days * DAY_MS
  return `${base}/set-password/${encodeToken({ email, type: 'invite', exp })}`
}

// Build a recruiter's password reset link. Shorter-lived than an invite by
// default. Reuses the same Set Password screen (email prefilled, same rules),
// with only the CTA label differing — "Reset Password" instead of "Set Password".
export function buildResetLink({ email }, { days = 1, origin } = {}) {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '')
  const exp = Date.now() + days * DAY_MS
  return `${base}/reset-password/${encodeToken({ email, type: 'reset', exp })}`
}
