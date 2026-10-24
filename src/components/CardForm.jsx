import { useEffect, useState } from 'react'
import { FIELDS } from '../lib/fields.js'
import Button from './Button.jsx'
import Panel from './Panel.jsx'

const emptyForm = () => ({
  name: '',
  used: '',
  dosage: '',
  can: '',
  cannot: '',
  chemical_composition: '',
  identification: '',
  notes: '',
})

export default function CardForm({ card, saving, onCancel, onSave }) {
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    setForm({
      ...emptyForm(),
      ...(card ?? {}),
    })
  }, [card])

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSave(form)
  }

  return (
    <Panel className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="medication-name" className="mb-1 block text-sm font-medium text-ink">
            Medication name
          </label>
          <input
            id="medication-name"
            name="name"
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            required
            className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            placeholder="Abidec drops"
          />
        </div>

        <div className="grid gap-4">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label htmlFor={field.key} className="mb-1 block text-sm font-medium text-ink">
                {field.label}
              </label>
              <textarea
                id={field.key}
                rows={3}
                value={form[field.key] ?? ''}
                onChange={(event) => handleChange(field.key, event.target.value)}
                className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder={field.label}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save medication'}
          </Button>
        </div>
      </form>
    </Panel>
  )
}
