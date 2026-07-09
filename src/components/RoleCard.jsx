import { Card, Tag } from './index.js'
import { CopyNeeded, AuthoringNeeded, FixtureTag } from './Spec.jsx'
import { ArrowRightIcon } from './icons.jsx'
import { UNIVERSAL_COMPETENCIES } from '../data/roleFamilies.js'

// The Role card has three parts: the domain, the criteria ladder, and a fixed
// foundation band for the universals (never adjustable). Below a divider it also
// shows the probes — the recruiter's own words, each mapped to the competency
// we'll test it under. There is no emphasis. Gates are internal: the recruiter
// never sees them, never sees the word gate, and never sees the word must-have.
//
// It renders exactly three kinds of string:
//   1. words the recruiter typed        (roleTitle, probe phrases)
//   2. words authored in roleFamilies   (family, domainCompetency, criteria, universals)
//   3. words taken verbatim from the PRD or this build brief
//      ("Role card", "Essential / Very important / Nice to have")
// Every other label is an unwritten string, rendered as <CopyNeeded/>. An empty
// criteria array renders <AuthoringNeeded/>. Nothing is filled with a default.
// The probe→competency mapping is a stub, so every probe row is tagged FIXTURE.

// The importance ladder, top to bottom. Verbatim v2: "Criteria are grouped as
// Essential, Very important, Nice to have."
const TIER_LABELS = ['Essential', 'Very important', 'Nice to have']

function Section({ heading, children }) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-center gap-2">{heading}</div>
      {children}
    </section>
  )
}

export default function RoleCard({ scorecard, roleTitle, probes = [], fixture = false, showOrientation = false }) {
  const { family, domainCompetency, criteria = [] } = scorecard ?? {}

  // Never render a blank domain or the string null. A card is only shown for a
  // matched family; without one, this component refuses rather than guesses.
  if (!family || !domainCompetency) {
    return (
      <Card className="flex w-full flex-col gap-2 p-6">
        <AuthoringNeeded note="no family resolved — resolve the title before showing a card" />
      </Card>
    )
  }

  return (
    <Card className="flex w-full flex-col gap-4 p-5">
      {/* Header. "Role card" is verbatim PRD. The title is the recruiter's own
          words; the family is authored in roleFamilies.js. The family line shows
          only when it differs from what the recruiter typed. */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Role card</p>
          <h3 className="mt-1 truncate text-lg font-semibold text-ink">{roleTitle}</h3>
          {family !== roleTitle && <p className="mt-0.5 text-[13px] text-secondary">{family}</p>}
          {showOrientation && (
            <p className="mt-2 text-sm leading-snug text-secondary">
              Here is what we think a strong {family} looks like. Change anything that does not match.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {fixture && <FixtureTag />}
          <Tag color="purple">Draft</Tag>
        </div>
      </div>

      {/* Domain — one line, no box: label ("Built around") + authored value. */}
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Built around</span>
        <span className="text-[15px] font-semibold text-ink">{domainCompetency}</span>
      </div>

      {/* Criteria ladder — authored by hand. Empty renders AUTHORING NEEDED. When
          present, criteria are grouped by tier; a tier with no criteria renders
          nothing — no empty heading, no filler. */}
      <Section heading={<span className="text-sm font-medium text-secondary">What a strong candidate looks like</span>}>
        {criteria.length > 0 ? (
          <div className="flex flex-col gap-3">
            {TIER_LABELS.map((tier) => {
              const items = criteria.filter((c) => c.tier === tier)
              if (items.length === 0) return null
              return (
                <div key={tier} className="flex flex-col gap-1.5">
                  {/* Tier label — verbatim v2. */}
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{tier}</p>
                  <ul className="flex flex-col gap-1">
                    {items.map((c, i) => (
                      <li key={i} className="text-sm leading-snug text-ink">
                        {c.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        ) : (
          <AuthoringNeeded note="criteria" />
        )}
      </Section>

      {/* Foundation — the six universals, a fixed floor held on every role. It is
          never adjustable and nobody in this flow sets it. */}
      <Section heading={<CopyNeeded note="foundation band heading" />}>
        <div className="rounded-card border border-hairline bg-background/60 p-3">
          <div className="flex flex-wrap gap-2">
            {UNIVERSAL_COMPETENCIES.map((u) => (
              <span key={u} className="rounded-full bg-ink/[0.04] px-2.5 py-1 text-[12px] text-secondary">
                {u}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Probes — the recruiter's own words, under a divider, each with the
          competency we'll test it under. The phrase is verbatim, never cleaned up
          or summarised. The mapping is a stub, so every row is FIXTURE. No probes,
          no section. */}
      {probes.length > 0 && (
        <div className="flex flex-col gap-2.5 border-t border-hairline pt-4">
          <p className="text-sm font-medium text-secondary">What you told us, and where we&rsquo;ll test it</p>
          <ul className="flex flex-col gap-2">
            {probes.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="min-w-0 flex-1 text-ink">&ldquo;{p.phrase}&rdquo;</span>
                <ArrowRightIcon className="h-3.5 w-3.5 shrink-0 text-muted" />
                <span className="shrink-0 text-ink">{p.competency}</span>
                <FixtureTag />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
