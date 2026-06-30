import { CheckIcon, XIcon } from './icons.jsx'

const SIZES = {
  sm: { box: 'h-[22px] w-[22px]', icon: 'h-3 w-3' },
  lg: { box: 'h-9 w-9', icon: 'h-4 w-4' },
}

/**
 * JudgeControls — the recruiter's per-candidate decision: a tick (select to move
 * forward) and a cross (skip). The same control appears on the table rows, the
 * cards, and the detail page. Disabled for candidates that cannot be decided yet,
 * with the reason on hover.
 */
export default function JudgeControls({
  picked,
  skipped,
  disabled,
  reason,
  onTick,
  onCross,
  size = 'sm',
  className = '',
}) {
  const s = SIZES[size] ?? SIZES.sm
  const guard = (fn) => (e) => {
    e.stopPropagation()
    if (!disabled) fn?.(e)
  }
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={picked}
        aria-label="Select to move forward"
        title={disabled ? reason : 'Select to move forward'}
        onClick={guard(onTick)}
        className={`flex ${s.box} shrink-0 items-center justify-center rounded-full border transition-colors ${
          disabled
            ? 'cursor-not-allowed border-hairline bg-background text-secondary/40'
            : picked
              ? 'border-accent bg-accent text-surface'
              : 'border-hairline bg-surface text-secondary hover:border-accent hover:text-accent'
        }`}
      >
        <CheckIcon className={s.icon} />
      </button>
      <button
        type="button"
        disabled={disabled}
        aria-pressed={skipped}
        aria-label="Skip"
        title={disabled ? reason : 'Skip'}
        onClick={guard(onCross)}
        className={`flex ${s.box} shrink-0 items-center justify-center rounded-full border transition-colors ${
          disabled
            ? 'cursor-not-allowed border-hairline bg-background text-secondary/40'
            : skipped
              ? 'border-ink/50 bg-ink/70 text-surface'
              : 'border-hairline bg-surface text-secondary hover:border-ink/40 hover:text-ink'
        }`}
      >
        <XIcon className={s.icon} />
      </button>
    </div>
  )
}
