import type { ReactNode } from 'react'
import { Header } from './Header'
import { BottomNav, type TabId } from './BottomNav'
import styles from './AppLayout.module.css'

export type { TabId }

interface AppLayoutProps {
  children: ReactNode
  userName: string
  activeTab?: TabId
  onTabChange?: (tab: TabId) => void
}

export function AppLayout({ children, userName, activeTab, onTabChange }: AppLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header userName={userName} />
      <main className={styles.main}>{children}</main>
      <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}
