// Plan tiers and their limits.
//   jobs       lifetime cap on roles ever submitted — never resets, closing or
//              discarding a role does not free it up.
//   interviews the account-wide interview-credit pool, shared across every role.
export const PLAN_LIMITS = {
  free: { jobs: 1, interviews: 10 },
  paid: { jobs: Infinity, interviews: 100 },
}

export const JOB_LIMIT_REASON = "You've used your free job. Upgrade to post another."

export function creditLimitReason(plan) {
  const limit = PLAN_LIMITS[plan].interviews
  return plan === 'free'
    ? `You've used all ${limit} interviews. Upgrade to invite more candidates.`
    : `You've used all ${limit} interviews. Ask your Azisly contact to raise the limit.`
}

// The refund toast names exactly what happened, so a count change is never
// silent. reason is one of: lapsed | declined_interview | incomplete.
export function creditRefundMessage(name, reason) {
  const detail = {
    lapsed: `${name}'s invite expired unused`,
    declined_interview: `${name} declined the interview`,
    incomplete: `${name} never completed the interview`,
  }[reason]
  return `1 interview credit returned, ${detail}.`
}
