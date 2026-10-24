import { useCallback, useEffect, useState } from 'react'
import { createCard, createCards, deleteCard, readCards, updateCard } from '../lib/cardsApi.js'
import { today } from '../lib/utils.js'

const sortCards = (items) => [...items].sort((a, b) => a.name.localeCompare(b.name))

export function useCards() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const loadCards = useCallback(async () => {
    setLoading(true)
    setError('')

    const data = await readCards()

    if (!data) {
      setCards([])
      setError('Could not reach Supabase. Please check your connection and try again.')
      setLoading(false)
      return false
    }

    setCards(sortCards(data))
    setLoading(false)
    return true
  }, [])

  useEffect(() => {
    loadCards()
  }, [loadCards])

  const saveCard = useCallback(async (card) => {
    setSaving(true)
    setError('')

    const name = String(card.name ?? '').trim()
    if (!name) {
      setError('A medication name is required.')
      setSaving(false)
      return false
    }

    const safePayload = { ...card, name }

    let savedCard = null

    if (card.id) {
      savedCard = await updateCard(card.id, safePayload)
      if (!savedCard) {
        setError('Failed to save changes. Please try again.')
        setSaving(false)
        return false
      }

      setCards((current) => sortCards(current.map((item) => (item.id === savedCard.id ? { ...item, ...savedCard } : item))))
    } else {
      savedCard = await createCard(safePayload)
      if (!savedCard) {
        setError('Failed to add this medication. Please try again.')
        setSaving(false)
        return false
      }

      setCards((current) => sortCards([...current, savedCard]))
    }

    setSaving(false)
    return true
  }, [])

  const removeCard = useCallback(async (id) => {
    if (!id) {
      return false
    }

    setDeletingId(id)
    setError('')

    const deleted = await deleteCard(id)

    if (!deleted) {
      setError('Delete failed. Please try again.')
      setDeletingId(null)
      return false
    }

    setCards((current) => current.filter((card) => card.id !== id))
    setDeletingId(null)
    return true
  }, [])

  const importCards = useCallback(async (items) => {
    if (!Array.isArray(items) || !items.length) {
      return 0
    }

    const existingNames = new Set(cards.map((card) => String(card.name ?? '').trim().toLowerCase()))
    const uniqueCards = items.filter((item) => {
      const name = String(item?.name ?? '').trim()
      return name && !existingNames.has(name.toLowerCase())
    })

    if (!uniqueCards.length) {
      return 0
    }

    const inserted = await createCards(uniqueCards)
    if (!inserted || !inserted.length) {
      setError('Import did not save. Please check the JSON and try again.')
      return 0
    }

    setCards((current) => sortCards([...current, ...inserted]))
    return inserted.length
  }, [cards])

  const gradeCard = useCallback(async (id, result) => {
    const card = cards.find((item) => item.id === id)
    if (!card) {
      return false
    }

    const currentBox = Number(card.box ?? 0)
    const currentMiss = Number(card.miss ?? 0)

    const nextBox = result === 'got'
      ? Math.min(5, currentBox + 1)
      : Math.max(0, currentBox - 2)

    const nextMiss = result === 'miss' ? currentMiss + 1 : currentMiss
    const intervalMap = [0, 1, 3, 7, 14, 30]
    const interval = intervalMap[nextBox] ?? 0
    const nextDue = today() + interval

    const updatedCard = {
      ...card,
      box: nextBox,
      miss: nextMiss,
      due: nextDue,
    }

    setCards((current) => sortCards(current.map((item) => (item.id === id ? updatedCard : item))))

    const savedCard = await updateCard(id, {
      box: nextBox,
      miss: nextMiss,
      due: nextDue,
    })

    if (!savedCard) {
      setError('A save failed during the session. Please review the card and try again.')
      return false
    }

    setCards((current) => sortCards(current.map((item) => (item.id === id ? { ...item, ...savedCard } : item))))
    return true
  }, [cards])

  return {
    cards,
    loading,
    error,
    saving,
    deletingId,
    loadCards,
    saveCard,
    removeCard,
    importCards,
    gradeCard,
  }
}
