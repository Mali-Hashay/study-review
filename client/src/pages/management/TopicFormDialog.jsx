import { useState } from 'react'
import { api } from '../../api/api.js'
import { Modal } from '../../components/Modal.jsx'
import forms from '../../components/forms.module.css'

// `topic` = the topic being edited, or null when adding a new one to `categoryId`
export function TopicFormDialog({ open, topic, categoryId, defaultOrder, onClose, onSaved }) {
  return (
    <Modal open={open} title={topic ? 'עריכת נושא' : 'נושא חדש'} onClose={onClose}>
      <TopicForm
        topic={topic}
        categoryId={categoryId}
        defaultOrder={defaultOrder}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Modal>
  )
}

function TopicForm({ topic, categoryId, defaultOrder, onClose, onSaved }) {
  const [name, setName] = useState(topic?.name ?? '')
  const [orderIndex, setOrderIndex] = useState(topic?.order_index ?? defaultOrder)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (topic) {
        await api(`/topics/${topic.id}`, { method: 'PUT', body: { name, orderIndex } })
      } else {
        await api(`/categories/${categoryId}/topics`, { method: 'POST', body: { name, orderIndex } })
      }
      onSaved()
    } catch (err) {
      setError(err)
      setSaving(false)
    }
  }

  return (
    <form className={forms.body} onSubmit={handleSubmit}>
      <label className={forms.field}>
        שם הנושא
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>

      <label className={forms.field}>
        סדר בקטגוריה
        <span className={forms.hint}>מספר קטן יותר מופיע קודם</span>
        <input
          type="number"
          min="0"
          value={orderIndex}
          onChange={(event) => setOrderIndex(Number(event.target.value))}
        />
      </label>

      {error && (
        <div className={forms.error} role="alert">
          {error.message}
          {error.details && (
            <ul>
              {error.details.map((detail) => (
                <li key={detail.field}>{detail.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className={forms.actions}>
        <button type="button" className={forms.secondary} onClick={onClose}>
          ביטול
        </button>
        <button type="submit" className={forms.primary} disabled={saving}>
          {saving ? 'שומר...' : 'שמירה'}
        </button>
      </div>
    </form>
  )
}
