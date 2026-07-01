import { FileText, Headphones } from 'lucide-react'
import type { AssignmentFormData } from '../../../types/assignment'
import { AssignmentMediaUpload } from './AssignmentMediaUpload'
import styles from './AssignmentFormFields.module.css'

interface AssignmentFormFieldsProps {
  form: AssignmentFormData
  onChange: (form: AssignmentFormData) => void
}

export function AssignmentFormFields({ form, onChange }: AssignmentFormFieldsProps) {
  const update = <K extends keyof AssignmentFormData>(key: K, value: AssignmentFormData[K]) => {
    onChange({ ...form, [key]: value })
  }

  return (
    <>
      <div className={styles.field}>
        <label htmlFor="assignment-date" className={styles.label}>
          과제 날짜 (공개일)
        </label>
        <input
          id="assignment-date"
          type="date"
          className={styles.input}
          value={form.publishDate}
          onChange={(e) => update('publishDate', e.target.value)}
        />
        <p className={styles.hint}>
          선택한 날짜 <strong>00:00</strong>에 사용자 홈·자료실에 자동 공개됩니다. 미래 날짜
          과제도 미리 등록할 수 있습니다.
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="assignment-title" className={styles.label}>
          과제 제목
        </label>
        <input
          id="assignment-title"
          type="text"
          className={styles.input}
          placeholder="예: 영화 소개 영어 표현 익히기"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
        />
      </div>

      <div className={styles.uploadRow}>
        <AssignmentMediaUpload
          label="PDF 업로드"
          icon={FileText}
          accept=".pdf,application/pdf"
          files={form.pdfFiles}
          onChange={(pdfFiles) => update('pdfFiles', pdfFiles)}
        />
        <AssignmentMediaUpload
          label="음성 업로드"
          icon={Headphones}
          accept="audio/*"
          files={form.audioFiles}
          onChange={(audioFiles) => update('audioFiles', audioFiles)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          과제 설명
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          rows={4}
          placeholder="과제 내용과 학습 방법을 입력하세요"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>제출 마감일</span>
        <div className={styles.deadlineRow}>
          <div className={styles.deadlineField}>
            <label htmlFor="deadline-date" className={styles.sublabel}>
              날짜
            </label>
            <input
              id="deadline-date"
              type="date"
              className={styles.input}
              value={form.deadlineDate}
              onChange={(e) => update('deadlineDate', e.target.value)}
            />
          </div>
          <div className={styles.deadlineField}>
            <label htmlFor="deadline-time" className={styles.sublabel}>
              시간
            </label>
            <input
              id="deadline-time"
              type="time"
              className={styles.input}
              value={form.deadlineTime}
              onChange={(e) => update('deadlineTime', e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  )
}
