import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import StartPage from './components/StartPage'
import Editor from './components/Editor'

function App() {
  return(
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<StartPage />} />
          <Route path='editor' element={<Editor />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

