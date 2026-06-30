import { Card, Avatar, ScoreDisplay, CompetencyBar, EvidenceQuote, Tag } from '../components'
import { PlayIcon, CheckIcon } from '../components/icons.jsx'

const SectionLabel = ({ children }) => (
  <p className="text-sm font-medium tracking-normal text-secondary">{children}</p>
)

/* Small interview video poster used inside the expanded approved card. */
function InterviewThumb({ candidate }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gradient-to-br from-ink to-[#2c2c34]">
      <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 text-xs text-surface/90">
        <Avatar src={candidate.avatar} name={candidate.name} size={18} />
        Interview
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface/95 text-ink shadow-panel">
          <PlayIcon className="ml-0.5 h-5 w-5" />
        </span>
      </div>
      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-ink/70 px-1.5 py-0.5 font-mono text-[11px] text-surface">
        42:18
      </span>
    </div>
  )
}

/* An approved candidate, expanded inline — the key detail with no click. */
function ApprovedCard({ candidate, interview }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-start justify-between gap-6 border-b border-hairline px-6 py-5">
        <div className="flex items-center gap-3">
          <Avatar src={candidate.avatar} name={candidate.name} size={48} />
          <div className="flex flex-col gap-1.5">
            <div>
              <h3 className="text-lg text-ink">{candidate.name}</h3>
              <p className="text-[13px] text-secondary">
                {candidate.role} · {candidate.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Tag color="green">
                <CheckIcon className="mr-1 h-3 w-3" /> Taken forward
              </Tag>
            </div>
          </div>
        </div>
        <ScoreDisplay score={candidate.score} label="Overall" size="sm" />
      </div>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
        <section className="flex flex-col gap-3">
          <SectionLabel>Interview</SectionLabel>
          <InterviewThumb candidate={candidate} />
          {interview && (
            <p className="text-[13px] leading-relaxed text-secondary">{interview}</p>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <SectionLabel>Competencies</SectionLabel>
          <div className="flex flex-col gap-5">
            {candidate.competencies.map((c) => (
              <CompetencyBar key={c.name} name={c.name} score={c.score} />
            ))}
          </div>
        </section>
      </div>

      <div className="border-t border-hairline px-6 py-6">
        <SectionLabel>Evidence</SectionLabel>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {candidate.evidence.map((e, i) => (
            <Card key={i} className="p-5">
              <EvidenceQuote quote={e.quote} competency={e.competency} source={e.source} />
            </Card>
          ))}
        </div>
      </div>
    </Card>
  )
}

/* A candidate the manager did not pick — normal compact row. */
function CompactRow({ candidate }) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-hairline bg-surface px-4 py-4 shadow-card">
      <Avatar src={candidate.avatar} name={candidate.name} size={40} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{candidate.name}</div>
        <div className="truncate text-[13px] text-secondary">
          {candidate.role} · {candidate.location}
        </div>
      </div>
      <span className="font-mono text-sm text-ink tabular-nums">{candidate.score}</span>
      <Tag color="gray">Not taken forward</Tag>
    </div>
  )
}

/**
 * ManagerDecisionScreen — the recruiter's view once the hiring manager responds.
 * A status banner names the manager and role; approved candidates render
 * expanded inline (interview video, score in ink, competency bars, evidence)
 * with an "Approved by HM" badge, while the rest stay compact. A clear next
 * step moves the approved candidates on.
 */
export default function ManagerDecisionScreen({
  manager = 'Anjali Rao',
  roleTitle = 'Senior Product Engineer',
  candidates,
  approvedIds = [],
  interviews = {},
}) {
  const approved = new Set(approvedIds)
  const approvedCount = candidates.filter((c) => approved.has(c.id)).length

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Pipeline · {roleTitle}</p>
        <h1 className="mt-1.5 text-2xl text-ink">Manager&rsquo;s decision</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {/* Status banner — the manager responded */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-4">
            <Avatar name={manager} size={40} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">
                <span className="font-medium">{manager}</span> reviewed the candidates you shared
              </p>
              <p className="text-[13px] text-secondary">
                {roleTitle} · {approvedCount} of {candidates.length} taken forward · just now
              </p>
            </div>
          </div>

          {/* The list — approved expanded, others compact */}
          <div className="flex flex-col gap-4">
            {candidates.map((c) =>
              approved.has(c.id) ? (
                <ApprovedCard key={c.id} candidate={c} interview={interviews[c.id]} />
              ) : (
                <CompactRow key={c.id} candidate={c} />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
