import type { WebsiteLinkPreviewData } from './types'

/**
 * 일반 웹 링크 Open Graph 프리뷰 resolve.
 * 현재: 미구현 (null 반환). 향후 OG API 연동.
 *
 * @example
 * export async function fetchWebsiteLinkPreview(url: string): Promise<WebsiteLinkPreviewData | null> {
 *   const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`)
 *   const og = await res.json()
 *   return { type: 'website', url, title: og.title, thumbnailUrl: og.image, siteName: og.site_name }
 * }
 */
export function resolveWebsiteLinkPreview(url: string): WebsiteLinkPreviewData | null {
  try {
    new URL(url)
  } catch {
    return null
  }

  // TODO: Open Graph 연동 전까지 일반 URL 프리뷰는 표시하지 않음
  return null
}
