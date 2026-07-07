/**
 * StatusPill — a quiet status like the reference's: a small coloured dot and a
 * label in a soft rounded pill. Tones stay in the calm brand family.
 */
const TONES = {
  neutral: { bg: 'bg-ink/[0.04]', dot: 'bg-secondary/60', text: 'text-secondary' },
  success: { bg: 'bg-success-soft', dot: 'bg-accent-dot', text: 'text-strong' },
  warning: { bg: 'bg-warning-soft', dot: 'bg-attention', text: 'text-attention' },
  danger: { bg: 'bg-danger-soft', dot: 'bg-danger', text: 'text-danger' },
  accent: { bg: 'bg-accent-soft', dot: 'bg-accent-dot', text: 'text-strong' },
}

export default function StatusPill({ label, tone = 'neutral', className = '' }) {
  const t = TONES[tone] ?? TONES.neutral
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium ${t.bg} ${t.text} ${className}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}
