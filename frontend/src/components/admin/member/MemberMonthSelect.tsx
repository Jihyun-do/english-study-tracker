import { ChevronDown } from 'lucide-react'
import { formatMemberMonthOption } from './memberUtils'
import styles from './MemberMonthSelect.module.css'

interface MemberMonthSelectProps {
  monthKeys: readonly string[]
  value: string
  onChange: (monthKey: string) => void
  label?: string
}

export function MemberMonthSelect({
  monthKeys,
  value,
  onChange,
  label = '통계 기준',
}: MemberMonthSelectProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>{label}</span>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label="통계 기준 월 선택"
        >
          {monthKeys.map((monthKey) => (
            <option key={monthKey} value={monthKey}>
              {formatMemberMonthOption(monthKey)}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  )
}
