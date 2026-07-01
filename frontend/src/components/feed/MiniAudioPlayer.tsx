import { Play, Mic } from 'lucide-react'
import styles from './MiniAudioPlayer.module.css'

interface MiniAudioPlayerProps {
  duration: string
}

export function MiniAudioPlayer({ duration }: MiniAudioPlayerProps) {
  return (
    <div className={styles.player}>
      <div className={styles.badge}>
        <Mic size={14} />
        <span>음성 첨부</span>
      </div>
      <div className={styles.controls}>
        <button type="button" className={styles.playBtn} aria-label="음성 재생">
          <Play size={14} fill="currentColor" />
        </button>
        <div className={styles.track}>
          <div className={styles.progress} />
        </div>
        <span className={styles.duration}>{duration}</span>
      </div>
    </div>
  )
}
