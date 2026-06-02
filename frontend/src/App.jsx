import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import LedgerLayout from './components/layout/LedgerLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import WalletLoginPage from './pages/WalletLoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import CreateRecordPage from './pages/CreateRecordPage.jsx'
import RecordDetailPage from './pages/RecordDetailPage.jsx'

function LegacyRecordRedirect() {
  const { id } = useParams()
  return <Navigate to={`/records/${id}`} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<WalletLoginPage />} />
          <Route element={<LedgerLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route
              path="/records/new"
              element={
                <ProtectedRoute>
                  <CreateRecordPage />
                </ProtectedRoute>
              }
            />
            <Route path="/records/:id" element={<RecordDetailPage />} />
          </Route>
          <Route path="/record/new" element={<Navigate to="/records/new" replace />} />
          <Route path="/record/:id" element={<LegacyRecordRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
