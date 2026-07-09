import { LADDER } from '../data/scorecard.js'

/**
 * RungTag — one rung of the importance ladder (must-have, very-important,
 * baseline). A small colour-coded pill so the recruiter reads how much a quality
 * matters at a glance, the same way on every card. No numeric weight.
 */
export default function RungTag({ rung, className = '' }) {
  const r = LADDER[rung]
  if (!r) return null
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${r.pill} ${className}`}
    >
      {r.label}
    </span>
  )
}
