import { Home, MessageSquare, Lightbulb, FolderOpen, User } from 'lucide-react'
import styles from './BottomNav.module.css'

export type TabId = 'home' | 'feed' | 'topics' | 'library' | 'mypage'

interface NavItem {
  id: TabId
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: '홈', icon: Home },
  { id: 'feed', label: '인증 피드', icon: MessageSquare },
  { id: 'topics', label: '주제 제안', icon: Lightbulb },
  { id: 'library', label: '자료실', icon: FolderOpen },
  { id: 'mypage', label: '마이페이지', icon: User },
]

interface BottomNavProps {
  activeTab?: TabId
  onTabChange?: (tab: TabId) => void
}

export function BottomNav({ activeTab = 'home', onTabChange }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label="하단 탭 네비게이션">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
        const isActive = id === activeTab
        return (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${isActive ? styles.active : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange?.(id)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={styles.label}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
