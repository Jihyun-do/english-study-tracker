import { Card } from '../../components/ui/Card'
import styles from './MemoField.module.css'

interface MemoFieldProps {
  value: string
  onChange: (value: string) => void
}

export function MemoField({ value, onChange }: MemoFieldProps) {
  return (
    <section className={styles.section}>
      <h4 className={styles.label}>오늘의 메모</h4>
      <Card padding="md">
        <textarea
          className={styles.textarea}
          placeholder="오늘은 travel expressions 위주로 정리했습니다."
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Card>
    </section>
  )
}
