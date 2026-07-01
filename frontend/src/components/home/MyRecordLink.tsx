import { ChevronRight } from 'lucide-react'
import styles from './MyRecordLink.module.css'

interface MyRecordLinkProps {
  onClick: () => void
}

export function MyRecordLink({ onClick }: MyRecordLinkProps) {
  return (
    <button type="button" className={styles.link} onClick={onClick}>
      <span>내 학습 기록 보기</span>
      <ChevronRight size={18} />
    </button>
  )
}
