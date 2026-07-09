import { Card, Tag } from './index.js'
import { CopyNeeded, AuthoringNeeded, FixtureTag } from './Spec.jsx'
import { UNIVERSAL_COMPETENCIES } from '../data/roleFamilies.js'

// The Role card has three parts: the domain, the criteria ladder, and a fixed
// foundation band for the universals (never adjustable). Plus the probes — the
// recruiter's own words. There is no emphasis. Gates are internal: the recruiter
// never sees them, never sees the word gate, and never sees the word must-have.
//
// It renders exactly three kinds of string:
//   1. words the recruiter typed        (roleTitle, probe phrases)
//   2. words authored in roleFamilies   (family, domainCompetency, criteria, universals)
//   3. words taken verbatim from the PRD or this build brief
//      ("Role card", "Essential / Very important / Nice to have", "We will test …")
// Every other label is an unwritten string, rendered as <CopyNeeded/>. An empty
// criteria array renders <AuthoringNeeded/>. Nothing is filled with a default.

// The importance ladder, top to bottom. Verbatim v2: "Criteria are grouped as
// Essential, Very important, Nice to have."
const TIER_LABELS = ['Essential', 'Very important', 'Nice to have']

function Section({ heading, children }) {
  return (
    <section className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">{heading}</div>
      {children}
    </section>
  )
}

function ProbeGroup({ competency, phrases }) {
  return (
    <div className="rounded-card border border-hairline bg-background/60 p-3.5">
      <div className="flex flex-col gap-2">
        {phrases.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink">
            &ldquo;{p}&rdquo;
          </p>
        ))}
      </div>
      {/* Authored copy from the build brief. The competency name is authored. */}
      <p className="mt-2 text-[13px] text-secondary">We will test this under {competency}.</p>
    </div>
  )
}

export default function RoleCard({ scorecard, roleTitle, probes = [], probesAreFixture = false, fixture = false }) {
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

  const byCompetency = probes.reduce((acc, pr) => {
    ;(acc[pr.competency] ||= []).push(pr.phrase)
    return acc
  }, {})

  return (
    <Card className="flex w-full flex-col gap-6 p-6">
      {/* Header. "Role card" is verbatim PRD. The title is the recruiter's own
          words; the family is authored in roleFamilies.js. */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Role card</p>
          <h3 className="mt-1 truncate text-lg font-semibold text-ink">{roleTitle}</h3>
          <p className="mt-0.5 text-[13px] text-secondary">{family}</p>
        </div>
        <div className="flex items-center gap-2">
          {fixture && <FixtureTag />}
          <Tag color="purple">Draft</Tag>
        </div>
      </div>

      {/* Domain — the value is authored; the heading label is unwritten. */}
      <Section heading={<CopyNeeded note="domain heading" />}>
        <div className="rounded-card border border-hairline bg-background/60 p-4">
          <span className="text-[15px] font-semibold text-ink">{domainCompetency}</span>
        </div>
      </Section>

      {/* Criteria ladder — authored by hand. Empty renders AUTHORING NEEDED. When
          present, criteria are grouped by tier; a tier with no criteria renders
          nothing — no empty heading, no filler. */}
      <Section heading={<CopyNeeded note="criteria heading" />}>
        {criteria.length > 0 ? (
          <div className="flex flex-col gap-4">
            {TIER_LABELS.map((tier) => {
              const items = criteria.filter((c) => c.tier === tier)
              if (items.length === 0) return null
              return (
                <div key={tier} className="flex flex-col gap-2">
                  {/* Tier label — verbatim v2. */}
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{tier}</p>
                  <ul className="flex flex-col gap-1.5">
                    {items.map((c, i) => (
                      <li key={i} className="text-sm leading-relaxed text-ink">
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
        <div className="rounded-card border border-hairline bg-background/60 p-4">
          <div className="flex flex-wrap gap-2">
            {UNIVERSAL_COMPETENCIES.map((u) => (
              <span key={u} className="rounded-full bg-ink/[0.04] px-2.5 py-1 text-[12px] text-secondary">
                {u}
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Probes — the recruiter's own words, grouped under the competency each
          one tests. Shown only once there is something to show. */}
      {probes.length > 0 && (
        <Section
          heading={
            <span className="flex items-center gap-2">
              <CopyNeeded note="probes heading" />
              {probesAreFixture && <FixtureTag />}
            </span>
          }
        >
          <div className="flex flex-col gap-3">
            {Object.entries(byCompetency).map(([competency, phrases]) => (
              <ProbeGroup key={competency} competency={competency} phrases={phrases} />
            ))}
          </div>
        </Section>
      )}
    </Card>
  )
}
