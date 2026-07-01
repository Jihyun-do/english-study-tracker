import { Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './MyPageProfileHeader.module.css'

interface MyPageProfileHeaderProps {
  userName: string
  studyName: string
}

export function MyPageProfileHeader({
  userName,
  studyName,
}: MyPageProfileHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <p className={styles.greeting}>{userName} 👋</p>
        <p className={styles.studyName}>{studyName}</p>
      </div>
      <Link to="/settings" className={styles.settingsBtn} aria-label="설정">
        <Settings size={22} strokeWidth={2} />
      </Link>
    </header>
  )
}
