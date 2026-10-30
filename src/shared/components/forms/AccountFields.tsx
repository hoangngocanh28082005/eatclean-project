import type { InputHTMLAttributes } from 'react'
export const fieldClass = 'w-full rounded-xl border border-sage-200 bg-white px-4 py-3 text-sm text-forest-900 focus:border-forest-500 focus:outline-none'
export const panelClass = 'space-y-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200 sm:p-8'
export function AccountField({ label, name, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return <label className="block text-sm font-semibold text-forest-900"><span className="mb-2 block">{label}</span><input name={name} className={fieldClass} {...props} /></label>
}
export function Feedback({ error, message }: { error?: string; message?: string }) {
  return <>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}{message && <p role="status" className="rounded-xl bg-sage-100 p-4 text-sm text-forest-900">{message}</p>}</>
}
