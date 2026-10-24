const variants = {
  primary: 'bg-accent text-white border border-accent shadow-sm hover:opacity-95',
  ghost: 'border border-line bg-transparent text-ink hover:bg-bg',
  ok: 'bg-ok text-white border border-ok shadow-sm hover:opacity-95',
  bad: 'bg-bad text-white border border-bad shadow-sm hover:opacity-95',
}

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] ?? variants.primary,
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
