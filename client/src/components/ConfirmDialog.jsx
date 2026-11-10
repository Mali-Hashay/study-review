import { useState } from 'react'
import { Modal } from './Modal.jsx'
import forms from './forms.module.css'

// A yes/no dialog. `onConfirm` may be async; errors it throws are shown inside the dialog.
export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }) {
  return (
    <Modal open={open} title={title} onClose={onClose}>
      <ConfirmBody message={message} confirmLabel={confirmLabel} onConfirm={onConfirm} onClose={onClose} />
    </Modal>
  )
}

function ConfirmBody({ message, confirmLabel, onConfirm, onClose }) {
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleConfirm() {
    setError(null)
    setBusy(true)
    try {
      await onConfirm()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className={forms.body}>
      <p style={{ margin: 0 }}>{message}</p>
      {error && (
        <p className={forms.error} role="alert">
          {error}
        </p>
      )}
      <div className={forms.actions}>
        <button type="button" className={forms.secondary} onClick={onClose}>
          ביטול
        </button>
        <button type="button" className={forms.danger} onClick={handleConfirm} disabled={busy}>
          {confirmLabel}
        </button>
      </div>
    </div>
  )
}
