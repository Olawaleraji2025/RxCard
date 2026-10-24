
import { useState } from 'react'
import Button from './components/Button.jsx'
import CardsPage from './components/CardsPage.jsx'
import Home from './components/Home.jsx'
import Nav from './components/Nav.jsx'
import Panel from './components/Panel.jsx'
import Study from './components/Study.jsx'
import StudySession from './components/StudySession.jsx'
import { useCards } from './hooks/useCards.js'

function App() {
  const {
    cards,
    loading,
    error,
    saving,
    deletingId,
    loadCards,
    saveCard,
    removeCard,
    gradeCard,
  } = useCards()

  const [tab, setTab] = useState('home')
  const [studySelection, setStudySelection] = useState('due')
  const [studyStarted, setStudyStarted] = useState(false)

  const handleTabChange = (nextTab) => {
    setTab(nextTab)

    if (nextTab !== 'flashcards' && nextTab !== 'quiz') {
      setStudyStarted(false)
    }
  }

  const startStudy = (kind, selection = 'due') => {
    setStudySelection(selection)
    setStudyStarted(true)
    setTab(kind)
  }

  const handleSave = async (card) => {
    const saved = await saveCard(card)
    if (!saved) {
      window.alert('The medication could not be saved. Please try again.')
    }
    return saved
  }

  const handleDelete = async (id) => {
    const deleted = await removeCard(id)
    if (!deleted) {
      window.alert('The medication could not be deleted. Please try again.')
    }
    return deleted
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-160 flex-col gap-4 px-4 pb-8 pt-5">
        <Nav currentTab={tab} onChange={handleTabChange} />
        <Panel className="p-6 text-center text-muted">Loading medications…</Panel>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-160 flex-col gap-4 px-4 pb-8 pt-5">
        <Nav currentTab={tab} onChange={handleTabChange} />
        <Panel className="space-y-4 p-6 text-center">
          <h2 className="font-serif text-2xl text-ink">Could not load MedCards</h2>
          <p className="text-sm text-muted">{error}</p>
          <Button onClick={loadCards}>Try again</Button>
        </Panel>
      </div>
    )
  }

  const renderContent = () => {
    if (tab === 'home') {
      return (
        <Home
          cards={cards}
          onStartStudy={startStudy}
          onOpenForm={() => setTab('cards')}
        />
      )
    }

    if (tab === 'cards') {
      return (
        <CardsPage
          cards={cards}
          saving={saving}
          onSave={handleSave}
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      )
    }

    if (tab === 'flashcards' || tab === 'quiz') {
      if (!studyStarted) {
        return (
          <Study
            cards={cards}
            selection={studySelection}
            onSelectionChange={setStudySelection}
            onStart={(selection) => {
              setStudySelection(selection)
              setStudyStarted(true)
            }}
          />
        )
      }

      return (
        <StudySession
          cards={cards}
          selection={studySelection}
          kind={tab}
          gradeCard={gradeCard}
          onHome={() => {
            setStudyStarted(false)
            setTab('home')
          }}
        />
      )
    }

    return null
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-160 flex-col gap-4 px-4 pb-8 pt-5" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1.25rem)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
      <Nav currentTab={tab} onChange={handleTabChange} />
      {renderContent()}
    </div>
  )
}

export default App
