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
import JudgeControls from './JudgeControls.jsx'
import { XIcon, PlayIcon, CheckIcon, MailIcon, PhoneIcon } from './icons.jsx'
import { SOURCES, stageTrackIndex, GATE, contactsFor } from '../data/candidates.js'

// A plain <p>, not a heading — headings inherit the global ink colour and
// tighter tracking; section labels must stay small, grey, and normally spaced.
const SectionLabel = ({ children }) => (
  <p className="text-sm font-medium tracking-normal text-secondary">{children}</p>
)

/* A mocked interview video poster + transcript summary. */
function InterviewVideo({ candidate, summary }) {
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Interview</SectionLabel>
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-video w-full bg-gradient-to-br from-ink to-[#2c2c34]">
          <span className="absolute left-3 top-3 flex items-center gap-2 text-xs text-surface/90">
            <Avatar src={candidate.avatar} name={candidate.name} size={22} />
            {candidate.name}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/95 text-ink shadow-panel transition-transform hover:scale-105">
              <PlayIcon className="ml-1 h-6 w-6" />
            </span>
          </div>
          <span className="absolute bottom-3 right-3 rounded-md bg-ink/70 px-2 py-0.5 font-mono text-xs text-surface">
            42:18
          </span>
        </div>
        {summary && <p className="px-6 py-5 text-sm leading-relaxed text-secondary">{summary}</p>}
      </Card>
    </section>
  )
}

/**
 * CandidateDetail — the right pane. Opens when a candidate row is selected.
 * Leads with the stage tracker, then the hero score, competency bars, evidence
 * quotes, and the action buttons (one primary, the rest secondary).
 */
export default function CandidateDetail({
  candidate,
  onBack,
  interview,
  decided,
  onTakeForward,
  onUndo,
  judge,
}) {
  const src = SOURCES[candidate.source]
  const managerMode = Boolean(onTakeForward)
  const scored = Boolean(candidate.verdict)
  const decidedForward = candidate.stage === 'Taken forward' || candidate.stage === 'Moving forward'
  const contacts = decidedForward ? contactsFor(candidate.name) : null
  return (
    <div className="flex flex-col">
      {/* Stage tracker + close — top of the floating detail panel */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        <StageTracker current={stageTrackIndex(candidate.stage)} className="min-w-0" />
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
                  <Tag color="gray">{candidate.stage}</Tag>
                  {candidate.verdict && <VerdictTag verdict={candidate.verdict} />}
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
            {candidate.score != null ? (
              <ScoreDisplay score={candidate.score} label="Overall" />
            ) : (
              <span className="shrink-0 text-sm text-secondary">Not scored yet</span>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {candidate.skills.map((s) => (
              <Tag key={s} color={skillColor(s)}>
                {s}
              </Tag>
            ))}
          </div>

          {/* Gate failure — why a human is needed, made explicit */}
          {candidate.gate && (
            <div className="flex items-start gap-2.5 rounded-lg border border-attention/25 bg-attention/[0.07] px-3.5 py-3 text-[13px] leading-relaxed text-attention">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-attention" />
              <span>
                <span className="font-medium">Gate: {candidate.gate.competency}</span> scored{' '}
                {candidate.gate.score}, below the {GATE} threshold. A human look is needed before this
                candidate is shared.
              </span>
            </div>
          )}
        </div>

        {/* Interview video — shown to recruiter and manager alike, once scored */}
        {scored && <InterviewVideo candidate={candidate} summary={interview} />}

        {/* Competencies */}
        <section className="flex flex-col gap-4">
          <SectionLabel>Competencies</SectionLabel>
          {candidate.competencies.length > 0 ? (
            <Card className="flex flex-col gap-6 p-6">
              {candidate.competencies.map((c) => (
                <CompetencyBar key={c.name} name={c.name} score={c.score} />
              ))}
            </Card>
          ) : (
            <Card className="p-6 text-sm text-secondary">
              Competency scores appear once the interview is complete.
            </Card>
          )}
        </section>

        {/* Evidence */}
        {candidate.evidence.length > 0 && (
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
        )}

        {/* Contact details — unlocked once the manager takes the candidate forward */}
        {decidedForward && contacts && (
          <section className="flex flex-col gap-4">
            <SectionLabel>Contact details</SectionLabel>
            <Card className="flex flex-col gap-3 p-6">
              <a
                href={`mailto:${contacts.email}`}
                className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
              >
                <MailIcon className="h-4 w-4 text-secondary" />
                {contacts.email}
              </a>
              <div className="flex items-center gap-3 text-sm text-ink">
                <PhoneIcon className="h-4 w-4 text-secondary" />
                {contacts.phone}
              </div>
            </Card>
          </section>
        )}

        {/* Actions */}
        <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t border-hairline bg-surface px-6 py-5 lg:-mx-8 lg:px-8">
          {managerMode ? (
            decided ? (
              <>
                <span className="flex items-center gap-2 text-sm font-medium text-strong">
                  <CheckIcon className="h-4 w-4" /> Taken forward
                </span>
                <Button variant="secondary" className="ml-auto" onClick={() => onUndo?.(candidate)}>
                  Undo
                </Button>
              </>
            ) : (
              <>
                <Button variant="primary" onClick={() => onTakeForward?.(candidate)}>
                  Take forward
                </Button>
                <Kbd className="ml-auto">⌘↵</Kbd>
              </>
            )
          ) : decidedForward ? (
            // Decided forward, by the manager or the recruiter. No further judging.
            <span className="flex items-center gap-2 text-sm font-medium text-strong">
              <CheckIcon className="h-4 w-4" />
              {candidate.stage === 'Taken forward'
                ? 'Taken forward by the hiring manager. Reach out to start the offline rounds.'
                : 'Moving forward, your decision. Reach out to start the offline rounds.'}
            </span>
          ) : judge?.eligible ? (
            <div className="flex w-full items-center gap-4">
              <JudgeControls
                size="lg"
                picked={judge.picked}
                skipped={judge.skipped}
                onTick={judge.onTick}
                onCross={judge.onCross}
              />
              <span className="text-sm text-secondary">
                {judge.picked
                  ? 'Selected to move forward'
                  : judge.skipped
                    ? 'Skipped'
                    : 'Select to move forward, or skip'}
              </span>
            </div>
          ) : candidate.stage === 'Shared' ? (
            <span className="text-sm text-secondary">
              With the hiring manager, awaiting their picks
            </span>
          ) : (
            <span className="text-sm text-secondary">{candidate.stage}</span>
          )}
        </div>
      </div>
    </div>
  )
}
