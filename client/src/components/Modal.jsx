import { useEffect, useRef } from 'react'
import styles from './Modal.module.css'

// Built on the native <dialog>: focus trapping, Esc to close and the backdrop come for free
export function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <h2 className={styles.title}>{title}</h2>
      {open && children}
    </dialog>
  )
}
