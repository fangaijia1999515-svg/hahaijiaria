/**
 * DS INPUT — labelled field, states default / focus / filled (light + dark).
 * Focus ring = sage-green token. Her component sheet.
 */
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react"

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

export function Field({ label, children }: { label?: string; children: ReactNode }) {
  return (
    <label className="ds-field">
      {label && <span className="ds-field__label">{label}</span>}
      {children}
    </label>
  )
}

export function Input({ label, className, ...rest }:
  { label?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const el = <input className={cx("ds-input", className)} {...rest} />
  return label ? <Field label={label}>{el}</Field> : el
}

export function Textarea({ label, className, ...rest }:
  { label?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const el = <textarea className={cx("ds-input", className)} {...rest} />
  return label ? <Field label={label}>{el}</Field> : el
}
