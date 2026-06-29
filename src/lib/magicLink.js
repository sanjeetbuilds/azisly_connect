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
