import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { OnboardingLayout } from './OnboardingLayout'
import shared from './OnboardingShared.module.css'

export function OnboardingNicknamePage() {
  const { onboardingDraft, setNickname } = useAuth()
  const navigate = useNavigate()
  const [nickname, setNicknameInput] = useState(onboardingDraft.nickname)

  useEffect(() => {
    if (!onboardingDraft.inviteCode.trim()) {
      navigate('/onboarding/invite-code', { replace: true })
    }
  }, [onboardingDraft.inviteCode, navigate])

  const canContinue = nickname.trim().length >= 2

  const handleContinue = () => {
    if (!canContinue) return
    setNickname(nickname.trim())
    navigate('/onboarding/complete')
  }

  return (
    <OnboardingLayout
      step={2}
      title="스터디에서 사용할 닉네임을 입력해주세요"
      description="인증 피드와 댓글에 표시되는 이름이에요."
    >
      <div className={shared.field}>
        <label htmlFor="nickname" className={shared.label}>
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          className={shared.input}
          placeholder="2~10자"
          value={nickname}
          maxLength={10}
          onChange={(e) => setNicknameInput(e.target.value)}
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
