import { useState } from 'react'
import { api } from '../../api/api.js'
import { Modal } from '../../components/Modal.jsx'
import forms from '../../components/forms.module.css'
import { TASK_DIFFICULTIES, TASK_TYPES } from '../../utils/taskLabels.js'

// `task` = the task being edited, or null when adding a new one to `topicId`
export function TaskFormDialog({ open, task, topicId, onClose, onSaved }) {
  return (
    <Modal open={open} title={task ? 'עריכת משימה' : 'משימה חדשה'} onClose={onClose}>
      <TaskForm task={task} topicId={topicId} onClose={onClose} onSaved={onSaved} />
    </Modal>
  )
}

function TaskForm({ task, topicId, onClose, onSaved }) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [type, setType] = useState(task?.type ?? 'review')
  const [difficulty, setDifficulty] = useState(task?.difficulty ?? 'medium')
  const [link, setLink] = useState(task?.link ?? '')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSaving(true)
    try {
      if (task) {
        // Full update: empty optional fields are sent as null so they get cleared
        await api(`/tasks/${task.id}`, {
          method: 'PUT',
          body: {
            title,
            description: description.trim() || null,
            type,
            difficulty,
            link: link.trim() || null,
          },
        })
      } else {
        await api(`/topics/${topicId}/tasks`, {
          method: 'POST',
          body: {
            title,
            description: description.trim() || undefined,
            type,
            difficulty,
            link: link.trim() || undefined,
          },
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
        כותרת
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>

      <label className={forms.field}>
        תיאור <span className={forms.hint}>(לא חובה)</span>
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>

      <div className={forms.row}>
        <label className={forms.field}>
          סוג
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {Object.entries(TASK_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={forms.field}>
          רמת קושי
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            {Object.entries(TASK_DIFFICULTIES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={forms.field}>
        קישור <span className={forms.hint}>(לא חובה, למשל לשאלה ב-LeetCode)</span>
        <input
          type="url"
          dir="ltr"
          placeholder="https://"
          value={link}
          onChange={(event) => setLink(event.target.value)}
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
