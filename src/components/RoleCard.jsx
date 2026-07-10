import { AuthoringNeeded, FixtureTag } from './Spec.jsx'

// The role card — a compact work tool, not an article. A surface container on the
// page. No serif, no italics, no uppercase, no letter-spacing, no gutter rule,
// no orientation line. Nothing on it is editable.
//
//   header      "Built around" (12px muted) + the craft name (20px, 500)
//   ladder      110px tier-label column, criteria to the right at 15px. Essential
//               primary, the rest secondary. No counts. 16px between tiers.
//   foundation  one muted 12px sentence.
//   probes      above a 0.5px divider: the phrase (14px, quoted) and the promise
//               (13px), with a FIXTURE chip right-aligned on the promise line.
//               Never the competency, score, tier, weight, or percentage.

const TIER_LABELS = ['Essential', 'Very important', 'Nice to have']

// Verbatim PRD (§B): the one fixed line about the fundamentals.
const FOUNDATION_LINE =
  'Communication, ownership and clarity are read from every answer, which is why this stays short.'

const CONTAINER = 'w-full max-w-[760px] rounded-[12px] border-[0.5px] border-hairline bg-surface px-7 py-6'

export default function RoleCard({ scorecard, probes = [], highlight = false }) {
  const { family, domainCompetency, criteria = [] } = scorecard ?? {}

  // Never render a blank craft or the string null.
  if (!family || !domainCompetency) {
    return (
      <div className={CONTAINER}>
        <AuthoringNeeded note="no family resolved — resolve the title before showing the card" />
      </div>
    )
  }

  return (
    <div className={CONTAINER}>
      <div className="flex flex-col gap-4">
        {/* Header. */}
        <div className="flex flex-col gap-1">
          <p className="text-[12px] text-muted">Built around</p>
          <h2 className="text-[20px] font-medium text-ink">{domainCompetency}</h2>
        </div>

        {/* Ladder — 110px label column, 16px between tiers, no counts, no rule. */}
        {criteria.length > 0 ? (
          <div className="flex flex-col gap-4">
            {TIER_LABELS.map((tier) => {
              const items = criteria.filter((c) => c.tier === tier)
              if (items.length === 0) return null // a tier with no criteria renders nothing
              const primary = tier === 'Essential'
              return (
                <div key={tier} className="grid grid-cols-[110px_1fr] gap-x-3">
                  <p className="text-[13px] font-medium text-muted">{tier}</p>
                  <div className="flex flex-col gap-1">
                    {items.map((c, i) => (
                      <p key={i} className={`text-[15px] leading-[1.5] ${primary ? 'text-ink' : 'text-secondary'}`}>
                        {c.text}
                      </p>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <AuthoringNeeded note="criteria" />
        )}

        {/* Foundation. */}
        <p className="text-[12px] leading-[1.5] text-muted">{FOUNDATION_LINE}</p>

        {/* Probes — 0.5px divider, 20px space, then a two-column grid. A faint
            transient tint when a probe lands. */}
        {probes.length > 0 && (
          <div
            className={`flex flex-col gap-4 border-t-[0.5px] border-hairline pt-5 transition-colors duration-300 ${
              highlight ? 'bg-ink/[0.03]' : ''
            }`}
          >
            <p className="text-[12px] text-muted">What you told us, and what we&rsquo;ll ask</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {probes.map((p, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <p className="text-[14px] leading-snug text-ink">&ldquo;{p.phrase}&rdquo;</p>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] leading-snug text-secondary">{p.promise}</p>
                    <FixtureTag className="shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
