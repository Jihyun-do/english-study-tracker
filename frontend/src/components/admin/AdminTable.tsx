import { Card } from '../ui/Card'
import styles from './AdminTable.module.css'

interface AdminTableProps {
  children: React.ReactNode
  fluid?: boolean
}

export function AdminTable({ children, fluid = false }: AdminTableProps) {
  return (
    <Card className={`${styles.wrapper} ${fluid ? styles.wrapperFluid : ''}`} padding="sm">
      <div className={styles.scroll}>{children}</div>
    </Card>
  )
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return <thead className={styles.head}>{children}</thead>
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

export function AdminTableRow({
  children,
  onClick,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const classNames = [
    styles.row,
    onClick && !disabled ? styles.clickable : '',
    disabled ? styles.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <tr className={classNames} onClick={onClick}>
      {children}
    </tr>
  )
}

export function AdminTableCell({
  children,
  align = 'left',
  colSpan,
  className = '',
}: {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  colSpan?: number
  className?: string
}) {
  return (
    <td
      className={`${styles.cell} ${className}`.trim()}
      style={{ textAlign: align }}
      colSpan={colSpan}
    >
      {children}
    </td>
  )
}

export function AdminTableHeaderCell({
  children,
  align = 'left',
  className = '',
}: {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}) {
  return (
    <th
      className={`${styles.headerCell} ${className}`.trim()}
      style={{ textAlign: align }}
    >
      {children}
    </th>
  )
}
