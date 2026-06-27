import { useState } from 'react'

/**
 * Avatar — a candidate (or workspace) photo. Falls back to monogram initials
 * inside a hairline circle if the image is missing or fails to load. Stays in
 * the ink/greyscale palette.
 */
function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ src, name = '', size = 40, className = '' }) {
  const [failed, setFailed] = useState(false)
  const dim = { width: size, height: size }

  if (!src || failed) {
    return (
      <span
        style={dim}
        aria-label={name}
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-hairline bg-background font-mono text-[11px] text-secondary ${className}`}
      >
        {initials(name)}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      style={dim}
      onError={() => setFailed(true)}
      loading="lazy"
      className={`shrink-0 rounded-full border border-hairline object-cover ${className}`}
    />
  )
}
