import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import StartPage from './components/StartPage'

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<StartPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

