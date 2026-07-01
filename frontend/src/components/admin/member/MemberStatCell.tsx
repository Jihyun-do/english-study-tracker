import styles from './MemberStatCell.module.css'

interface MemberStatCellProps {
  value: number
  unit?: string
}

export function MemberStatCell({ value, unit }: MemberStatCellProps) {
  return (
    <span className={styles.stat}>
      <span className={styles.value}>{value}</span>
      {unit && <span className={styles.unit}>{unit}</span>}
    </span>
  )
}
