import { useMemo, useState } from 'react'
import Button from './Button.jsx'
import CardForm from './CardForm.jsx'
import ImportExport from './ImportExport.jsx'
import Panel from './Panel.jsx'
import { filledFields, isWeak } from '../lib/utils.js'

export default function CardsPage({ cards, saving, onSave, onDelete, onImport, deletingId }) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)

  const sortedCards = useMemo(() => [...cards].sort((a, b) => a.name.localeCompare(b.name)), [cards])

  const openCreateForm = () => {
    setEditingCard(null)
    setIsFormOpen(true)
  }

  const openEditForm = (card) => {
    setEditingCard(card)
    setIsFormOpen(true)
  }

  const handleSave = async (card) => {
    const ok = await onSave(card)
    if (ok) {
      setIsFormOpen(false)
      setEditingCard(null)
    }
  }

  const handleDelete = async (card) => {
    const confirmed = window.confirm(`Delete ${card.name}?`)
    if (!confirmed) {
      return
    }

    await onDelete(card.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-ink">Medication cards</h2>
        <Button onClick={openCreateForm}>Add medication</Button>
      </div>

      {isFormOpen ? (
        <CardForm
          card={editingCard}
          saving={saving}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingCard(null)
          }}
          onSave={handleSave}
        />
      ) : null}

      <ImportExport cards={cards} onImport={onImport} />

      {sortedCards.length === 0 ? (
        <Panel className="p-6 text-center text-muted">
          No cards have been added yet.
        </Panel>
      ) : (
        <div className="space-y-3">
          {sortedCards.map((card) => {
            const filled = filledFields(card).length
            const weak = isWeak(card)

            return (
              <Panel key={card.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl text-ink">{card.name}</h3>
                    <p className="mt-1 text-sm text-muted">{filled} of 7 fields filled</p>
                  </div>
                  {weak ? (
                    <span className="rounded-full bg-warn/10 px-2 py-1 text-xs font-medium text-warn">needs work</span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="ghost" onClick={() => openEditForm(card)} disabled={saving}>
                    Edit
                  </Button>
                  <Button variant="bad" onClick={() => handleDelete(card)} disabled={saving || deletingId === card.id}>
                    {deletingId === card.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </Panel>
            )
          })}
        </div>
      )}
    </div>
  )
}
