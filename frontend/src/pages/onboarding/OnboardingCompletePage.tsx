import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, getPostLoginPath } from '../../auth/AuthContext'
import { OnboardingLayout } from './OnboardingLayout'
import shared from './OnboardingShared.module.css'

export function OnboardingCompletePage() {
  const { completeOnboarding, onboardingDraft } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!onboardingDraft.inviteCode.trim()) {
      navigate('/onboarding/invite-code', { replace: true })
      return
    }
    if (!onboardingDraft.nickname.trim()) {
      navigate('/onboarding/nickname', { replace: true })
    }
  }, [onboardingDraft, navigate])

  const handleStart = () => {
    const user = completeOnboarding()
    navigate(getPostLoginPath(user.role), { replace: true })
  }

  return (
    <OnboardingLayout step={3} title="가입이 완료되었어요!">
      <p className={shared.completeEmoji} aria-hidden="true">
        🎉
      </p>
      <p className={shared.completeMessage}>
        <strong>{onboardingDraft.nickname || '스터디원'}</strong>님, Jude&apos;s English에
        오신 것을 환영해요.
        <br />
        오늘부터 함께 꾸준히 영어 공부해요.
      </p>

      <button type="button" className={shared.primaryBtn} onClick={handleStart}>
        스터디 시작하기
      </button>
    </OnboardingLayout>
  )
}
