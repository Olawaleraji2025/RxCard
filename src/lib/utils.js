import { FIELDS } from './fields.js'

export const DAYS = 24 * 60 * 60 * 1000

export const today = () => Math.floor(Date.now() / DAYS)

export const isDue = (card) => Number(card?.due ?? 0) <= today()

export const isWeak = (card) => Number(card?.miss ?? 0) > 0 && Number(card?.box ?? 0) < 3

export const filledFields = (card) =>
  FIELDS.filter((field) => String(card?.[field.key] ?? '').trim().length > 0)

export const shuffle = (items) => {
  const clone = [...items]

  for (let index = clone.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[clone[index], clone[swapIndex]] = [clone[swapIndex], clone[index]]
  }

  return clone
}
