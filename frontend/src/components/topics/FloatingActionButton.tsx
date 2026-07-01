import { Plus } from 'lucide-react'
import styles from './FloatingActionButton.module.css'

interface FloatingActionButtonProps {
  label: string
  onClick: () => void
}

export function FloatingActionButton({ label, onClick }: FloatingActionButtonProps) {
  return (
    <button type="button" className={styles.fab} onClick={onClick}>
      <Plus size={20} strokeWidth={2.5} />
      <span>{label}</span>
    </button>
  )
}
