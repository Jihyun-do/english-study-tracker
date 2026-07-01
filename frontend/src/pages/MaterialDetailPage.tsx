import { ArrowLeft } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { PdfViewer } from '../components/library/PdfViewer'
import { MaterialAudioPlayer } from '../components/library/MaterialAudioPlayer'
import { SubmissionStatus } from '../components/library/SubmissionStatus'
import type { LibraryMaterial } from '../data/mockLibraryData'
import { mockMaterialSubmissionStatus } from '../data/mockSubmissionStatusData'
import styles from './MaterialDetailPage.module.css'

interface MaterialDetailPageProps {
  material: LibraryMaterial
  onBack: () => void
  onSubmit: () => void
}

export function MaterialDetailPage({ material, onBack, onSubmit }: MaterialDetailPageProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <h2 className={styles.headerTitle}>자료 상세</h2>
      </header>

      <div
        className={`${styles.statusBadge} ${material.isSubmitted ? styles.submitted : styles.pending}`}
      >
        {material.isSubmitted ? '✅ 과제 제출 완료' : '📝 과제 미제출'}
      </div>

      <Card padding="md">
        <span className={styles.date}>{material.dateLabel}</span>
        <h3 className={styles.title}>{material.title}</h3>
        <p className={styles.description}>{material.description}</p>
      </Card>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>PDF 자료</h4>
        <PdfViewer file={material.pdf} />
      </section>

      <section className={styles.section}>
        <h4 className={styles.sectionTitle}>음성 자료</h4>
        <ul className={styles.audioList}>
          {material.audioFiles.map((file) => (
            <li key={file.id}>
              <MaterialAudioPlayer file={file} />
            </li>
          ))}
        </ul>
      </section>

      <SubmissionStatus status={mockMaterialSubmissionStatus} />

      <div className={styles.submitBar}>
        <button type="button" className={styles.submitBtn} onClick={onSubmit}>
          과제 제출하기
        </button>
      </div>
    </div>
  )
}
