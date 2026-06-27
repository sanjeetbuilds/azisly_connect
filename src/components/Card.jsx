/**
 * Card — white surface, hairline border, ~10px radius, NO shadow.
 * Separation comes from whitespace and the hairline, never elevation.
 */
export default function Card({ as: Tag = 'div', className = '', children, ...props }) {
  return (
    <Tag
      className={`bg-surface border border-hairline rounded-card ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
