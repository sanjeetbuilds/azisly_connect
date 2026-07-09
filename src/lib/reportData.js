// The candidate report model: one place that reads a scored candidate against the
// role's fixed rules, so the fast panel and the shareable report never diverge.
import {
  GATE,
  UNIVERSAL_FLOOR,
  DOMAIN_LABEL,
  GATED_COMPETENCIES,
  ROLE_TARGETS,
  ROLE_PROBES,
  contactsFor,
  topExperienceOf,
} from '../data/candidates.js'
import { roleScorecard, roleDraft } from '../data/scorecard.js'

export const RECO = {
  strong: 'Recommend advancing.',
  promising: 'Promising, worth a closer look.',
  'not-yet': 'Not yet, needs a human review.',
}

// The universals this role leaned on, plus any the recruiter's own phrase drove.
export function emphasisNamesFor(role) {
  const names = new Set(roleScorecard({ title: role }).emphasis.map((e) => e.name))
  Object.keys(ROLE_PROBES).forEach((n) => names.add(n))
  return names
}

// One competency, read against the same rules the panel uses: a gate is met or
// not, a universal clears the flat floor or falls below it, the domain meets this
// role's target or falls short.
export function competencyState(comp, emphasisNames) {
  const isDomain = comp.name === DOMAIN_LABEL
  const gated = GATED_COMPETENCIES.includes(comp.name)
  const rung = isDomain
    ? 'domain'
    : gated
      ? 'mustHave'
      : emphasisNames?.has(comp.name)
        ? 'veryImportant'
        : 'baseline'
  if (gated) {
    const fail = comp.score < GATE
    return { rung, note: fail ? 'Gate not met' : 'Gate met', tone: fail ? 'fail' : 'ok' }
  }
  if (isDomain) {
    const t = ROLE_TARGETS[comp.name]
    const below = t != null && comp.score < t
    return { rung, note: below ? 'Below role target' : 'Meets role target', tone: below ? 'warn' : 'muted' }
  }
  const below = comp.score < UNIVERSAL_FLOOR
  return { rung, note: below ? 'Below floor' : 'Clears floor', tone: below ? 'fail' : 'muted' }
}

// Forward actions drawn from the scored competencies: what to DO next, not just
// the numbers. Failures first, then reads worth probing, then strengths.
export function recommendations(sortedComps) {
  const fails = []
  const probes = []
  const goods = []
  for (const c of sortedComps) {
    const isDomain = c.name === DOMAIN_LABEL
    const gated = GATED_COMPETENCIES.includes(c.name)
    if (gated && c.score < GATE) {
      fails.push({
        tone: 'fail',
        text: `Fails the ${c.name} gate, a hard requirement for this role. Do not advance on the strength of other scores.`,
      })
    } else if (!isDomain && c.score < UNIVERSAL_FLOOR) {
      probes.push({
        tone: 'fail',
        text: `Below the floor on ${c.name}, the baseline of a strong candidate. Probe whether it was nerves before ruling them out.`,
      })
    } else if (isDomain && ROLE_TARGETS[c.name] != null && c.score < ROLE_TARGETS[c.name]) {
      probes.push({
        tone: 'warn',
        text: `The interview did not get a clean read on ${c.name}. Probe it next round.`,
      })
    }
  }
  const top = sortedComps[0]
  if (top && top.score >= UNIVERSAL_FLOOR) {
    goods.push({ tone: 'good', text: `Strong on ${top.name}. Worth confirming with a reference.` })
  }
  const out = [...fails, ...probes, ...goods]
  if (!fails.length && !probes.length) {
    out.push({ tone: 'good', text: 'No gaps flagged. Ready to share with the hiring manager.' })
  }
  return out.slice(0, 4)
}

// A plain-language finding for a weak competency the interview did not evidence,
// so a gap is never silent: what is missing, and where useful what to probe next.
export function gapFinding(name, { gateFail, belowFloor, belowTarget } = {}) {
  if (gateFail) {
    return `Came in under the ${name} bar this role gates on, and the interview did not show them clearing it. Worth a direct probe before any decision.`
  }
  if (belowFloor) {
    return `Landed below the strong-candidate floor on ${name}. The interview did not surface enough to rule it out, so probe it directly next round.`
  }
  if (belowTarget) {
    return `We did not get a clear read on ${name}, the core of this role. Probe how they reason through it next round.`
  }
  return null
}

// The whole report: what a hiring manager who was not in the loop needs to trust
// the decision. Verdict, forward actions, competencies with their evidence, and
// the criteria the recruiter set (including their own words).
export function reportModel(candidate) {
  const emphasisNames = emphasisNamesFor(candidate.role)
  const assessed = (candidate.competencies ?? []).filter((c) => c.score != null)
  const sorted = [...assessed].sort((a, b) => b.score - a.score)

  const evByComp = {}
  ;(candidate.evidence ?? []).forEach((e) => {
    if (!evByComp[e.competency]) evByComp[e.competency] = e
  })

  const competencies = sorted.map((comp) => ({
    name: comp.name,
    score: comp.score,
    ...competencyState(comp, emphasisNames),
    evidence: evByComp[comp.name] ?? null,
    phrase: ROLE_PROBES[comp.name] ?? null,
  }))

  const draft = roleDraft(candidate.role)
  return {
    name: candidate.name,
    role: candidate.role,
    score: candidate.score,
    verdict: candidate.verdict,
    reco: RECO[candidate.verdict] ?? '',
    experience: topExperienceOf(candidate),
    match: candidate.match,
    competencies,
    recommendations: recommendations(sorted),
    criteria: {
      domain: draft?.domain ?? null,
      emphasis: [...emphasisNames],
      gates: GATED_COMPETENCIES,
      probes: ROLE_PROBES,
    },
    contacts: contactsFor(candidate.name),
  }
}
