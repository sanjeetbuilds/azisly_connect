/**
 * Avatar — a solid, saturated colour circle with white monogram initials, the
 * identity treatment from the reference. The fill is derived from the name (or
 * an explicit `seed`), so the same person always reads the same colour.
 *
 * `src` is accepted for compatibility but not rendered: the app uses colour
 * initials everywhere for a single, consistent identity system.
 */
function initials(name = '') {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Saturated but calm fills; white text sits on all of them.
const FILLS = [
  '#3f7d5a', // green
  '#3a6fb0', // blue
  '#2f8f88', // teal
  '#8a6d3b', // olive
  '#b5731f', // amber
  '#7a5aa8', // purple
  '#b05678', // rose
  '#4b6bb0', // indigo
  '#2e7d50', // emerald
]

function fillFor(key = '') {
  let h = 0
  for (let i = 0; i < key.length; i += 1) h = (h * 31 + key.charCodeAt(i)) >>> 0
  return FILLS[h % FILLS.length]
}

export default function Avatar({ name = '', seed, size = 40, className = '', src: _src, ...rest }) {
  const bg = fillFor(seed != null ? String(seed) : name)
  const fontSize = Math.round(size * 0.4)

  return (
    <span
      style={{ width: size, height: size, backgroundColor: bg, fontSize }}
      aria-label={name}
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold leading-none text-white ${className}`}
      {...rest}
    >
      {initials(name)}
    </span>
  )
}
