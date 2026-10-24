import Button from './Button.jsx'
import Panel from './Panel.jsx'
import { isDue, isWeak } from '../lib/utils.js'

export default function Study({ cards, selection, onSelectionChange, onStart }) {
  const options = [
    { id: 'due', label: 'Due today', count: cards.filter((card) => isDue(card)).length },
    { id: 'weak', label: 'Needs work', count: cards.filter((card) => isWeak(card)).length },
    { id: 'all', label: 'All', count: cards.length },
  ]

  return (
    <Panel className="p-4">
      <h2 className="font-serif text-2xl text-ink">Choose your session</h2>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectionChange(option.id)}
            aria-pressed={selection === option.id}
            className={[
              'rounded-2xl border px-3 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/80 focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
              selection === option.id ? 'border-accent bg-accent/5' : 'border-line bg-bg',
            ].join(' ')}
          >
            <p className="text-xs uppercase tracking-[0.12em] text-muted">{option.label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">{option.count}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <Button onClick={() => onStart(selection)}>Start session</Button>
      </div>
    </Panel>
  )
}
