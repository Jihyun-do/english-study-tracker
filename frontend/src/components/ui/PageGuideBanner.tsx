import type { ReactNode } from 'react'
import styles from './PageGuideBanner.module.css'

interface PageGuideBannerProps {
  title: ReactNode
  description?: string
  meta?: ReactNode
}

export function PageGuideBanner({ title, description, meta }: PageGuideBannerProps) {
  return (
    <section className={styles.banner}>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {meta && <p className={styles.meta}>{meta}</p>}
    </section>
  )
}
