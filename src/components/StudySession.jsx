import { useEffect, useMemo, useState } from 'react'
import { FIELDS } from '../lib/fields.js'
import { filledFields, isDue, isWeak, shuffle } from '../lib/utils.js'
import Button from './Button.jsx'
import Panel from './Panel.jsx'

export default function StudySession({ cards, selection, kind, onHome }) {
  const [sessionCards, setSessionCards] = useState([])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answer, setAnswer] = useState('')
  const [saveWarning, setSaveWarning] = useState(false)
  const [completed, setCompleted] = useState(false)

  const filteredCards = useMemo(() => {
    if (selection === 'due') {
      return cards.filter((card) => isDue(card))
    }

    if (selection === 'weak') {
      return cards.filter((card) => isWeak(card))
    }

    return cards
  }, [cards, selection])

  const totalQuestions = useMemo(
    () => filteredCards.reduce((sum, card) => sum + filledFields(card).length, 0),
    [filteredCards]
  )

  useEffect(() => {
    const nextCards = shuffle(
      filteredCards.flatMap((card) =>
        filledFields(card).map((field) => ({ card, field }))
      )
    )

    setSessionCards(nextCards)
    setIndex(0)
    setScore(0)
    setFlipped(false)
    setShowAnswer(false)
    setAnswer('')
    setSaveWarning(false)
    setCompleted(false)
  }, [filteredCards])

  if (!totalQuestions) {
    return (
      <Panel className="p-6 text-center">
        <h3 className="font-serif text-2xl text-ink">No questions in this set</h3>
        <p className="mt-2 text-sm text-muted">Add a medication with at least one filled field, or choose another study set.</p>
        <div className="mt-4 flex justify-center">
          <Button variant="ghost" onClick={onHome}>Home</Button>
        </div>
      </Panel>
    )
  }

  const currentEntry = sessionCards[index]
  const currentCard = currentEntry?.card
  const activeField = currentEntry?.field
  const currentFields = currentCard ? filledFields(currentCard) : []
  const progress = sessionCards.length ? ((index + (completed ? 1 : 0)) / sessionCards.length) * 100 : 0

  const resetSession = () => {
    const nextCards = shuffle(
      filteredCards.flatMap((card) =>
        filledFields(card).map((field) => ({ card, field }))
      )
    )

    setSessionCards(nextCards)
    setIndex(0)
    setScore(0)
    setFlipped(false)
    setShowAnswer(false)
    setAnswer('')
    setSaveWarning(false)
    setCompleted(false)
  }

  const goToPrevious = () => {
    if (index === 0) {
      return
    }

    setIndex((previous) => previous - 1)
    setFlipped(false)
    setShowAnswer(false)
    setAnswer('')
  }

  const goToNext = () => {
    if (!currentCard) {
      return
    }

    const nextIndex = index + 1
    if (nextIndex >= sessionCards.length) {
      setCompleted(true)
      return
    }

    setIndex(nextIndex)
    setFlipped(false)
    setShowAnswer(false)
    setAnswer('')
  }

  if (completed) {
    return (
      <Panel className="p-6">
        <h3 className="font-serif text-3xl text-ink">Session complete</h3>
        <p className="mt-3 text-sm text-muted">
          You completed {sessionCards.length} {kind === 'flashcards' ? 'flashcard' : 'quiz'} question{sessionCards.length === 1 ? '' : 's'}.
        </p>

        {saveWarning ? (
          <p className="mt-3 rounded-xl border border-bad/30 bg-bad/5 p-3 text-sm text-bad">
            One or more answers did not save. Please review and repeat the session.
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={resetSession}>Study again</Button>
          <Button variant="ghost" onClick={onHome}>Home</Button>
        </div>
      </Panel>
    )
  }

  if (!currentCard) {
    return (
      <Panel className="p-6 text-center text-muted">
        Loading cards…
      </Panel>
    )
  }

  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between gap-3 text-sm text-muted">
        <span>
          {index + 1} / {sessionCards.length}
        </span>
        <span>{kind === 'flashcards' ? 'Flashcards' : 'Quiz'}</span>
      </div>

      <div className="mb-5 h-2 overflow-hidden rounded-full bg-bg">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      {kind === 'flashcards' ? (
        <div className="space-y-5">
          <h3 className="font-serif text-4xl text-ink">{currentCard.name}</h3>

          {!flipped ? (
            <Button onClick={() => setFlipped(true)}>Flip card</Button>
          ) : (
            <div className="space-y-4 rounded-2xl border border-line bg-bg p-4">
              {currentFields.map((field) => (
                <div key={field.key}>
                  <p className={['text-sm font-medium', field.key === 'cannot' ? 'text-bad' : 'text-ink'].join(' ')}>
                    {field.label}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-muted">{currentCard[field.key]}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={goToPrevious} disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={goToNext}>
              {index === sessionCards.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.12em] text-muted">Question</p>
          <h3 className="font-serif text-2xl text-ink">
            {activeField ? activeField.question.replace('{name}', currentCard.name) : 'No question available'}
          </h3>

          <div>
            <label htmlFor="answer-box" className="mb-1 block text-sm font-medium text-ink">
              Your answer
            </label>
            <textarea
              id="answer-box"
              rows={4}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Type your answer here"
            />
          </div>

          {showAnswer ? (
            <div className="rounded-2xl border border-line bg-bg p-4">
              <p className="text-sm uppercase tracking-[0.12em] text-muted">Answer</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
                {activeField ? currentCard[activeField.key] : ''}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => setShowAnswer(true)}>Show answer</Button>
            <Button variant="ghost" onClick={goToPrevious} disabled={index === 0}>
              Previous
            </Button>
            <Button onClick={goToNext}>
              {index === sessionCards.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      )}

      {!FIELDS.some((field) => currentCard[field.key]) ? null : null}
    </Panel>
  )
}
