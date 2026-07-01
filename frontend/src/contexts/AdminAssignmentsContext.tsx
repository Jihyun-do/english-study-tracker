import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AdminAssignment } from '../types/assignment'
import { mockAdminAssignments } from '../data/mockAdminAssignments'

interface AdminAssignmentsContextValue {
  assignments: AdminAssignment[]
  addAssignment: (assignment: AdminAssignment) => void
  updateAssignment: (assignment: AdminAssignment) => void
  getAssignmentById: (id: string) => AdminAssignment | undefined
}

const AdminAssignmentsContext = createContext<AdminAssignmentsContextValue | null>(null)

export function AdminAssignmentsProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<AdminAssignment[]>(mockAdminAssignments)

  const addAssignment = useCallback((assignment: AdminAssignment) => {
    setAssignments((prev) => [assignment, ...prev])
  }, [])

  const updateAssignment = useCallback((assignment: AdminAssignment) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === assignment.id ? assignment : item)),
    )
  }, [])

  const getAssignmentById = useCallback(
    (id: string) => assignments.find((item) => item.id === id),
    [assignments],
  )

  const value = useMemo(
    () => ({
      assignments,
      addAssignment,
      updateAssignment,
      getAssignmentById,
    }),
    [assignments, addAssignment, updateAssignment, getAssignmentById],
  )

  return (
    <AdminAssignmentsContext.Provider value={value}>
      {children}
    </AdminAssignmentsContext.Provider>
  )
}

export function useAdminAssignments() {
  const context = useContext(AdminAssignmentsContext)
  if (!context) {
    throw new Error('useAdminAssignments must be used within AdminAssignmentsProvider')
  }
  return context
}
