import { useRef, type ChangeEvent } from 'react'
import { Mic, FileAudio } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import styles from './AudioUploadField.module.css'

interface AudioUploadFieldProps {
  fileName: string | null
  onAudioSelect: (file: File) => void
  onAudioClear: () => void
}

export function AudioUploadField({
  fileName,
  onAudioSelect,
  onAudioClear,
}: AudioUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onAudioSelect(file)
  }

  return (
    <section className={styles.section}>
      <h4 className={styles.label}>음성 파일</h4>
      <Card padding="md">
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className={styles.hiddenInput}
          onChange={handleChange}
        />

        {fileName ? (
          <div className={styles.selected}>
            <div className={styles.fileInfo}>
              <FileAudio size={20} className={styles.fileIcon} />
              <span className={styles.fileName}>{fileName}</span>
            </div>
            <button type="button" className={styles.changeBtn} onClick={onAudioClear}>
              변경
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.selectBtn}
            onClick={() => inputRef.current?.click()}
          >
            <Mic size={20} />
            음성 파일 선택
          </button>
        )}
      </Card>
    </section>
  )
}
