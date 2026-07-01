import { useEffect, useMemo, useState } from 'react'
import { MaterialCard } from '../components/library/MaterialCard'
import { MaterialDetailPage } from './MaterialDetailPage'
import { EmptyState } from '../components/ui/EmptyState'
import {
  mockLibraryMaterials,
  sortMaterialsByLatest,
} from '../data/mockLibraryData'
import type { SubmitAssignmentParams } from '../submission/types'
import styles from './LibraryPage.module.css'

interface LibraryPageProps {
  onSubmitAssignment: (params: SubmitAssignmentParams) => void
  openMaterialId?: string | null
  onOpenMaterialIdConsumed?: () => void
}

export function LibraryPage({
  onSubmitAssignment,
  openMaterialId,
  onOpenMaterialIdConsumed,
}: LibraryPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const materials = useMemo(
    () => sortMaterialsByLatest(mockLibraryMaterials),
    [],
  )

  useEffect(() => {
    if (openMaterialId) {
      setSelectedId(openMaterialId)
      onOpenMaterialIdConsumed?.()
    }
  }, [openMaterialId, onOpenMaterialIdConsumed])

  const selectedMaterial = materials.find((m) => m.id === selectedId)

  if (selectedMaterial) {
    return (
      <MaterialDetailPage
        material={selectedMaterial}
        onBack={() => setSelectedId(null)}
        onSubmit={() =>
          onSubmitAssignment({
            assignmentId: selectedMaterial.id,
            returnTab: 'library',
          })
        }
      />
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <h2 className={styles.title}>자료실</h2>
        <p className={styles.subtitle}>스터디 자료를 날짜별로 확인하세요</p>
      </header>

      {materials.length === 0 ? (
        <EmptyState message="등록된 자료가 없습니다." variant="boxed" />
      ) : (
        <ul className={styles.list}>
          {materials.map((material) => (
            <li key={material.id}>
              <MaterialCard
                material={material}
                onClick={() => setSelectedId(material.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
