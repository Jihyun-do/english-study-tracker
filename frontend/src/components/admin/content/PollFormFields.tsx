import { Plus, X } from 'lucide-react'
import type { PollFormData } from '../../../types/content'
import styles from './PollFormFields.module.css'

interface PollFormFieldsProps {
  form: PollFormData
  onChange: (form: PollFormData) => void
}

export function PollFormFields({ form, onChange }: PollFormFieldsProps) {
  const update = <K extends keyof PollFormData>(key: K, value: PollFormData[K]) => {
    onChange({ ...form, [key]: value })
  }

  const updateOption = (index: number, value: string) => {
    const options = [...form.options]
    options[index] = value
    onChange({ ...form, options })
  }

  const addOption = () => {
    onChange({ ...form, options: [...form.options, ''] })
  }

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return
    onChange({ ...form, options: form.options.filter((_, i) => i !== index) })
  }

  return (
    <>
      <div className={styles.field}>
        <label htmlFor="poll-title" className={styles.label}>
          질문
        </label>
        <input
          id="poll-title"
          type="text"
          className={styles.input}
          placeholder="예: 7월 추가 모임 요일 투표"
          value={form.title}
          onChange={(event) => update('title', event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>투표 기간</span>
        <div className={styles.periodRow}>
          <div className={styles.periodField}>
            <label htmlFor="poll-start" className={styles.sublabel}>
              시작일
            </label>
            <input
              id="poll-start"
              type="date"
              className={styles.input}
              value={form.startDate}
              onChange={(event) => update('startDate', event.target.value)}
            />
          </div>
          <div className={styles.periodField}>
            <label htmlFor="poll-end" className={styles.sublabel}>
              마감일
            </label>
            <input
              id="poll-end"
              type="date"
              className={styles.input}
              value={form.endDate}
              onChange={(event) => update('endDate', event.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.optionHeader}>
          <span className={styles.label}>선택지</span>
          <button type="button" className={styles.addBtn} onClick={addOption}>
            <Plus size={14} />
            추가
          </button>
        </div>
        <ul className={styles.optionList}>
          {form.options.map((option, index) => (
            <li key={index} className={styles.optionRow}>
              <input
                type="text"
                className={styles.input}
                placeholder={`선택지 ${index + 1}`}
                value={option}
                onChange={(event) => updateOption(index, event.target.value)}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeOption(index)}
                disabled={form.options.length <= 2}
                aria-label={`선택지 ${index + 1} 삭제`}
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.checkboxField}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={form.allowMultiple}
            onChange={(event) => update('allowMultiple', event.target.checked)}
          />
          복수 선택 허용
        </label>
      </div>
    </>
  )
}
