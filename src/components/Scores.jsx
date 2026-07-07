import VerdictTag from './VerdictTag.jsx'

/**
 * Scores — the two scores that exist in the product, always labelled separately
 * and never merged:
 *
 *   Match      pre-interview fit estimate (the only score on the matched list)
 *   Interview  the assessed interview score (appears after the interview)
 *
 * Both numbers render in ink; meaning is carried by the verdict tag, gates, and
 * competency bars, not by colouring the score itself.
 */

const NUM_SIZES = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl', xl: 'text-[40px]' }

/* A plain score number in ink; a missing value reads as a quiet dash. */
export function ScoreValue({ value, size = 'sm', className = '' }) {
  const empty = value == null
  return (
    <span
      className={`font-semibold tabular-nums ${NUM_SIZES[size]} ${empty ? 'text-muted' : 'text-ink'} ${className}`}
    >
      {empty ? '—' : value}
    </span>
  )
}

/* Back-compat aliases used around the app. */
export const PriorScoreValue = ScoreValue
export function InterviewScoreValue({ candidate, size = 'sm', showGate = true, className = '' }) {
  if (candidate.score == null) {
    return <span className={`text-[13px] text-muted ${className}`}>Not scored</span>
  }
  return (
    <span className={`inline-flex items-baseline gap-1 tabular-nums ${className}`}>
      <span className={`font-semibold ${NUM_SIZES[size]} text-ink`}>{candidate.score}</span>
      {showGate && candidate.gate && <span className="text-[11px] font-medium text-attention">review</span>}
    </span>
  )
}

/* One labelled column: a small grey caps label above its value. */
function LabelledScore({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </div>
  )
}

/**
 * Scores (hero) — the two labelled scores for the candidate detail: Match and
 * Interview, with the verdict tag beneath the interview score.
 */
export default function Scores({ candidate, className = '' }) {
  return (
    <div className={`flex items-stretch gap-8 ${className}`}>
      <LabelledScore label="Match score">
        <ScoreValue value={candidate.match} size="lg" />
      </LabelledScore>
      <span aria-hidden="true" className="w-px self-stretch bg-hairline" />
      <LabelledScore label="Interview score">
        <div className="flex flex-col items-start gap-2">
          <InterviewScoreValue candidate={candidate} size="xl" showGate={false} />
          {candidate.verdict && <VerdictTag verdict={candidate.verdict} />}
        </div>
      </LabelledScore>
    </div>
  )
}
