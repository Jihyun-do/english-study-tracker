import styles from './Avatar.module.css'

interface AvatarProps {
  src?: string
  alt?: string
  fallbackEmoji?: string
  backgroundColor?: string
  size?: 'sm' | 'md'
  className?: string
}

export function Avatar({
  src,
  alt = '',
  fallbackEmoji = '🙂',
  backgroundColor,
  size = 'md',
  className = '',
}: AvatarProps) {
  return (
    <span
      className={`${styles.avatar} ${styles[size]} ${className}`}
      style={backgroundColor ? { backgroundColor } : undefined}
      aria-hidden={!alt}
    >
      {src ? (
        <img className={styles.image} src={src} alt={alt} />
      ) : (
        <span className={styles.fallback}>{fallbackEmoji}</span>
      )}
    </span>
  )
}
