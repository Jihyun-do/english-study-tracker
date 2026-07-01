import { useState } from 'react'
import { Play, Pause, Headphones, Download } from 'lucide-react'
import { Card } from '../ui/Card'
import type { AudioFile } from '../../data/mockLibraryData'
import styles from './MaterialAudioPlayer.module.css'

interface MaterialAudioPlayerProps {
  file: AudioFile
}

export function MaterialAudioPlayer({ file }: MaterialAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <Card className={styles.player} padding="md">
      <div className={styles.fileName}>
        <Headphones size={18} className={styles.headphoneIcon} />
        <span>{file.name}</span>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => setIsPlaying((prev) => !prev)}
        >
          {isPlaying ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          {isPlaying ? '일시정지' : '재생'}
        </button>
        <button type="button" className={styles.actionBtn}>
          <Download size={16} />
          다운로드
        </button>
      </div>

      {isPlaying && (
        <div className={styles.playback}>
          <div className={styles.track}>
            <div className={`${styles.progress} ${styles.playing}`} />
          </div>
          <div className={styles.timeRow}>
            <span>0:00</span>
            <span>{file.duration}</span>
          </div>
        </div>
      )}
    </Card>
  )
}
