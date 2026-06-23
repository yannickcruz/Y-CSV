import { Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import StartPage from './components/StartPage'
import Editor from './components/Editor'
import {useState, useCallback} from 'react'
import UploadFile from './components/PopUps/UploadFile'


function App() {

  const [uploaderOpen, setUploaderOpen] = useState(false);
  const url = 'http://127.0.0.1:7056';
  const navigate = useNavigate();

  const loadStandardCSV = async () => {
    try{
      const response = await fetch(`${url}/`);

      if(!response.ok){
        throw new Erros('Failed to load CSV data');
        alert('Failed to load CSV data');
      }

      const data = await response.json();
      // Process the data as needed
      console.log(response);
      console.log(data);


    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }

  const uploadCSV = useCallback(async (formData) => {
    try{
      const response = await fetch(`${url}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if(result){
        navigate('/editor');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  });


  return(
    <>
      {uploaderOpen && <UploadFile isClose={setUploaderOpen} submit={uploadCSV} />}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<StartPage openUploader={setUploaderOpen} loadStandardCSV={loadStandardCSV} />} />
          <Route path='editor' element={<Editor />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

