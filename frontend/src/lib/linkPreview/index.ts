import { resolveWebsiteLinkPreview } from './website'
import type { LinkPreviewData } from './types'
import { resolveYouTubeLinkPreview } from './youtube'

export type { FetchLinkPreview, LinkPreviewData, LinkPreviewType, WebsiteLinkPreviewData, YouTubeLinkPreviewData } from './types'
export { extractYouTubeVideoId, isYouTubeUrl, resolveYouTubeLinkPreview } from './youtube'
export { resolveWebsiteLinkPreview } from './website'

/**
 * URL 타입에 따라 적절한 프리뷰 resolver를 호출.
 * YouTube → Website 순으로 시도. 향후 resolver 추가 가능.
 */
export function resolveLinkPreview(url: string): LinkPreviewData | null {
  return resolveYouTubeLinkPreview(url) ?? resolveWebsiteLinkPreview(url)
}
