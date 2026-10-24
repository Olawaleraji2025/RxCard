import { useState } from 'react'
import Button from './Button.jsx'
import Panel from './Panel.jsx'

export default function ImportExport({ cards, onImport }) {
  const [jsonText, setJsonText] = useState('')
  const [feedback, setFeedback] = useState('')

  const handleExport = async () => {
    const payload = cards.map(({ id, created_at, updated_at, ...item }) => item)
    const json = JSON.stringify(payload, null, 2)
    setJsonText(json)

    try {
      await navigator.clipboard.writeText(json)
      setFeedback('JSON copied to your clipboard.')
    } catch (error) {
      setFeedback('Clipboard access was blocked, but the JSON is visible below.')
    }
  }

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(jsonText)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      const count = await onImport(items)

      if (count > 0) {
        setFeedback(`${count} new medication card${count > 1 ? 's were' : ' was'} imported.`)
      } else {
        setFeedback('No new cards were imported. Names may already exist.')
      }
    } catch (error) {
      setFeedback('That is not valid JSON. Paste a valid medication array and try again.')
    }
  }

  return (
    <Panel className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-xl text-ink">Import and export</h3>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={handleExport}>Export</Button>
        <Button variant="ghost" onClick={handleImport}>Import</Button>
      </div>

      <textarea
        value={jsonText}
        onChange={(event) => setJsonText(event.target.value)}
        rows={8}
        className="mt-4 w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        placeholder="Paste JSON here to import cards"
      />

      {feedback ? <p className="mt-3 text-sm text-muted">{feedback}</p> : null}
    </Panel>
  )
}
