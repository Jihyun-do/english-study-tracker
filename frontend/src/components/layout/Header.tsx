import { Bell } from 'lucide-react'
import styles from './Header.module.css'

interface HeaderProps {
  userName: string
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className={styles.header}>
      <span className={styles.sideSpacer} aria-hidden="true" />
      <h1 className={styles.greeting}>
        {userName}님, 오늘도 화이팅! 💪
      </h1>
      <button type="button" className={styles.iconBtn} aria-label="알림">
        <Bell size={22} strokeWidth={2} />
      </button>
    </header>
  )
}
