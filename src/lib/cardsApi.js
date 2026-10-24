import { FIELD_KEYS, FIELDS } from './fields.js'
import { supabase } from '../../supabase.js'

const CARD_COLUMNS = ['id', 'name', ...FIELD_KEYS, 'box', 'due', 'miss']

const sanitizeCard = (card = {}) => {
  const payload = {
    name: String(card.name ?? '').trim(),
    used: String(card.used ?? '').trim(),
    dosage: String(card.dosage ?? '').trim(),
    can: String(card.can ?? '').trim(),
    cannot: String(card.cannot ?? '').trim(),
    chemical_composition: String(card.chemical_composition ?? '').trim(),
    identification: String(card.identification ?? '').trim(),
    notes: String(card.notes ?? '').trim(),
  }

  for (const field of FIELDS) {
    payload[field.key] = String(card[field.key] ?? '').trim()
  }

  for (const key of ['box', 'due', 'miss']) {
    payload[key] = Number(card[key] ?? 0)
  }

  return Object.fromEntries(
    CARD_COLUMNS.map((key) => [key, payload[key] ?? ''])
      .filter(([key, value]) => key === 'id' ? value !== '' : true)
  )
}

export const createCard = async (card) => {
  const payload = sanitizeCard(card)

  if (!payload.name) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('createCard error', error)
      return null
    }

    return data
  } catch (error) {
    console.error('createCard exception', error)
    return null
  }
}

export const createCards = async (cards) => {
  const payload = cards
    .map((card) => sanitizeCard(card))
    .filter((card) => card.name)

  if (!payload.length) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .insert(payload)
      .select()

    if (error) {
      console.error('createCards error', error)
      return []
    }

    return data ?? []
  } catch (error) {
    console.error('createCards exception', error)
    return []
  }
}

export const readCards = async () => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('readCards error', error)
      return null
    }

    return data ?? []
  } catch (error) {
    console.error('readCards exception', error)
    return null
  }
}

export const updateCard = async (id, updates) => {
  const safeUpdates = {}

  for (const key of CARD_COLUMNS) {
    if (key === 'id') {
      continue
    }

    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      const value = updates[key]
      if (key === 'box' || key === 'due' || key === 'miss') {
        safeUpdates[key] = Number(value ?? 0)
      } else {
        safeUpdates[key] = String(value ?? '').trim()
      }
    }
  }

  if (!id) {
    return null
  }

  try {
    const { data, error } = await supabase
      .from('cards')
      .update(safeUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('updateCard error', error)
      return null
    }

    return data
  } catch (error) {
    console.error('updateCard exception', error)
    return null
  }
}

export const deleteCard = async (id) => {
  if (!id) {
    return false
  }

  try {
    const { error } = await supabase
      .from('cards')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('deleteCard error', error)
      return false
    }

    return true
  } catch (error) {
    console.error('deleteCard exception', error)
    return false
  }
}
