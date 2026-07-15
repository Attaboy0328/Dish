import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { useGameState } from './hooks/useGameState'
import { Home } from './pages/Home'
import { Codex } from './pages/Codex'
import { Settings } from './pages/Settings'
import './styles/tokens.css'

export default function App() {
  const game = useGameState()

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home game={game} />} />
          <Route path="codex" element={<Codex game={game} />} />
          <Route path="settings" element={<Settings game={game} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
