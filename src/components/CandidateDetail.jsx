import Button from './Button.jsx'
import Card from './Card.jsx'
import Avatar from './Avatar.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import CompetencyBar from './CompetencyBar.jsx'
import VerdictTag from './VerdictTag.jsx'
import EvidenceQuote from './EvidenceQuote.jsx'
import StageTracker from './StageTracker.jsx'

const SectionLabel = ({ children }) => (
  <h3 className="text-sm font-medium text-secondary">{children}</h3>
)

/**
 * CandidateDetail — the right pane. Opens when a candidate row is selected.
 * Leads with the stage tracker, then the hero score, competency bars, evidence
 * quotes, and the action buttons (one primary, the rest secondary).
 */
export default function CandidateDetail({ candidate, onBack }) {
  return (
    <div className="flex flex-col">
      {/* Stage tracker + close — top of the detail overlay */}
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-8 py-5 lg:px-12">
        <StageTracker current={candidate.stage} className="min-w-0" />
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Close detail"
            className="shrink-0 rounded-full border border-hairline p-1.5 text-secondary transition-colors hover:border-ink/30 hover:text-ink"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-8 py-12 lg:px-12 lg:py-14">
        {/* Header: identity + hero score */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={candidate.avatar} name={candidate.name} size={56} />
            <div className="flex flex-col gap-2.5">
              <div>
                <h2 className="text-xl text-ink">{candidate.name}</h2>
                <p className="text-sm text-secondary">{candidate.role}</p>
              </div>
              <VerdictTag verdict={candidate.verdict} />
            </div>
          </div>
          <ScoreDisplay score={candidate.score} label="Overall" />
        </div>

        {/* Competencies */}
        <section className="flex flex-col gap-5">
          <SectionLabel>Competencies</SectionLabel>
          <Card className="flex flex-col gap-6 p-8">
            {candidate.competencies.map((c) => (
              <CompetencyBar key={c.name} name={c.name} score={c.score} />
            ))}
          </Card>
        </section>

        {/* Evidence */}
        <section className="flex flex-col gap-5">
          <SectionLabel>Evidence</SectionLabel>
          <div className="flex flex-col gap-5">
            {candidate.evidence.map((e, i) => (
              <Card key={i} className="p-8">
                <EvidenceQuote quote={e.quote} competency={e.competency} source={e.source} />
              </Card>
            ))}
          </div>
        </section>

        {/* Actions — one primary, the rest secondary */}
        <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-8">
          <Button variant="primary">Advance candidate</Button>
          <Button variant="secondary">Save for later</Button>
          <Button variant="secondary">Reject</Button>
        </div>
      </div>
    </div>
  )
}
