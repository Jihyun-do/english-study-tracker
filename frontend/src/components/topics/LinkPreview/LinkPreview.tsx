import type { LinkPreviewData } from '../../../lib/linkPreview'
import { resolveLinkPreview } from '../../../lib/linkPreview'
import { YouTubePreviewContent } from './YouTubePreviewContent'
import { WebsitePreviewContent } from './WebsitePreviewContent'
import styles from './LinkPreview.module.css'

interface LinkPreviewProps {
  url: string
  /** API 연동 후 서버에서 받은 메타데이터. 없으면 url 기반 resolve */
  preview?: LinkPreviewData
  /** true이면 클릭 시 새 탭에서 링크를 엽니다 */
  openInNewTab?: boolean
}

function LinkPreviewContent({ data }: { data: LinkPreviewData }) {
  switch (data.type) {
    case 'youtube':
      return <YouTubePreviewContent data={data} />
    case 'website':
      return <WebsitePreviewContent data={data} />
    default:
      return null
  }
}

export function LinkPreview({ url, preview, openInNewTab = false }: LinkPreviewProps) {
  const data = preview ?? resolveLinkPreview(url)
  if (!data) return null

  const ariaLabel =
    data.type === 'youtube' ? `YouTube: ${data.title}` : `링크: ${data.title}`

  return (
    <a
      href={url}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
      onClick={openInNewTab ? undefined : (event) => event.preventDefault()}
      aria-label={ariaLabel}
    >
      <LinkPreviewContent data={data} />
    </a>
  )
}
