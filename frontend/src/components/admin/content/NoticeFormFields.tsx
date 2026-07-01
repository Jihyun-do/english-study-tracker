import type { NoticeFormData } from '../../../types/content'
import styles from './NoticeFormFields.module.css'

interface NoticeFormFieldsProps {
  form: NoticeFormData
  onChange: (form: NoticeFormData) => void
}

export function NoticeFormFields({ form, onChange }: NoticeFormFieldsProps) {
  const update = <K extends keyof NoticeFormData>(key: K, value: NoticeFormData[K]) => {
    onChange({ ...form, [key]: value })
  }

  return (
    <>
      <div className={styles.field}>
        <label htmlFor="notice-publish-date" className={styles.label}>
          게시일
        </label>
        <input
          id="notice-publish-date"
          type="date"
          className={styles.input}
          value={form.publishDate}
          onChange={(event) => update('publishDate', event.target.value)}
        />
        <p className={styles.hint}>
          선택한 날짜 <strong>00:00</strong>에 공지가 게시됩니다.
        </p>
      </div>

      <div className={styles.field}>
        <label htmlFor="notice-title" className={styles.label}>
          제목
        </label>
        <input
          id="notice-title"
          type="text"
          className={styles.input}
          placeholder="예: 금요일 스터디 시간 변경 안내"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="notice-preview" className={styles.label}>
          배너 미리보기
        </label>
        <input
          id="notice-preview"
          type="text"
          className={styles.input}
          placeholder="예: 📢 이번 주 금요일 스터디는 20시 시작합니다."
          value={form.preview}
          onChange={(event) => update('preview', event.target.value)}
        />
        <p className={styles.hint}>홈 상단 배너에 표시되는 한 줄 문구입니다.</p>
      </div>

      <div className={styles.field}>
        <label htmlFor="notice-content" className={styles.label}>
          본문
        </label>
        <textarea
          id="notice-content"
          className={styles.textarea}
          rows={8}
          placeholder="공지 본문을 입력하세요"
          value={form.content}
          onChange={(event) => update('content', event.target.value)}
        />
      </div>

      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.isBanner}
            onChange={(event) => update('isBanner', event.target.checked)}
          />
          홈 배너로 지정
        </label>
        <p className={styles.hint}>
          배너로 지정하면 기존 배너 공지는 자동으로 해제됩니다. 홈에는 배너 공지 1건만
          노출됩니다.
        </p>
      </div>
    </>
  )
}
