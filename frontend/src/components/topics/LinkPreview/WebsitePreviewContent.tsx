import { ExternalLink } from 'lucide-react'
import type { WebsiteLinkPreviewData } from '../../../lib/linkPreview'
import styles from './LinkPreview.module.css'

interface WebsitePreviewContentProps {
  data: WebsiteLinkPreviewData
}

/**
 * 일반 웹 링크 프리뷰 UI.
 * resolveWebsiteLinkPreview 연동 후 사용.
 */
export function WebsitePreviewContent({ data }: WebsitePreviewContentProps) {
  return (
    <>
      <div className={`${styles.thumbnail} ${styles.thumbWebsite}`} aria-hidden="true">
        {data.thumbnailUrl ? (
          <img
            src={data.thumbnailUrl}
            alt=""
            className={styles.thumbnailImg}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <ExternalLink size={28} className={styles.websiteIcon} />
        )}
      </div>

      <div className={styles.body}>
        <span className={`${styles.badge} ${styles.badgeWebsite}`}>웹사이트</span>
        <p className={styles.title}>{data.title}</p>
        {data.subtitle && <p className={styles.subtitle}>{data.subtitle}</p>}
      </div>
    </>
  )
}
