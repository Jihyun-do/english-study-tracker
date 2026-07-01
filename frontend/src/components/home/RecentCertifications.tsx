import { useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { mockRecentCertifications } from '../../data/mockHomeSections'
import { useDragScroll } from '../../hooks/useDragScroll'
import { RecentCertCard } from './RecentCertCard'
import styles from './RecentCertifications.module.css'

interface RecentCertificationsProps {
  onCertClick: () => void
}

export function RecentCertifications({ onCertClick }: RecentCertificationsProps) {
  const { ref: scrollRef, draggedRef, isDragging } = useDragScroll<HTMLDivElement>()

  const handleCertClick = useCallback(() => {
    if (draggedRef.current) return
    onCertClick()
  }, [draggedRef, onCertClick])

  const scrollBySlide = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return

    const firstCard = el.firstElementChild as HTMLElement | null
    if (!firstCard) return

    const gap = 16
    const slideWidth = firstCard.offsetWidth + gap
    el.scrollBy({ left: direction * slideWidth, behavior: 'smooth' })
  }, [scrollRef])

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h3 className={styles.title}>최근 인증</h3>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            aria-label="이전 인증"
            onClick={() => scrollBySlide(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            aria-label="다음 인증"
            onClick={() => scrollBySlide(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={styles.carouselViewport}>
        <div
          ref={scrollRef}
          className={`${styles.scrollWrap} ${isDragging ? styles.isDragging : ''}`}
        >
          {mockRecentCertifications.map((cert) => (
            <RecentCertCard key={cert.id} cert={cert} onClick={handleCertClick} />
          ))}
        </div>
      </div>

      <p className={styles.hint}>드래그하거나 버튼으로 넘겨보세요</p>
    </section>
  )
}
