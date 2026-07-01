import { CheckCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { useAppNavigation } from '../../context/AppNavigationContext'
import styles from './SubmitSuccessPage.module.css'

export function SubmitSuccessPage() {
  const { navigateToHome, navigateToFeed } = useAppNavigation()

  return (
    <div className={styles.page}>
      <Card className={styles.card} padding="lg">
        <div className={styles.iconWrap}>
          <CheckCircle size={48} className={styles.icon} />
        </div>
        <h2 className={styles.title}>✅ 과제 제출 완료</h2>
        <p className={styles.message}>오늘 과제를 성공적으로 제출했습니다.</p>
      </Card>

      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} onClick={navigateToHome}>
          홈으로 이동
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={navigateToFeed}>
          인증 피드 보기
        </button>
      </div>
    </div>
  )
}
