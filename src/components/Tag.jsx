/**
 * Tag — a small, soft-tinted category badge. Functional colour: it labels a
 * source, skill, or category — used tastefully, never for decoration.
 */
const TAG_COLORS = {
  gray: 'bg-[#F2F4F7] text-[#344054]',
  blue: 'bg-[#EEF4FF] text-[#3538CD]',
  green: 'bg-[#ECFDF3] text-[#027A48]',
  purple: 'bg-[#F4F3FF] text-[#5925DC]',
  amber: 'bg-[#FFFAEB] text-[#B54708]',
  rose: 'bg-[#FFF1F3] text-[#C01048]',
}

// Stable colour per skill so the same skill always reads the same.
const SKILL_PALETTE = ['blue', 'green', 'purple', 'gray']
export function skillColor(skill) {
  let h = 0
  for (let i = 0; i < skill.length; i += 1) h = (h * 31 + skill.charCodeAt(i)) >>> 0
  return SKILL_PALETTE[h % SKILL_PALETTE.length]
}

export default function Tag({ color = 'gray', children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ${
        TAG_COLORS[color] ?? TAG_COLORS.gray
      } ${className}`}
    >
      {children}
    </span>
  )
}
