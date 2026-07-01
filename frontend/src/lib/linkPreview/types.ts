export type LinkPreviewType = 'youtube' | 'website'

export interface LinkPreviewDataBase {
  url: string
  type: LinkPreviewType
  title: string
  /** YouTube: 채널명 / Website: 사이트명 또는 도메인 */
  subtitle?: string
  thumbnailUrl?: string
}

export interface YouTubeLinkPreviewData extends LinkPreviewDataBase {
  type: 'youtube'
  videoId: string
}

export interface WebsiteLinkPreviewData extends LinkPreviewDataBase {
  type: 'website'
  siteName?: string
}

export type LinkPreviewData = YouTubeLinkPreviewData | WebsiteLinkPreviewData

/**
 * 향후 Supabase/API 연동 시 구현.
 * Open Graph 메타(title, image, site_name) fetch.
 */
export type FetchLinkPreview = (url: string) => Promise<LinkPreviewData | null>
