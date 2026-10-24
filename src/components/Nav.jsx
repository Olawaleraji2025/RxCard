const tabs = [
  { id: 'home', label: 'Home' },
  { id: 'cards', label: 'Cards' },
  { id: 'flashcards', label: 'Flashcards' },
  { id: 'quiz', label: 'Quiz' },
]

export default function Nav({ currentTab, onChange }) {
  return (
    <nav className="rounded-full border border-line bg-surface p-1 shadow-sm">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-selected={currentTab === tab.id}
            onClick={() => onChange(tab.id)}
            className={[
              'flex-1 rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              currentTab === tab.id ? 'bg-accent text-white' : 'text-muted hover:bg-bg',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
