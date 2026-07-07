/**
 * RadarChart — the candidate's competency shape, in our green palette. Plots real
 * scores only (pass at least three assessed competencies). If every point has a
 * target, a faint dashed outline overlays the role target behind the filled
 * candidate shape. Axis labels wrap so long competency names never clip.
 */
export default function RadarChart({ data, max = 100 }) {
  const n = data.length
  if (n < 3) return null

  const W = 300
  const H = 250
  const cx = W / 2
  const cy = H / 2
  const R = 78
  const labelR = R + 18

  const angleAt = (i) => (-90 + (i * 360) / n) * (Math.PI / 180)
  const pt = (r, i) => [cx + r * Math.cos(angleAt(i)), cy + r * Math.sin(angleAt(i))]
  const ring = (frac) => data.map((_, i) => pt(frac * R, i).join(',')).join(' ')
  const shape = (valueFn) => data.map((d, i) => pt((valueFn(d) / max) * R, i).join(',')).join(' ')
  const hasTarget = data.every((d) => d.target != null)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Competency radar">
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((lv) => (
        <polygon key={lv} points={ring(lv)} className="fill-none stroke-hairline" strokeWidth="1" />
      ))}
      {/* Axes */}
      {data.map((_, i) => {
        const [x, y] = pt(R, i)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="stroke-hairline" strokeWidth="1" />
      })}
      {/* Role target overlay */}
      {hasTarget && (
        <polygon
          points={shape((d) => d.target)}
          className="fill-none stroke-ink/35"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeLinejoin="round"
        />
      )}
      {/* Candidate shape */}
      <polygon points={shape((d) => d.score)} className="fill-strong/15 stroke-strong" strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => {
        const [x, y] = pt((d.score / max) * R, i)
        return <circle key={d.name} cx={x} cy={y} r="2.5" className="fill-strong" />
      })}
      {/* Axis labels */}
      {data.map((d, i) => {
        const [x, y] = pt(labelR, i)
        const cos = Math.cos(angleAt(i))
        const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle'
        const words = d.name.split(' ')
        const twoLine = words.length > 1 && d.name.length > 10
        return (
          <text
            key={d.name}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-secondary font-medium"
            style={{ fontSize: 9 }}
          >
            {twoLine ? (
              <>
                <tspan x={x} dy="-0.45em">
                  {words[0]}
                </tspan>
                <tspan x={x} dy="1em">
                  {words.slice(1).join(' ')}
                </tspan>
              </>
            ) : (
              d.name
            )}
          </text>
        )
      })}
    </svg>
  )
}
