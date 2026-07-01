import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { StudyContentProvider } from './contexts/StudyContentContext'
import { ToastProvider } from './contexts/ToastContext'
import { router } from './router'

function App() {
  return (
    <AuthProvider>
      <StudyContentProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </StudyContentProvider>
    </AuthProvider>
  )
}

export default App
