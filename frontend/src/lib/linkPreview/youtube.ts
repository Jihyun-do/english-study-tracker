import type { YouTubeLinkPreviewData } from './types'

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com']

const MOCK_PREVIEW_BY_VIDEO_ID: Record<
  string,
  Pick<YouTubeLinkPreviewData, 'title' | 'subtitle'>
> = {
  example1: {
    title: '공항에서 꼭 필요한 영어 표현 20선 | Travel English',
    subtitle: 'English with Lucy',
  },
  example2: {
    title: 'Netflix로 영어 듣기 & Shadowing 하는 방법',
    subtitle: 'Study English Daily',
  },
  example3: {
    title: 'Small Talk Masterclass — Start Any Conversation',
    subtitle: 'BBC Learning English',
  },
}

const DEFAULT_PREVIEW: Pick<YouTubeLinkPreviewData, 'title' | 'subtitle'> = {
  title: 'YouTube 영상',
  subtitle: 'YouTube',
}

export function isYouTubeUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url)
    return YOUTUBE_HOSTS.includes(hostname)
  } catch {
    return false
  }
}

export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)

    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1) || null
    }

    if (parsed.searchParams.has('v')) {
      return parsed.searchParams.get('v')
    }

    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/)
    if (embedMatch) return embedMatch[1]

    return null
  } catch {
    return null
  }
}

export function resolveYouTubeLinkPreview(url: string): YouTubeLinkPreviewData | null {
  if (!isYouTubeUrl(url)) return null

  const videoId = extractYouTubeVideoId(url)
  if (!videoId) return null

  const mock = MOCK_PREVIEW_BY_VIDEO_ID[videoId] ?? DEFAULT_PREVIEW

  return {
    type: 'youtube',
    url,
    videoId,
    title: mock.title,
    subtitle: mock.subtitle,
    thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  }
}
