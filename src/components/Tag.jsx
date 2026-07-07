/**
 * Tag — an outlined, rounded-full category pill (the reference's tag style): a
 * thin coloured border with matching text on a transparent fill. Functional
 * colour only, used to label a skill, course, discipline, or source.
 */
const TAG_COLORS = {
  gray: 'border-hairline text-secondary',
  blue: 'border-[#c5d6ee] text-[#3a6fb0]',
  green: 'border-[#bfe0cb] text-[#2e7d50]',
  purple: 'border-[#d9cdf0] text-[#6b4ea8]',
  amber: 'border-[#e6dcbb] text-[#b5731f]',
  rose: 'border-[#eec7d3] text-[#b05678]',
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
      className={`inline-flex items-center gap-1 rounded-full border bg-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${
        TAG_COLORS[color] ?? TAG_COLORS.gray
      } ${className}`}
    >
      {children}
    </span>
  )
}
