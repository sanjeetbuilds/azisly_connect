/**
 * ScoreDisplay — the score is the hero. Big, calm, mono, and ink-coloured
 * (it never takes on a verdict colour). A tiny uppercase label sits beneath.
 *
 * size: 'lg' (default hero) | 'sm' (inline / secondary placements)
 */
export default function ScoreDisplay({
  score,
  label = 'Overall',
  suffix,
  size = 'lg',
  className = '',
}) {
  const sizes = {
    lg: 'text-7xl',
    sm: 'text-4xl',
  }

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      <span
        className={`font-mono ${sizes[size] ?? sizes.lg} font-medium leading-none text-ink tabular-nums`}
      >
        {score}
        {suffix && <span className="text-secondary">{suffix}</span>}
      </span>
      {label && <span className="text-sm text-secondary">{label}</span>}
    </div>
  )
}
