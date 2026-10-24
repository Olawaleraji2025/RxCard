export default function Panel({ children, className = '' }) {
  return (
    <section className={['rounded-2xl border border-line bg-surface p-4 shadow-sm', className].join(' ')}>
      {children}
    </section>
  )
}
