import type { ReactNode } from 'react'
import styles from './OnboardingLayout.module.css'

interface OnboardingLayoutProps {
  step: number
  totalSteps?: number
  title: string
  description?: string
  children: ReactNode
}

export function OnboardingLayout({
  step,
  totalSteps = 3,
  title,
  description,
  children,
}: OnboardingLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <span className={styles.logo}>J</span>
          <p className={styles.brand}>Jude&apos;s English</p>
        </header>

        <div className={styles.progress} aria-label={`${step}단계 / ${totalSteps}단계`}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <span
              key={index}
              className={`${styles.progressDot} ${index < step ? styles.progressDotActive : ''}`}
            />
          ))}
        </div>

        <div className={styles.content}>
          <h1 className={styles.title}>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          {children}
        </div>
      </div>
    </div>
  )
}
