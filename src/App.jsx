import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import StartPage from './components/StartPage'
import Editor from './components/Editor'
import {useState, useCallback} from 'react'
import UploadFile from './components/PopUps/UploadFile'

function App() {

  const [uploaderOpen, setUploaderOpen] = useState(false);


  return(
    <>
      {uploaderOpen && <UploadFile isClose={setUploaderOpen} submit={(formData) => console.log(formData)} />}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<StartPage openUploader={setUploaderOpen} />} />
          <Route path='editor' element={<Editor />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

