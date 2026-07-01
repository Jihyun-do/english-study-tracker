import { useMemo, useState, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppLayout, type TabId } from '../components/layout/AppLayout'
import { AppNavigationContext } from '../context/AppNavigationContext'
import { MyPageSubmissionsProvider } from '../contexts/MyPageSubmissionsContext'
import { HomePage } from '../pages/HomePage'
import { FeedPage } from '../pages/FeedPage'
import { TopicsPage } from '../pages/TopicsPage'
import { LibraryPage } from '../pages/LibraryPage'
import { MyPage } from '../pages/MyPage'
import { SettingsPage } from '../pages/SettingsPage'
import { SubmitAssignmentPage } from '../submission/pages/SubmitAssignmentPage'
import { SubmitSuccessPage } from '../submission/pages/SubmitSuccessPage'
import { EditSubmissionPage } from '../submission/pages/EditSubmissionPage'
import { UserPollProvider } from '../contexts/UserPollContext'
import { PollPage } from '../pages/PollPage'
import { mockHomeData } from '../data/mockHomeData'
import { POLLS_ROUTE, ROUTE_TO_TAB, USER_ROUTES } from '../router/paths'
import type { AppOverlay, EditSubmissionParams, SubmitAssignmentParams, SubmissionFormData } from '../submission/types'
import styles from '../App.module.css'

function resolveTab(pathname: string): TabId {
  return ROUTE_TO_TAB[pathname] ?? 'home'
}

function isSettingsPath(pathname: string) {
  return pathname === '/settings'
}

function isPollsPath(pathname: string) {
  return pathname === POLLS_ROUTE
}

export function UserLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = resolveTab(location.pathname)

  const [overlay, setOverlay] = useState<AppOverlay>('none')
  const [submitParams, setSubmitParams] = useState<SubmitAssignmentParams | null>(null)
  const [editParams, setEditParams] = useState<EditSubmissionParams | null>(null)
  const [libraryOpenMaterialId, setLibraryOpenMaterialId] = useState<string | null>(null)
  const [topicsOpenTopicId, setTopicsOpenTopicId] = useState<string | null>(null)

  const handleTabChange = useCallback(
    (tab: TabId) => {
      setOverlay('none')
      navigate(USER_ROUTES[tab])
    },
    [navigate],
  )

  const openSubmitAssignment = useCallback((params: SubmitAssignmentParams) => {
    setSubmitParams(params)
    setEditParams(null)
    setOverlay('submit')
  }, [])

  const openEditSubmission = useCallback((params: EditSubmissionParams) => {
    setEditParams(params)
    setSubmitParams(null)
    setOverlay('edit-submission')
  }, [])

  const openMaterialDetail = useCallback(
    (materialId: string) => {
      setLibraryOpenMaterialId(materialId)
      setOverlay('none')
      navigate(USER_ROUTES.library)
    },
    [navigate],
  )

  const navigateToMyPage = useCallback(() => {
    setOverlay('none')
    navigate(USER_ROUTES.mypage)
  }, [navigate])

  const navigateBack = useCallback(() => {
    setOverlay('none')
    setEditParams(null)
  }, [])

  const submitAssignment = useCallback((_data: SubmissionFormData) => {
    setOverlay('submit-success')
  }, [])

  const navigateToHome = useCallback(() => {
    setOverlay('none')
    navigate(USER_ROUTES.home)
  }, [navigate])

  const navigateToFeed = useCallback(() => {
    setOverlay('none')
    navigate(USER_ROUTES.feed)
  }, [navigate])

  const openTopicDetail = useCallback(
    (topicId: string) => {
      setTopicsOpenTopicId(topicId)
      setOverlay('none')
      navigate(USER_ROUTES.topics)
    },
    [navigate],
  )

  const navigation = useMemo(
    () => ({
      openSubmitAssignment,
      openEditSubmission,
      openMaterialDetail,
      navigateToMyPage,
      navigateBack,
      submitAssignment,
      navigateToHome,
      navigateToFeed,
      openTopicDetail,
      currentAssignmentId: submitParams?.assignmentId ?? null,
      currentEditParams: editParams,
    }),
    [
      openSubmitAssignment,
      openEditSubmission,
      openMaterialDetail,
      navigateToMyPage,
      navigateBack,
      submitAssignment,
      navigateToHome,
      navigateToFeed,
      openTopicDetail,
      submitParams,
      editParams,
    ],
  )

  const renderContent = () => {
    if (isPollsPath(location.pathname)) {
      return <PollPage onBack={() => navigate(USER_ROUTES.home)} />
    }

    if (isSettingsPath(location.pathname)) {
      return <SettingsPage />
    }

    switch (activeTab) {
      case 'home':
        return <HomePage />
      case 'feed':
        return <FeedPage />
      case 'topics':
        return (
          <TopicsPage
            openTopicId={topicsOpenTopicId}
            onOpenTopicIdConsumed={() => setTopicsOpenTopicId(null)}
          />
        )
      case 'library':
        return (
          <LibraryPage
            onSubmitAssignment={openSubmitAssignment}
            openMaterialId={libraryOpenMaterialId}
            onOpenMaterialIdConsumed={() => setLibraryOpenMaterialId(null)}
          />
        )
      case 'mypage':
        return <MyPage />
      default:
        return null
    }
  }

  return (
    <UserPollProvider>
      <MyPageSubmissionsProvider>
        <AppNavigationContext.Provider value={navigation}>
          <AppLayout
            userName={mockHomeData.userName}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          >
            {renderContent()}
            {overlay !== 'none' && (
              <div className={styles.overlay}>
                {overlay === 'submit' && <SubmitAssignmentPage />}
                {overlay === 'submit-success' && <SubmitSuccessPage />}
                {overlay === 'edit-submission' && <EditSubmissionPage />}
              </div>
            )}
          </AppLayout>
        </AppNavigationContext.Provider>
      </MyPageSubmissionsProvider>
    </UserPollProvider>
  )
}
