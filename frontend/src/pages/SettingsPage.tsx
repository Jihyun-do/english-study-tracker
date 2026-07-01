import type { ReactNode } from 'react'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Card } from '../components/ui/Card'
import { mockAdminStudySettings } from '../data/mockAdminData'
import styles from './SettingsPage.module.css'

interface SettingsRowProps {
  label: string
  value?: string
  hint?: string
  onClick?: () => void
  showChevron?: boolean
}

function SettingsRow({ label, value, hint, onClick, showChevron }: SettingsRowProps) {
  const content = (
    <>
      <div className={styles.rowBody}>
        <span className={styles.rowLabel}>{label}</span>
        {value && <span className={styles.rowValue}>{value}</span>}
        {hint && <span className={styles.rowHint}>{hint}</span>}
      </div>
      {showChevron && <ChevronRight size={18} className={styles.rowChevron} />}
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={styles.rowBtn} onClick={onClick}>
        {content}
      </button>
    )
  }

  return <div className={styles.row}>{content}</div>
}

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <Card padding="sm">{children}</Card>
    </section>
  )
}

export function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const nickname = user?.name ?? '명수'

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ArrowLeft size={18} />
        </button>
        <h2 className={styles.headerTitle}>설정</h2>
      </header>

      {isAdmin && (
        <button
          type="button"
          className={styles.adminLink}
          onClick={() => navigate('/admin/dashboard')}
        >
          <span>⚙ 관리자 화면으로 이동</span>
          <ChevronRight size={18} />
        </button>
      )}

      <SettingsSection title="프로필">
        <SettingsRow label="닉네임" value={nickname} hint="향후 수정 예정" />
      </SettingsSection>

      <SettingsSection title="알림 설정">
        <SettingsRow label="알림 설정" hint="향후 기능 추가 예정" />
      </SettingsSection>

      <SettingsSection title="스터디 정보">
        <SettingsRow label="현재 참여 중인 스터디명" value={mockAdminStudySettings.name} />
      </SettingsSection>

      <SettingsSection title="앱 버전">
        <SettingsRow label="버전" value="v1.0.0" />
      </SettingsSection>

      <SettingsSection title="문의하기">
        <SettingsRow label="문의하기" hint="Placeholder" showChevron onClick={() => {}} />
      </SettingsSection>

      <div className={styles.logoutArea}>
        <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
          🚪 로그아웃
        </button>
      </div>
    </div>
  )
}
