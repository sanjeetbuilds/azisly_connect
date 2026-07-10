import { AuthoringNeeded, FixtureTag } from './Spec.jsx'

// The role card — an editorial layout on the page. No container, no fill, no
// border, no radius, no shadow. No colour, no colour-coded competencies.
//
//   header      eyebrow "Built around", the craft name at 30px, and the
//               orientation line in a serif italic.
//   ladder      a two-column grid with a 0.5px hairline down its left edge.
//               Tier labels in an 118px left column; criteria to the right at
//               17px. Essential primary, the rest secondary. No counts.
//   foundation  one muted sentence.
//   probes      above a 0.5px rule, only when a probe exists: the phrase (serif,
//               18px) and, under it, the promise, then a FIXTURE chip on its own
//               line. Never the competency, score, tier, weight, or percentage.

const TIER_LABELS = ['Essential', 'Very important', 'Nice to have']

// Verbatim PRD (§B): the one fixed line about the fundamentals.
const FOUNDATION_LINE =
  'Communication, ownership and clarity are read from every answer, which is why this stays short.'

// A serif face for the recruiter's own words and the orientation line. No serif
// is bundled, so this falls back to the OS serif — no runtime CDN dependency.
const SERIF = { fontFamily: 'Georgia, "Times New Roman", serif' }

export default function RoleCard({ scorecard, probes = [], highlight = false }) {
  const { family, domainCompetency, criteria = [] } = scorecard ?? {}

  // Never render a blank craft or the string null.
  if (!family || !domainCompetency) {
    return <AuthoringNeeded note="no family resolved — resolve the title before showing the card" />
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header. Orientation line is verbatim PRD (§B). */}
      <header className="flex flex-col gap-2">
        <p className="text-[11px] uppercase tracking-[0.09em] text-muted">Built around</p>
        <h2 className="text-[30px] font-medium leading-[1.15] text-ink">{domainCompetency}</h2>
        <p className="max-w-[60ch] text-[16px] italic leading-[1.5] text-secondary" style={SERIF}>
          Here is what we think a strong {family} looks like. Change anything that does not match.
        </p>
      </header>

      {/* Ladder — 0.5px hairline down the left edge; labels in an 118px column. */}
      {criteria.length > 0 ? (
        <div className="flex flex-col gap-5 border-l-[0.5px] border-hairline pl-6">
          {TIER_LABELS.map((tier) => {
            const items = criteria.filter((c) => c.tier === tier)
            if (items.length === 0) return null // a tier with no criteria renders nothing
            const primary = tier === 'Essential'
            return (
              <div key={tier} className="grid grid-cols-[118px_1fr] gap-x-4">
                <p className={`pt-1 text-[11px] uppercase tracking-[0.09em] ${primary ? 'text-ink' : 'text-secondary'}`}>
                  {tier}
                </p>
                <div className="flex flex-col gap-2">
                  {items.map((c, i) => (
                    <p key={i} className={`max-w-[62ch] text-[17px] leading-[1.65] ${primary ? 'text-ink' : 'text-secondary'}`}>
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
      <p className="max-w-[66ch] text-[13px] leading-[1.6] text-muted">{FOUNDATION_LINE}</p>

      {/* Probes — above a 0.5px rule, generous space, then the grid. A faint
          transient tint when a probe lands. */}
      {probes.length > 0 && (
        <div
          className={`flex flex-col gap-5 border-t-[0.5px] border-ink/15 pt-7 transition-colors duration-300 ${
            highlight ? 'bg-ink/[0.03]' : ''
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.09em] text-muted">What you told us, and what we&rsquo;ll ask</p>
          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ columnGap: '34px', rowGap: '26px' }}>
            {probes.map((p, i) => (
              <div key={i} className="flex flex-col items-start gap-1.5">
                <p className="text-[18px] leading-snug text-ink" style={SERIF}>
                  &ldquo;{p.phrase}&rdquo;
                </p>
                <p className="max-w-[46ch] text-[14px] leading-[1.6] text-secondary">{p.promise}</p>
                <FixtureTag />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
