import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { OnboardingLayout } from './OnboardingLayout'
import shared from './OnboardingShared.module.css'

export function OnboardingInvitePage() {
  const { onboardingDraft, setInviteCode } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState(onboardingDraft.inviteCode)

  const canContinue = code.trim().length >= 4

  const handleContinue = () => {
    if (!canContinue) return
    setInviteCode(code.trim())
    navigate('/onboarding/nickname')
  }

  return (
    <OnboardingLayout
      step={1}
      title="스터디 초대 코드를 입력해주세요"
      description="스터디장에게 받은 초대 코드를 입력하면 참여할 수 있어요."
    >
      <div className={shared.field}>
        <label htmlFor="invite-code" className={shared.label}>
          초대 코드
        </label>
        <input
          id="invite-code"
          type="text"
          className={shared.input}
          placeholder="예: JUDE2025"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
        />
      </div>

      <button
        type="button"
        className={shared.primaryBtn}
        disabled={!canContinue}
        onClick={handleContinue}
      >
        다음
      </button>
    </OnboardingLayout>
  )
}
