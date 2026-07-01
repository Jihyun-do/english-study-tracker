import { FileText, Headphones } from 'lucide-react'
import { AdminDrawer } from '../AdminDrawer'
import type { AssignmentFormData } from '../../../types/assignment'
import {
  formatDeadlineLabel,
  formatPublishDateLabel,
} from './assignmentUtils'
import styles from './AssignmentPreviewDrawer.module.css'

interface AssignmentPreviewDrawerProps {
  isOpen: boolean
  form: AssignmentFormData
  onClose: () => void
}

export function AssignmentPreviewDrawer({
  isOpen,
  form,
  onClose,
}: AssignmentPreviewDrawerProps) {
  const dateLabel = form.publishDate
    ? formatPublishDateLabel(form.publishDate)
    : '과제 날짜 미선택'

  return (
    <AdminDrawer isOpen={isOpen} title="과제 미리보기" onClose={onClose}>
      <p className={styles.previewNote}>
        사용자 홈·자료실에서 보이는 형태를 미리 확인합니다.
      </p>

      <div className={styles.previewCard}>
        <p className={styles.dateLabel}>{dateLabel}</p>
        <h3 className={styles.title}>
          {form.title.trim() || '과제 제목을 입력해주세요'}
        </h3>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <FileText size={14} />
            PDF {form.pdfFiles.length}개
          </span>
          <span className={styles.metaItem}>
            <Headphones size={14} />
            음성 {form.audioFiles.length}개
          </span>
        </div>

        {form.pdfFiles.length > 0 && (
          <ul className={styles.filePreviewList}>
            {form.pdfFiles.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        )}

        {form.audioFiles.length > 0 && (
          <ul className={styles.filePreviewList}>
            {form.audioFiles.map((file) => (
              <li key={file.id}>{file.name}</li>
            ))}
          </ul>
        )}

        <div className={styles.section}>
          <p className={styles.sectionLabel}>과제 설명</p>
          <p className={styles.description}>
            {form.description.trim() || '과제 설명이 입력되지 않았습니다.'}
          </p>
        </div>

        <div className={styles.section}>
          <p className={styles.sectionLabel}>제출 마감</p>
          <p className={styles.deadline}>
            {form.deadlineDate && form.deadlineTime
              ? formatDeadlineLabel(form.deadlineDate, form.deadlineTime)
              : '마감일을 설정해주세요'}
          </p>
        </div>

        {form.publishDate && (
          <p className={styles.publishHint}>
            {form.publishDate} 00:00에 자동 공개됩니다
          </p>
        )}
      </div>
    </AdminDrawer>
  )
}
