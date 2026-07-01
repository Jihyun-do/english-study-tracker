import { ThumbsUp } from 'lucide-react'
import type { AdminTopicItem } from '../../../data/mockAdminData'
import { AdminItemMenu } from '../AdminItemMenu'
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from '../AdminTable'
import { AdoptedBadge } from '../../topics/AdoptedBadge'
import { formatTopicCreatedAtDisplay } from './topicUtils'
import styles from './TopicList.module.css'

interface TopicListProps {
  topics: AdminTopicItem[]
  onSelect: (topic: AdminTopicItem) => void
  onHide: (id: string) => void
  onDelete: (id: string) => void
}

export function TopicList({ topics, onSelect, onHide, onDelete }: TopicListProps) {
  if (topics.length === 0) return null

  return (
    <AdminTable fluid>
      <table className={styles.table}>
        <colgroup>
          <col className={styles.colTitle} />
          <col className={styles.colAuthor} />
          <col className={styles.colLikes} />
          <col className={styles.colDate} />
          <col className={styles.colManage} />
        </colgroup>
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell>주제</AdminTableHeaderCell>
            <AdminTableHeaderCell>작성자</AdminTableHeaderCell>
            <AdminTableHeaderCell align="center">추천</AdminTableHeaderCell>
            <AdminTableHeaderCell align="center">작성일</AdminTableHeaderCell>
            <AdminTableHeaderCell align="center">관리</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>
        <AdminTableBody>
          {topics.map((topic) => (
            <AdminTableRow
              key={topic.id}
              onClick={() => onSelect(topic)}
              className={topic.visibility === 'hidden' ? styles.hiddenRow : undefined}
            >
              <AdminTableCell>
                <div className={styles.titleCell}>
                  <span className={styles.title}>{topic.title}</span>
                  {topic.isAdopted && <AdoptedBadge size="sm" />}
                  {topic.visibility === 'hidden' && (
                    <span className={styles.hiddenBadge}>숨김</span>
                  )}
                </div>
              </AdminTableCell>
              <AdminTableCell>
                <div className={styles.authorCell}>
                  <span
                    className={styles.avatar}
                    style={{ backgroundColor: topic.avatarColor }}
                  >
                    {topic.authorName.charAt(0)}
                  </span>
                  <span className={styles.authorName}>{topic.authorName}</span>
                </div>
              </AdminTableCell>
              <AdminTableCell align="center">
                <span className={styles.likeCount} aria-label={`추천 ${topic.likeCount}`}>
                  <ThumbsUp size={14} aria-hidden="true" />
                  <span className={styles.likeCountNumber}>{topic.likeCount}</span>
                </span>
              </AdminTableCell>
              <AdminTableCell align="center">
                <time className={styles.createdAt} dateTime={topic.createdAtISO}>
                  {formatTopicCreatedAtDisplay(topic.createdAtISO)}
                </time>
              </AdminTableCell>
              <AdminTableCell align="center">
                <div
                  className={styles.menuCell}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => event.stopPropagation()}
                >
                  <AdminItemMenu
                    visibility={topic.visibility}
                    onHide={() => onHide(topic.id)}
                    onDelete={() => onDelete(topic.id)}
                    ariaLabel="주제 관리 메뉴"
                  />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </table>
    </AdminTable>
  )
}
