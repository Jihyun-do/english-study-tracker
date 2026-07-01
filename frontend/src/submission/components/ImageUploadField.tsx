import { useRef, type ChangeEvent } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { SubmissionImage } from '../../components/feed/SubmissionImage'
import type { SubmissionImageTheme } from '../submissionUtils'
import styles from './ImageUploadField.module.css'

interface ImageUploadFieldProps {
  previewUrl: string | null
  existingImageTheme?: SubmissionImageTheme | null
  onImageSelect: (file: File, previewUrl: string) => void
  onImageClear: () => void
}

export function ImageUploadField({
  previewUrl,
  existingImageTheme,
  onImageSelect,
  onImageClear,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageSelect(file, URL.createObjectURL(file))
    }
  }

  const hasPreview = previewUrl || existingImageTheme

  return (
    <section className={styles.section}>
      <h4 className={styles.label}>인증 사진</h4>
      <Card padding="md">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleChange}
        />

        {hasPreview ? (
          <div className={styles.previewWrap}>
            {previewUrl ? (
              <img src={previewUrl} alt="인증 사진 미리보기" className={styles.preview} />
            ) : existingImageTheme ? (
              <SubmissionImage theme={existingImageTheme} userName="나" />
            ) : null}
            <button
              type="button"
              className={styles.clearBtn}
              onClick={onImageClear}
              aria-label="사진 제거"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.uploadZone}
            onClick={() => inputRef.current?.click()}
          >
            <ImagePlus size={32} className={styles.uploadIcon} />
            <p className={styles.uploadText}>사진을 선택하거나 촬영하세요</p>
            <p className={styles.uploadHint}>학습 노트, 필기 인증 사진</p>
          </button>
        )}
      </Card>
    </section>
  )
}
