import { useState } from 'react'
import { api } from '../../api/api.js'
import { Modal } from '../../components/Modal.jsx'
import forms from '../../components/forms.module.css'
import { DAY_NAMES } from '../../utils/days.js'

// `category` = the category being edited, or null when adding a new one.
// `defaults` = initial day and order for a new category.
export function CategoryFormDialog({ open, category, defaults, onClose, onSaved }) {
  return (
    <Modal open={open} title={category ? 'עריכת קטגוריה' : 'קטגוריה חדשה'} onClose={onClose}>
      <CategoryForm category={category} defaults={defaults} onClose={onClose} onSaved={onSaved} />
    </Modal>
  )
}

function CategoryForm({ category, defaults, onClose, onSaved }) {
  const [name, setName] = useState(category?.name ?? '')
  const [description, setDescription] = useState(category?.description ?? '')
  const [dayOfWeek, setDayOfWeek] = useState(category?.day_of_week ?? defaults.dayOfWeek)
  const [orderIndex, setOrderIndex] = useState(category?.order_index ?? defaults.orderIndex)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (category) {
        // PUT is a full update: every field is sent, and an empty description clears it
        await api(`/categories/${category.id}`, {
          method: 'PUT',
          body: { name, description: description.trim() || null, dayOfWeek, orderIndex },
        })
      } else {
        await api('/categories', {
          method: 'POST',
          body: { name, description: description.trim() || undefined, dayOfWeek, orderIndex },
        })
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
        שם
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>

      <label className={forms.field}>
        תיאור <span className={forms.hint}>(לא חובה)</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>

      <label className={forms.field}>
        יום
        <select value={dayOfWeek} onChange={(event) => setDayOfWeek(Number(event.target.value))}>
          {[1, 2, 3, 4, 5].map((day) => (
            <option key={day} value={day}>
              {DAY_NAMES[day]}
            </option>
          ))}
        </select>
      </label>

      <label className={forms.field}>
        סדר ביום
        <span className={forms.hint}>מספר קטן יותר מופיע קודם, כשיש כמה קטגוריות באותו יום</span>
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
