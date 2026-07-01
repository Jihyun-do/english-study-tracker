import type { AdminTopicItem } from '../../../data/mockAdminData'
import { AdminButton } from '../AdminButton'
import { AdminDrawer } from '../AdminDrawer'
import { TopicDetailContent } from '../../topics/TopicDetailContent'
import styles from './AdminTopicDetailDrawer.module.css'

interface AdminTopicDetailDrawerProps {
  topic: AdminTopicItem | null
  onClose: () => void
  onToggleAdopt: (id: string) => void
}

export function AdminTopicDetailDrawer({
  topic,
  onClose,
  onToggleAdopt,
}: AdminTopicDetailDrawerProps) {
  return (
    <AdminDrawer isOpen={topic !== null} title="주제 상세" onClose={onClose}>
      {topic && (
        <div className={styles.content}>
          <TopicDetailContent
            topic={{
              title: topic.title,
              description: topic.description,
              referenceLink: topic.referenceLink,
              isAdopted: topic.isAdopted,
              likeCount: topic.likeCount,
              authorName: topic.authorName,
              isAnonymous: false,
              createdAtISO: topic.createdAtISO,
            }}
            readOnlyLike
            linkOpensInNewTab
          />

          <div className={styles.adminActions}>
            <AdminButton
              variant={topic.isAdopted ? 'ghost' : 'primary'}
              className={styles.adoptBtn}
              onClick={() => onToggleAdopt(topic.id)}
            >
              {topic.isAdopted ? '채택 해제' : '채택하기'}
            </AdminButton>
          </div>
        </div>
      )}
    </AdminDrawer>
  )
}
