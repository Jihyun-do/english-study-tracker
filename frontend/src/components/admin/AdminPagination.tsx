import { ChevronLeft, ChevronRight } from 'lucide-react'
import styles from './AdminPagination.module.css'

interface AdminPaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className={styles.pagination} aria-label="페이지 네비게이션">
      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
      >
        <ChevronLeft size={16} />
      </button>

      <div className={styles.pages}>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            className={`${styles.pageBtn} ${pageNumber === page ? styles.pageActive : ''}`}
            onClick={() => onPageChange(pageNumber)}
            aria-current={pageNumber === page ? 'page' : undefined}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.navBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
