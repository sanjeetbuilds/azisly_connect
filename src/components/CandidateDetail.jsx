import Button from './Button.jsx'
import Card from './Card.jsx'
import Avatar from './Avatar.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import CompetencyBar from './CompetencyBar.jsx'
import VerdictTag from './VerdictTag.jsx'
import EvidenceQuote from './EvidenceQuote.jsx'
import StageTracker from './StageTracker.jsx'

const SectionLabel = ({ children }) => (
  <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-secondary">{children}</h3>
)

/**
 * CandidateDetail — the right pane. Opens when a candidate row is selected.
 * Leads with the stage tracker, then the hero score, competency bars, evidence
 * quotes, and the action buttons (one primary, the rest secondary).
 */
export default function CandidateDetail({ candidate, onBack }) {
  return (
    <div className="flex flex-col">
      {/* Stage tracker — top of the detail view */}
      <div className="flex items-center gap-3 border-b border-hairline px-6 py-4 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="-ml-1 flex items-center gap-1 text-sm text-secondary transition-colors hover:text-ink lg:hidden"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
              <path d="M10 3.5L5.5 8l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}
        <StageTracker current={candidate.stage} />
      </div>

      <div className="flex flex-col gap-10 px-6 py-8 lg:px-8">
        {/* Header: identity + hero score */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar src={candidate.avatar} name={candidate.name} size={56} />
            <div className="flex flex-col gap-2">
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
        <section className="flex flex-col gap-4">
          <SectionLabel>Competencies</SectionLabel>
          <Card className="flex flex-col gap-5 p-6">
            {candidate.competencies.map((c) => (
              <CompetencyBar key={c.name} name={c.name} score={c.score} />
            ))}
          </Card>
        </section>

        {/* Evidence */}
        <section className="flex flex-col gap-4">
          <SectionLabel>Evidence</SectionLabel>
          <div className="flex flex-col gap-4">
            {candidate.evidence.map((e, i) => (
              <Card key={i} className="p-6">
                <EvidenceQuote quote={e.quote} competency={e.competency} source={e.source} />
              </Card>
            ))}
          </div>
        </section>

        {/* Actions — one primary, the rest secondary */}
        <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
          <Button variant="primary">Advance candidate</Button>
          <Button variant="secondary">Save for later</Button>
          <Button variant="secondary">Reject</Button>
        </div>
      </div>
    </div>
  )
}
