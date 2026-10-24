import Button from './Button.jsx'
import Panel from './Panel.jsx'
import { isDue, isWeak } from '../lib/utils.js'

export default function Home({ cards, onStartStudy, onOpenForm }) {
  const total = cards.length
  const dueToday = cards.filter((card) => isDue(card)).length
  const needWork = cards.filter((card) => isWeak(card)).length

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Panel className="p-3 text-center">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Total</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{total}</p>
        </Panel>
        <Panel className="p-3 text-center">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Due today</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{dueToday}</p>
        </Panel>
        <Panel className="p-3 text-center">
          <p className="text-xs uppercase tracking-[0.12em] text-muted">Need work</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{needWork}</p>
        </Panel>
      </div>

      <Panel>
        <h2 className="font-serif text-2xl text-ink">How it works</h2>
        <p className="mt-3 text-sm text-muted">
          Review a medicine, test recall, and log the result. MedCards keeps the next review date in Supabase so your revision schedule stays in sync.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => onStartStudy('flashcards', 'due')}>Start flashcards</Button>
          <Button variant="ghost" onClick={() => onStartStudy('quiz', 'due')}>Take a quiz</Button>
        </div>
      </Panel>

      {cards.length === 0 ? (
        <Panel className="p-6 text-center">
          <h3 className="font-serif text-2xl text-ink">No medications yet</h3>
          <p className="mt-2 text-sm text-muted">
            Add a medication to begin active recall and spaced repetition.
          </p>
          <div className="mt-4 flex justify-center">
            <Button onClick={onOpenForm}>Add a medication</Button>
          </div>
        </Panel>
      ) : null}

      <p className="text-xs text-muted">
        Verify details against the BNF, package leaflet, or your course materials before revising.
      </p>
    </div>
  )
}
