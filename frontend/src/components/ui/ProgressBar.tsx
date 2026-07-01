import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max?: number
}

export function ProgressBar({ value, max = 100 }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={styles.track} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max}>
      <div className={styles.fill} style={{ width: `${percentage}%` }} />
    </div>
  )
}
