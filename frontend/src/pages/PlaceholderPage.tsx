import styles from './PlaceholderPage.module.css'

interface PlaceholderPageProps {
  title: string
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className={styles.page}>
      <p className={styles.emoji}>🚧</p>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>곧 제공 예정입니다</p>
    </div>
  )
}
