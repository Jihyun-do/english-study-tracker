import { useCallback, useState } from 'react'
import { Upload } from 'lucide-react'
import { AdminPageHeader } from '../../components/admin/AdminPageHeader'
import { AdminButton } from '../../components/admin/AdminButton'
import { Card } from '../../components/ui/Card'
import { SubmissionImage } from '../../components/feed/SubmissionImage'
import { useToast } from '../../contexts/ToastContext'
import { mockAdminStudySettings } from '../../data/mockAdminData'
import styles from './AdminSettingsPage.module.css'

const DESCRIPTION_MAX_LENGTH = 300

export function AdminSettingsPage() {
  const [settings, setSettings] = useState(mockAdminStudySettings)
  const { showToast } = useToast()

  const handleDescriptionChange = (value: string) => {
    if (value.length > DESCRIPTION_MAX_LENGTH) return
    setSettings({ ...settings, description: value })
  }

  const handleCopyJoinCode = useCallback(async () => {
    if (settings.joinCode.trim().length === 0) return

    try {
      await navigator.clipboard.writeText(settings.joinCode)
      showToast('참여코드가 복사되었습니다.')
    } catch {
      // Success-only toast policy: copy failure is silent for now.
    }
  }, [settings.joinCode, showToast])

  const handleSave = () => {
    showToast('설정을 저장했습니다.')
  }

  return (
    <div className={styles.page}>
      <AdminPageHeader title="설정" description="스터디 정보를 수정하고 관리하세요" />

      <Card className={styles.form} padding="lg">
        <div className={styles.imageSection}>
          <div className={styles.studyImageWrap}>
            <SubmissionImage theme={settings.imageTheme} userName="스터디" variant="compact" />
          </div>
          <button type="button" className={styles.imageUploadBtn}>
            <Upload size={14} />
            스터디 이미지 변경
          </button>
        </div>

        <div className={styles.field}>
          <label htmlFor="study-name" className={styles.label}>
            스터디명
          </label>
          <input
            id="study-name"
            type="text"
            className={styles.input}
            value={settings.name}
            onChange={(e) => setSettings({ ...settings, name: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="study-desc" className={styles.label}>
            소개
          </label>
          <div className={styles.textareaWrap}>
            <textarea
              id="study-desc"
              className={styles.textarea}
              rows={3}
              maxLength={DESCRIPTION_MAX_LENGTH}
              value={settings.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
            <p className={styles.charCount} aria-live="polite">
              {settings.description.length} / {DESCRIPTION_MAX_LENGTH}
            </p>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="join-code" className={styles.label}>
            참여코드
          </label>
          <div className={styles.joinCodeRow}>
            <input
              id="join-code"
              type="text"
              className={styles.input}
              value={settings.joinCode}
              onChange={(e) => setSettings({ ...settings, joinCode: e.target.value })}
            />
            <button type="button" className={styles.copyBtn} onClick={handleCopyJoinCode}>
              📋 복사
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          <AdminButton onClick={handleSave}>저장</AdminButton>
        </div>
      </Card>
    </div>
  )
}
