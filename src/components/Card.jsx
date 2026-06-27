/**
 * Card — white surface, hairline border, ~10px radius, with soft elevation so
 * surfaces layer instead of sitting flat. Pass a different shadow via className
 * to override (e.g. shadow-panel for floating surfaces).
 */
export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`bg-surface border border-hairline rounded-card shadow-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
