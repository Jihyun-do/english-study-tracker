import styles from './SubmitButton.module.css'

interface SubmitButtonProps {
  onClick: () => void
}

export function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <div className={styles.floatingWrap}>
      <button type="button" className={styles.button} onClick={onClick}>
        과제 제출하기
      </button>
    </div>
  )
}
