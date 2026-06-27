import Button from './Button.jsx'
import Card from './Card.jsx'
import Avatar from './Avatar.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import CompetencyBar from './CompetencyBar.jsx'
import VerdictTag from './VerdictTag.jsx'
import EvidenceQuote from './EvidenceQuote.jsx'
import StageTracker from './StageTracker.jsx'
import Tag, { skillColor } from './Tag.jsx'
import Kbd from './Kbd.jsx'
import { XIcon } from './icons.jsx'
import { SOURCES } from '../data/candidates.js'

// A plain <p>, not a heading — headings inherit the global ink colour and
// tighter tracking; section labels must stay small, grey, and normally spaced.
const SectionLabel = ({ children }) => (
  <p className="text-sm font-medium tracking-normal text-secondary">{children}</p>
)

/**
 * CandidateDetail — the right pane. Opens when a candidate row is selected.
 * Leads with the stage tracker, then the hero score, competency bars, evidence
 * quotes, and the action buttons (one primary, the rest secondary).
 */
export default function CandidateDetail({ candidate, onBack, onDecide }) {
  const src = SOURCES[candidate.source]
  return (
    <div className="flex flex-col">
      {/* Stage tracker + close — top of the floating detail panel */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        <StageTracker current={candidate.stage} className="min-w-0" />
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Close detail"
            className="shrink-0 rounded-lg border border-hairline p-1.5 text-secondary transition-colors hover:border-ink/30 hover:text-ink"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-10 px-6 py-8 lg:px-8">
        {/* Header: identity + meta + hero score */}
        <div className="flex flex-col gap-5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar src={candidate.avatar} name={candidate.name} size={56} />
              <div className="flex flex-col gap-2">
                <div>
                  <h2 className="text-xl text-ink">{candidate.name}</h2>
                  <p className="text-sm text-secondary">{candidate.role}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-[13px] text-secondary">
                  <VerdictTag verdict={candidate.verdict} />
                  <span>·</span>
                  <span>{candidate.location}</span>
                  <span>·</span>
                  <span>{candidate.experience}</span>
                  <span>·</span>
                  <span>Applied {candidate.applied}</span>
                  {src && <Tag color={src.color}>{src.label}</Tag>}
                </div>
              </div>
            </div>
            <ScoreDisplay score={candidate.score} label="Overall" />
          </div>

          {/* Skills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {candidate.skills.map((s) => (
              <Tag key={s} color={skillColor(s)}>
                {s}
              </Tag>
            ))}
          </div>
        </div>

        {/* Competencies */}
        <section className="flex flex-col gap-4">
          <SectionLabel>Competencies</SectionLabel>
          <Card className="flex flex-col gap-6 p-6">
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
        <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t border-hairline bg-surface px-6 py-5 lg:-mx-8 lg:px-8">
          <Button variant="primary" onClick={() => onDecide?.(candidate)}>
            Shortlist or pass
          </Button>
          <Button variant="secondary">Save for later</Button>
          <Kbd className="ml-auto">⌘↵</Kbd>
        </div>
      </div>
    </div>
  )
}
