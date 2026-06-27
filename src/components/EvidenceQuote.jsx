/**
 * EvidenceQuote — a quote block that visually ties a candidate's words to the
 * competency they support. The ink rule on the left anchors the quote; the
 * caption names the competency (with a tiny uppercase "Supports" label).
 */
export default function EvidenceQuote({ quote, competency, source, className = '' }) {
  return (
    <figure className={`flex flex-col gap-2.5 border-l border-ink/80 pl-4 ${className}`}>
      <blockquote className="text-[15px] leading-relaxed text-ink">
        “{quote}”
      </blockquote>
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {competency && (
          <>
            <span className="font-mono uppercase tracking-[0.12em] text-secondary">
              Supports
            </span>
            <span className="text-ink">{competency}</span>
          </>
        )}
        {source && <span className="text-secondary">· {source}</span>}
      </figcaption>
    </figure>
  )
}
