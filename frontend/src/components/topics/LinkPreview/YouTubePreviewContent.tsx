import { Play } from 'lucide-react'
import type { YouTubeLinkPreviewData } from '../../../lib/linkPreview'
import styles from './LinkPreview.module.css'

const THUMB_CLASS = {
  example1: styles.thumbExample1,
  example2: styles.thumbExample2,
  example3: styles.thumbExample3,
} as const

interface YouTubePreviewContentProps {
  data: YouTubeLinkPreviewData
}

export function YouTubePreviewContent({ data }: YouTubePreviewContentProps) {
  const thumbClass =
    THUMB_CLASS[data.videoId as keyof typeof THUMB_CLASS] ?? styles.thumbDefault

  return (
    <>
      <div className={`${styles.thumbnail} ${thumbClass}`} aria-hidden="true">
        {data.thumbnailUrl ? (
          <img
            src={data.thumbnailUrl}
            alt=""
            className={styles.thumbnailImg}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : null}
        <div className={styles.playOverlay}>
          <span className={styles.playBtn}>
            <Play size={18} fill="currentColor" />
          </span>
        </div>
      </div>

      <div className={styles.body}>
        <span className={`${styles.badge} ${styles.badgeYoutube}`}>YouTube</span>
        <p className={styles.title}>{data.title}</p>
        {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
      </div>
    </>
  )
}
