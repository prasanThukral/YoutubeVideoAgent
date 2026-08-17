import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  const base = 'rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-slate-900 text-white hover:bg-slate-700'
      : 'bg-transparent text-slate-600 hover:bg-slate-100'

  return <button className={`${base} ${styles} ${className}`} {...props} />
}
