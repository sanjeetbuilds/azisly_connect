import { useId } from 'react'
import { CheckIcon } from './icons.jsx'

/**
 * Checkbox — a real, accessible `<input type="checkbox">` styled to match the
 * visual language already used for selection state elsewhere (a filled green
 * square with a check, same shape as the read-only indicator in InviteScreen),
 * with a label alongside for terms/consent and "keep me logged in" style use.
 */
export default function Checkbox({ id, label, checked, onChange, className = '', ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <label htmlFor={inputId} className={`flex cursor-pointer items-start gap-2.5 select-none ${className}`}>
      <span className="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
          {...props}
        />
        <span
          className={`pointer-events-none flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors
            peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30
            ${checked ? 'border-accent bg-accent text-surface' : 'border-hairline bg-surface'}`}
        >
          {checked && <CheckIcon className="h-3 w-3" />}
        </span>
      </span>
      {label && <span className="text-sm leading-snug text-secondary">{label}</span>}
    </label>
  )
}
