/**
 * EvidenceQuote — a quote block that visually ties a candidate's words to the
 * competency they support. The ink rule on the left anchors the quote; the
 * caption names the competency with a soft sentence-case "Supports" label.
 */
export default function EvidenceQuote({ quote, competency, source, className = '' }) {
  return (
    <figure className={`flex flex-col gap-3 border-l border-ink/80 pl-5 ${className}`}>
      <blockquote className="text-[15px] leading-relaxed text-ink">
        “{quote}”
      </blockquote>
      <figcaption className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
        {competency && (
          <>
            <span className="text-secondary">Supports</span>
            <span className="text-ink">{competency}</span>
          </>
        )}
        {source && <span className="text-secondary">· {source}</span>}
      </figcaption>
    </figure>
  )
}
