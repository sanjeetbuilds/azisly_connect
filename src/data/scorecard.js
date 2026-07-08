// The role scorecard model.
//
// A role is NOT a set of percentages that sum to 100. It has four distinct parts,
// shown separately and never merged into one flat weighted list:
//
//   1. Domain    the one competency that makes this role what it is: the
//                differentiator, derived from the role title/family.
//   2. Emphasis  the one or two universal competencies this role leans on extra,
//                shown as a tier (High), never as a percentage.
//   3. Baseline  all six universal competencies, always checked at a strong bar.
//                This is the floor, not a per-role setting: one quiet line, never
//                six scored rows.
//   4. Gates     the hard must-haves, the deal-breakers.

import { CORE_COMPETENCIES } from './candidates.js'

// The six universal competencies every role is held to at a strong baseline.
export const BASELINE_COMPETENCIES = CORE_COMPETENCIES

// The baseline, phrased as the one line the card shows.
export const BASELINE_LINE =
  'All candidates are also held to a strong bar on the fundamentals: communication, problem solving, ownership, learning agility, execution, and collaboration.'

// The domain is derived from the role title/family, so it is never missing. Rules
// are ordered most-specific first (so "Engineering Manager" beats "Engineer", and
// "Product Engineer" beats a generic engineer). A title that maps to nothing
// returns null: that is the load-bearing ops-flag case, not an empty card.
const DOMAIN_RULES = [
  { test: /product\s+manager|\bpm\b|product\s+owner/i, domain: 'Product craft' },
  { test: /product\s+engineer/i, domain: 'Product craft' },
  { test: /design|\bux\b|\bui\b/i, domain: 'Design craft' },
  { test: /engineering\s+manager|head\s+of\s+eng/i, domain: 'Engineering leadership' },
  { test: /data\s+engineer|data\s+platform/i, domain: 'Data engineering' },
  { test: /data\s+scien|machine\s+learning|\bml\b|\bai\b/i, domain: 'Applied ML' },
  { test: /frontend|front-end/i, domain: 'Frontend engineering' },
  { test: /backend|back-end|platform|infrastructure|systems?|software\s+engineer|developer|\bengineer\b/i, domain: 'System design' },
]

export function roleDomain(title = '') {
  for (const rule of DOMAIN_RULES) if (rule.test.test(title)) return rule.domain
  return null
}

// What the domain means for this role, by family. Keeps the card concrete without
// implying a measured weight.
const DOMAIN_SUMMARY = {
  'Product craft':
    'Owns product-facing outcomes end to end: shaping the problem, shipping, and measuring the impact.',
  'System design':
    'Designs and reasons about systems that stay correct and fast as they scale.',
  'Design craft': 'Turns fuzzy problems into clear, usable, considered product design.',
  'Engineering leadership':
    'Grows engineers and sets the technical direction for their area.',
  'Data engineering': 'Builds reliable data pipelines and platforms others can trust.',
  'Applied ML': 'Frames problems as models and ships them into production.',
  'Frontend engineering': 'Builds fast, accessible, maintainable user-facing interfaces.',
}

export function domainSummary(domain) {
  return DOMAIN_SUMMARY[domain] ?? 'The core competency this role is built around.'
}

// The full scorecard for a role, assembled from its confirmed title plus the
// emphasis and gates gathered in the define conversation. Domain always comes
// from the confirmed title, so the card can never show a mismatched template.
//
// emphasis: the 1-2 universals turned up, each { name, tier }. May be empty (a
//   balanced role names no single emphasis; the card must not fabricate one).
// gates: the hard must-haves. May be empty (the domain then acts as the implicit
//   gate; the review step confirms this rather than shipping zero gates silently).
export function roleScorecard({ title = 'New role', emphasis, gates } = {}) {
  return {
    title,
    domain: roleDomain(title),
    emphasis: emphasis ?? DEFAULT_EMPHASIS,
    gates: gates ?? DEFAULT_GATES,
  }
}

// Demo defaults for the Senior Product Engineer walkthrough. In a live flow these
// come from the conversation; here they stand in so the prototype reads true.
export const DEFAULT_EMPHASIS = [
  { name: 'Ownership', tier: 'High' },
  { name: 'Problem Solving', tier: 'High' },
]

export const DEFAULT_GATES = [
  '5+ years building production web applications',
  'Has owned a feature end to end, from shaping to shipping',
  'Clear, structured written communication',
]
