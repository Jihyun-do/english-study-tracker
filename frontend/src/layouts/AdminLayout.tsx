import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MessageSquare,
  Lightbulb,
  UserCog,
  Settings,
  LogOut,
  ExternalLink,
  Megaphone,
} from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ADMIN_ROUTES } from '../router/paths'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
  { to: ADMIN_ROUTES.dashboard, label: '대시보드', icon: LayoutDashboard },
  { to: ADMIN_ROUTES.content, label: '콘텐츠 관리', icon: Megaphone },
  { to: ADMIN_ROUTES.assignments, label: '과제 관리', icon: ClipboardList },
  { to: ADMIN_ROUTES.submission, label: '제출 현황', icon: Users },
  { to: ADMIN_ROUTES.feed, label: '인증 피드', icon: MessageSquare },
  { to: ADMIN_ROUTES.topics, label: '주제 관리', icon: Lightbulb },
  { to: ADMIN_ROUTES.members, label: '스터디원 관리', icon: UserCog },
  { to: ADMIN_ROUTES.settings, label: '설정', icon: Settings },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandLogo}>J</span>
          <div>
            <p className={styles.brandTitle}>Jude&apos;s Admin</p>
            <p className={styles.brandSub}>{user?.name} · 스터디장</p>
          </div>
        </div>

        <nav className={styles.nav} aria-label="관리자 메뉴">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.footerBtn}
            onClick={() => navigate('/')}
          >
            <ExternalLink size={16} />
            사용자 화면
          </button>
          <button type="button" className={styles.footerBtn} onClick={handleLogout}>
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
