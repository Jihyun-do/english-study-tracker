import { Heart } from 'lucide-react'
import { SubmissionImage } from '../feed/SubmissionImage'
import { Card } from '../ui/Card'
import type { RecentCertification } from '../../data/mockHomeSections'
import { truncateMemo } from '../../data/mockHomeSections'
import styles from './RecentCertCard.module.css'

interface RecentCertCardProps {
  cert: RecentCertification
  onClick: () => void
}

export function RecentCertCard({ cert, onClick }: RecentCertCardProps) {
  return (
    <button type="button" className={styles.cardBtn} onClick={onClick}>
      <Card className={styles.card} padding="sm">
        <div className={styles.thumb}>
          <SubmissionImage
            theme={cert.imageTheme}
            userName={cert.userName}
            variant="compact"
          />
        </div>

        <div className={styles.body}>
          <div className={styles.header}>
            <div
              className={styles.avatar}
              style={{ backgroundColor: cert.avatarColor }}
            >
              {cert.userName.charAt(0)}
            </div>
            <span className={styles.userName}>{cert.userName}</span>
          </div>
          <p className={styles.memo}>&ldquo;{truncateMemo(cert.memo, 28)}&rdquo;</p>
          <div className={styles.footer}>
            <span className={styles.likes}>
              <Heart size={13} fill="currentColor" />
              {cert.likeCount}
            </span>
            <span className={styles.time}>{cert.submittedAt}</span>
          </div>
        </div>
      </Card>
    </button>
  )
}
