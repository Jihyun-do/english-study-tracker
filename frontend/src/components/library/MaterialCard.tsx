import { FileText, Headphones } from 'lucide-react'
import { Card } from '../ui/Card'
import type { LibraryMaterial } from '../../data/mockLibraryData'
import styles from './MaterialCard.module.css'

interface MaterialCardProps {
  material: LibraryMaterial
  onClick: () => void
}

export function MaterialCard({ material, onClick }: MaterialCardProps) {
  return (
    <button type="button" className={styles.cardBtn} onClick={onClick}>
      <Card className={styles.card} padding="md">
        <span className={styles.date}>{material.dateLabel}</span>
        <h3 className={styles.title}>{material.title}</h3>
        <p className={styles.description}>{material.description}</p>
        <div className={styles.files}>
          <span className={`${styles.fileTag} ${styles.pdfTag}`}>
            <FileText size={14} />
            PDF 자료 1개
          </span>
          <span className={`${styles.fileTag} ${styles.audioTag}`}>
            <Headphones size={14} />
            음성 파일 {material.audioFiles.length}개
          </span>
        </div>
      </Card>
    </button>
  )
}
