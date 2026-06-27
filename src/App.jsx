import {
  Button,
  Card,
  Input,
  CompetencyBar,
  ScoreDisplay,
  VerdictTag,
  Nav,
  EvidenceQuote,
  StaggerList,
} from './components'

/* A tiny local helper for the demo page only — labels each specimen with a
   quiet uppercase mono caption. Not part of the design system. */
function Section({ label, hint, children }) {
  return (
    <section className="flex flex-col gap-5 py-12 border-t border-hairline first:border-t-0">
      <div className="flex flex-col gap-1">
        <h2 className="text-[11px] uppercase tracking-[0.16em] font-mono text-secondary">
          {label}
        </h2>
        {hint && <p className="text-sm text-secondary max-w-xl">{hint}</p>}
      </div>
      {children}
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <Nav
        items={['Pipeline', 'Candidates', 'Roles']}
        active="Candidates"
        action={<Button variant="primary">New role</Button>}
      />

      <main className="mx-auto max-w-3xl px-6 pb-24">
        {/* Page header */}
        <header className="py-16">
          <p className="text-[11px] uppercase tracking-[0.16em] font-mono text-secondary mb-4">
            Design System
          </p>
          <h1 className="text-4xl text-ink mb-4">Azisly Recruit</h1>
          <p className="text-[15px] leading-relaxed text-secondary max-w-xl">
            The foundation every screen inherits. Ink on warm white, calm and
            premium. Colour appears in exactly one place — a candidate&rsquo;s
            verdict — and nowhere else.
          </p>
        </header>

        {/* Buttons */}
        <Section
          label="Button"
          hint="One primary per view. Everything else is secondary — never two of equal weight."
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Advance candidate</Button>
            <Button variant="secondary">Save for later</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Section>

        {/* Card */}
        <Section
          label="Card"
          hint="White surface, hairline border, ~10px radius. No shadow — separation by whitespace alone."
        >
          <Card className="p-6 max-w-md">
            <h3 className="text-lg text-ink mb-1">Maya Okonkwo</h3>
            <p className="text-sm text-secondary">
              Senior Product Engineer · 8 years · Remote
            </p>
          </Card>
        </Section>

        {/* Input */}
        <Section label="Input" hint="Quiet by default; the border settles to ink on focus.">
          <div className="max-w-sm flex flex-col gap-6">
            <Input
              label="Candidate name"
              placeholder="e.g. Maya Okonkwo"
              defaultValue="Maya Okonkwo"
            />
            <Input label="Email" type="email" placeholder="name@company.com" />
          </div>
        </Section>

        {/* ScoreDisplay */}
        <Section
          label="ScoreDisplay"
          hint="The score is the hero — big, calm, mono. It stays ink-coloured; it never adopts a verdict colour."
        >
          <div className="flex items-end gap-16">
            <ScoreDisplay score={86} label="Overall" />
            <ScoreDisplay score={72} suffix="/100" label="Technical" size="sm" />
          </div>
        </Section>

        {/* VerdictTag */}
        <Section
          label="VerdictTag"
          hint="The only coloured element in the product. Green for strong, amber for look closer."
        >
          <div className="flex flex-wrap items-center gap-3">
            <VerdictTag verdict="strong" />
            <VerdictTag verdict="look-closer" />
          </div>
        </Section>

        {/* CompetencyBar */}
        <Section
          label="CompetencyBar"
          hint="How a single competency reads: name left, mono score right, ink fill on a light track. No radar charts."
        >
          <Card className="p-6 max-w-md flex flex-col gap-5">
            <CompetencyBar name="System design" score={88} />
            <CompetencyBar name="Communication" score={74} />
            <CompetencyBar name="Ownership" score={91} />
            <CompetencyBar name="Code quality" score={63} />
          </Card>
        </Section>

        {/* EvidenceQuote */}
        <Section
          label="EvidenceQuote"
          hint="Ties a candidate's words to the competency they support."
        >
          <Card className="p-6 max-w-xl">
            <EvidenceQuote
              quote="I rewrote our ingestion pipeline to be idempotent, which let us replay a week of failed events without a single duplicate."
              competency="System design"
              source="Interview · Round 2"
            />
          </Card>
        </Section>

        {/* Nav — already shown at the top of the page */}
        <Section
          label="Nav / Top bar"
          hint="Shown live at the top of this page — minimal, separated by a single hairline."
        >
          <div className="overflow-hidden rounded-card border border-hairline">
            <Nav
              items={['Pipeline', 'Candidates', 'Roles']}
              active="Pipeline"
              action={<Button variant="secondary">Invite</Button>}
              className="!static"
            />
            <div className="bg-surface px-6 py-8 text-sm text-secondary">
              Page content sits below the hairline divider.
            </div>
          </div>
        </Section>

        {/* StaggerList — signature motion */}
        <Section
          label="StaggerList · signature motion"
          hint="The one motion in the system: a gentle staggered fade-in. We'll use it when candidates appear. Reload the page to replay; it respects reduced-motion."
        >
          <StaggerList className="flex flex-col gap-3 max-w-xl" step={90}>
            {[
              { name: 'Maya Okonkwo', role: 'Product Engineer', score: 86, verdict: 'strong' },
              { name: 'Daniel Reyes', role: 'Backend Engineer', score: 79, verdict: 'strong' },
              { name: 'Priya Nair', role: 'Platform Engineer', score: 64, verdict: 'look-closer' },
            ].map((c) => (
              <Card
                key={c.name}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="flex flex-col">
                  <span className="text-ink">{c.name}</span>
                  <span className="text-sm text-secondary">{c.role}</span>
                </div>
                <div className="flex items-center gap-5">
                  <ScoreDisplay score={c.score} label="" size="sm" />
                  <VerdictTag verdict={c.verdict} />
                </div>
              </Card>
            ))}
          </StaggerList>
        </Section>

        <footer className="border-t border-hairline pt-10 text-xs text-secondary font-mono uppercase tracking-[0.12em]">
          Azisly Recruit — design system v0
        </footer>
      </main>
    </div>
  )
}
