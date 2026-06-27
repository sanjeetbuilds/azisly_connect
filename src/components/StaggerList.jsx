import { Children, cloneElement, isValidElement } from 'react'

/**
 * StaggerList — the one signature motion. Children fade-and-rise in sequence,
 * each delayed a touch more than the last. We'll reach for this when a list of
 * candidates appears.
 *
 * Motion is applied by cloning each child (so it composes with grids, flex,
 * and custom markup). The fade is disabled automatically for users who prefer
 * reduced motion — see the media query in index.css.
 *
 * step : delay between items, in ms.
 */
export default function StaggerList({ children, step = 70, className = '', as: Tag = 'div' }) {
  return (
    <Tag className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child
        return cloneElement(child, {
          className: `${child.props.className ?? ''} animate-fade-in-up`.trim(),
          style: { ...(child.props.style ?? {}), animationDelay: `${i * step}ms` },
        })
      })}
    </Tag>
  )
}
