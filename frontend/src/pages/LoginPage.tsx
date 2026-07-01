import { useNavigate } from 'react-router-dom'
import { useAuth, getPostLoginPath } from '../auth/AuthContext'
import { GoogleLoginButton } from '../components/auth/GoogleLoginButton'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleLogin = () => {
    const result = loginWithGoogle()

    if (result.type === 'returning') {
      navigate(getPostLoginPath(result.user.role), { replace: true })
      return
    }

    navigate('/onboarding/invite-code')
  }

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.hero}>
          <span className={styles.logo}>J</span>
          <h1 className={styles.title}>Jude&apos;s English</h1>
          <p className={styles.tagline}>
            영어를 함께,
            <br />
            꾸준히 성장하는 스터디
          </p>
        </header>

        <div className={styles.action}>
          <GoogleLoginButton onClick={handleGoogleLogin} />
        </div>

        <footer className={styles.footer}>
          <p className={styles.footerQuestion}>처음 이용하시나요?</p>
          <p className={styles.footerHint}>
            스터디장에게 받은 초대 코드를 입력하면 스터디에 참여할 수 있습니다.
          </p>
        </footer>
      </div>
    </div>
  )
}
