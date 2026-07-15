import { useState } from 'react'
import { AuthoringNeeded } from './Spec.jsx'

// The role card. It is ordered by who spoke last.
//
//   No probes:   the craft name, then "What this role demands" + the
//                ladder.
//   With probes: the card reorders once — the source label + the probes, a
//                divider, then "We'll also test, for any <family>" + the ladder.
//                It never reverses.
//
// Neutral throughout: no serif, italics, uppercase/letter-spacing, gutter rule,
// colour, or editable copy. Probes fade in and slide up as they land; the card
// border pulses when one does.

const TIER_LABELS = ['Essential', 'Very important', 'Nice to have']

// Colour appears here once, on the tier label only — never on the item text,
// the card border, or anywhere else on the card.
const TIER_COLOR = {
  Essential: 'text-tier-essential',
  'Very important': 'text-tier-important',
  'Nice to have': 'text-tier-nice',
}

// Verbatim PRD (§B): the one fixed line about the fundamentals.
const FOUNDATION_LINE =
  'Communication, ownership and clarity are read from every answer, which is why this stays short.'

const CARD = 'rounded-[10px] border-[0.5px] border-hairline bg-surface px-6 py-5'

// More than this many probes collapses behind a "+N more" affordance, the
// same overflow pattern used for skill chips elsewhere in the product.
const VISIBLE_PROBES = 3

function Ladder({ criteria }) {
  if (criteria.length === 0) return <AuthoringNeeded note="criteria" />
  return (
    <div className="flex flex-col gap-4">
      {TIER_LABELS.map((tier) => {
        const items = criteria.filter((c) => c.tier === tier)
        if (items.length === 0) return null
        const primary = tier === 'Essential'
        return (
          <div key={tier} className="grid grid-cols-[100px_1fr] gap-x-3">
            <p className={`text-[13px] font-medium ${TIER_COLOR[tier] ?? 'text-muted'}`}>{tier}</p>
            <div className="flex flex-col gap-3">
              {items.map((c, i) => (
                <p key={i} className={`text-[14px] leading-[1.5] ${primary ? 'text-ink' : 'text-secondary'}`}>
                  {c.text}
                </p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function RoleCard({ scorecard, probes = [], pulse = false, className = '' }) {
  const { family, domainCompetency, criteria = [] } = scorecard ?? {}
  const [expanded, setExpanded] = useState(false)

  if (!family || !domainCompetency) {
    return (
      <div className={`${CARD} ${className}`}>
        <AuthoringNeeded note="no family resolved — resolve the title before showing the card" />
      </div>
    )
  }

  const hasProbes = probes.length > 0
  const sourceLabel = probes[0]?.source === 'jd' ? 'From your JD' : 'What you told us'
  const visibleProbes = expanded ? probes : probes.slice(0, VISIBLE_PROBES)
  const hiddenCount = probes.length - visibleProbes.length

  return (
    <div className={`${CARD} ${pulse ? 'animate-card-pulse' : ''} ${className}`}>
      <div className="flex flex-col gap-5">
        {hasProbes ? (
          <>
            {/* Probes, on top, ordered by who spoke last. */}
            <div className="flex flex-col gap-3">
              <p className="text-[13px] font-medium text-ink">{sourceLabel}</p>
              {visibleProbes.map((p, i) => (
                <div
                  key={i}
                  className="flex animate-probe-in flex-col gap-1"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <p className="text-[14px] leading-snug text-ink">&ldquo;{p.phrase}&rdquo;</p>
                  <p className="text-[13px] leading-snug text-secondary">{p.promise}</p>
                </div>
              ))}
              {hiddenCount > 0 && (
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  className="inline-flex w-fit items-center rounded-full border-[0.5px] border-hairline px-2.5 py-1 text-[12px] font-medium text-secondary transition-colors hover:border-ink/30 hover:text-ink"
                >
                  +{hiddenCount} more you told us
                </button>
              )}
              {expanded && probes.length > VISIBLE_PROBES && (
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="w-fit text-[12px] font-medium text-secondary transition-colors hover:text-ink"
                >
                  Show fewer
                </button>
              )}
            </div>

            <div className="border-t-[0.5px] border-hairline" />

            {/* The ladder, now below, headed by the family. */}
            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-medium text-secondary">We&rsquo;ll also test, for any {family}</p>
              <Ladder criteria={criteria} />
            </div>
          </>
        ) : (
          <>
            {/* No probes yet: the craft, then the ladder. */}
            <div className="flex flex-col gap-1">
              <p className="text-[12px] text-muted">Built around</p>
              <h2 className="text-[18px] font-medium text-ink">{domainCompetency}</h2>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[13px] font-medium text-ink">What this role demands</p>
              <Ladder criteria={criteria} />
            </div>
          </>
        )}

        {/* Foundation — above a 0.5px divider. */}
        <p className="border-t-[0.5px] border-hairline pt-4 text-[12px] leading-[1.5] text-muted">{FOUNDATION_LINE}</p>
      </div>
    </div>
  )
}
