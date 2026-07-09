import {
  GATE,
  UNIVERSAL_FLOOR,
  DOMAIN_LABEL,
  GATED_COMPETENCIES,
  ROLE_TARGETS,
  ROLE_PROBES,
} from '../data/candidates.js'
import { roleScorecard } from '../data/scorecard.js'

// The importance ladder, as a solid colour per rung. Same three meanings as the
// role card, the interview review, and the candidate panel: one language.
const RUNG_BAR = {
  mustHave: 'bg-danger', // a gate
  veryImportant: 'bg-attention', // an emphasis
  baseline: 'bg-secondary/40', // the floor
  domain: 'bg-ink', // the role's core, matching the panel's ink domain marker
}

const NOTE = {
  fail: 'text-danger font-semibold',
  warn: 'text-attention font-medium',
  ok: 'text-strong font-medium',
  muted: 'text-muted',
}
const SCORE = { fail: 'text-danger', warn: 'text-attention', ok: 'text-ink', muted: 'text-ink' }

// One competency, read against the same rules the panel uses: a gate is met or
// not, a universal clears the flat floor or falls below it, the domain meets this
// role's target or falls short. The rung is its ladder colour.
function classify(comp, emphasisNames) {
  const isDomain = comp.name === DOMAIN_LABEL
  const gated = GATED_COMPETENCIES.includes(comp.name)
  const rung = gated ? 'mustHave' : emphasisNames.has(comp.name) ? 'veryImportant' : 'baseline'
  if (gated) {
    const fail = comp.score < GATE
    return { rung, note: fail ? 'Gate not met' : 'Gate met', tone: fail ? 'fail' : 'ok' }
  }
  if (isDomain) {
    const t = ROLE_TARGETS[comp.name]
    const below = t != null && comp.score < t
    return { rung: 'domain', note: below ? 'Below role target' : 'Meets role target', tone: below ? 'warn' : 'muted' }
  }
  const below = comp.score < UNIVERSAL_FLOOR
  return { rung, note: below ? 'Below floor' : 'Clears floor', tone: below ? 'fail' : 'muted' }
}

/**
 * CompetencyBreakdown — the interview scores read at a glance, sorted high to low,
 * each row in its ladder colour and annotated against the same floor, target, and
 * gate rules as the full panel. The recruiter's own phrase rides along on any
 * competency it drove, so the thread from what they asked for to what they are
 * deciding on stays intact even here.
 */
export default function CompetencyBreakdown({ candidate }) {
  const assessed = (candidate.competencies ?? []).filter((c) => c.score != null)
  if (!assessed.length) return null
  const sorted = [...assessed].sort((a, b) => b.score - a.score)
  const emphasisNames = new Set(roleScorecard({ title: candidate.role }).emphasis.map((e) => e.name))
  Object.keys(ROLE_PROBES).forEach((n) => emphasisNames.add(n))

  return (
    <div className="flex flex-col gap-1.5">
      {sorted.map((c) => {
        const k = classify(c, emphasisNames)
        const phrase = ROLE_PROBES[c.name]
        return (
          <div key={c.name} className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <span className={`h-3 w-[3px] shrink-0 rounded-full ${RUNG_BAR[k.rung]}`} aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink">{c.name}</span>
              <span className={`w-7 shrink-0 text-right text-[13px] font-semibold tabular-nums ${SCORE[k.tone]}`}>
                {c.score}
              </span>
              <span className={`w-[108px] shrink-0 text-right text-[11px] ${NOTE[k.tone]}`}>{k.note}</span>
            </div>
            {phrase && <p className="pl-[13px] text-[11px] text-muted">&ldquo;{phrase}&rdquo;</p>}
          </div>
        )
      })}
    </div>
  )
}
