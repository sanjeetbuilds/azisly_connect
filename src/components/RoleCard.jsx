import { AuthoringNeeded, FixtureTag } from './Spec.jsx'

// The role card — content on the page, not a box. No white fill, no border, no
// radius, no shadow. No colour, no colour-coded competencies.
//
//   craft       one line of text
//   ladder      a 130px left column of tier + count, criteria as lines of text to
//               the right, run to a ~70-char measure. Essential in primary text,
//               the rest in secondary — importance carried by weight, not decoration.
//   foundation  one sentence.
//   probes      below a heavier divider, only when a probe exists: the person's
//               exact phrase (serif, primary) and, under it, what we'll ask the
//               candidate (small, secondary). Never the competency, score, tier,
//               weight, or percentage. The mapping is a stub, so each row is FIXTURE.

const TIER_LABELS = ['Essential', 'Very important', 'Nice to have']

// Verbatim PRD (§B): the one fixed line about the fundamentals.
const FOUNDATION_LINE =
  'Communication, ownership and clarity are read from every answer, which is why this stays short.'

// A serif face for the recruiter's own words. No serif is bundled, so this falls
// back to the OS serif — no runtime CDN dependency.
const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif' }

export default function RoleCard({ scorecard, probes = [], highlight = false }) {
  const { family, domainCompetency, criteria = [] } = scorecard ?? {}

  // Never render a blank craft or the string null.
  if (!family || !domainCompetency) {
    return <AuthoringNeeded note="no family resolved — resolve the title before showing the card" />
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Craft — one line, no box. */}
      <p className="text-[15px] font-semibold text-ink">{domainCompetency}</p>

      {/* Criteria ladder — labels in a 130px left column, criteria to a ~70ch measure. */}
      {criteria.length > 0 ? (
        <div className="flex flex-col gap-3">
          {TIER_LABELS.map((tier) => {
            const items = criteria.filter((c) => c.tier === tier)
            if (items.length === 0) return null
            const primary = tier === 'Essential'
            return (
              <div key={tier} className="flex gap-4">
                <div className="w-[130px] shrink-0">
                  <div className="text-sm text-ink">{tier}</div>
                  <div className="text-[12px] text-muted tabular-nums">
                    {items.length} of {criteria.length}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  {items.map((c, i) => (
                    <p key={i} className={`max-w-[70ch] text-sm leading-snug ${primary ? 'text-ink' : 'text-secondary'}`}>
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

      {/* Foundation — one sentence. */}
      <p className="max-w-[70ch] text-[13px] leading-relaxed text-muted">{FOUNDATION_LINE}</p>

      {/* What you told us — heavier divider, only when there is a probe. A faint
          transient tint when a probe lands. */}
      {probes.length > 0 && (
        <div
          className={`flex flex-col gap-3 border-t-2 border-hairline pt-5 transition-colors duration-300 ${
            highlight ? 'bg-ink/[0.03]' : ''
          }`}
        >
          <p className="text-sm font-medium text-secondary">What you told us, and what we&rsquo;ll ask</p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {probes.map((p, i) => (
              <div key={i} className="flex flex-col gap-1">
                <p className="text-[15px] leading-snug text-ink" style={SERIF}>
                  &ldquo;{p.phrase}&rdquo;
                </p>
                <p className="max-w-[46ch] text-[12px] leading-snug text-secondary">
                  {p.promise} <FixtureTag />
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
