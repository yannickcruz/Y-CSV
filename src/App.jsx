import { Routes, Route, useNavigate } from 'react-router-dom'
import Layout from './components/Layout'
import StartPage from './components/StartPage'
import Editor from './components/Editor'
import {useState, useCallback} from 'react'
import UploadFile from './components/PopUps/UploadFile'
import localforage from "localforage";


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


    } catch (error) {
      console.error('Error loading CSV data:', error);
    }
  }

  const saveToLocalForage = useCallback(async (headers, chunks) => {
  try {
    let totalItems = 0;
    for(let i = 0; i < chunks.length; i++){
      totalItems += chunks[i].rows.length;
    }

    const metadata = await localforage.getItem('csvMetadata');

    if (metadata?.chunkLength) {
      const deletePromises = Array.from({ length: metadata.chunkLength }, (_, i) => 
        localforage.removeItem(`csvChunk_${i}`)
      );
      await Promise.all(deletePromises); 
    }

    await Promise.all([
      localforage.setItem('headers', headers),
      localforage.setItem('csvMetadata', {
        chunkLength: chunks.length,
        totalItems: totalItems
      }),
      ...chunks.map((chunk, index) => {
        return localforage.setItem(`csvChunk_${index}`, chunk);
      })
    ]);

  } catch (error) {
    console.error("Erro ao salvar no localForage:", error);
  }
}, []);

  const uploadCSV = useCallback(async (formData) => {
    try{
      const response = await fetch(`${url}/upload`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if(result){
        const headers = result.chunks[0].headers;
        const chunks = result.chunks.map((chunk) => ({
          headers: headers,
          rows: chunk.rows,
          chunkIndex: chunk.chunk_index
        }));
        await saveToLocalForage(headers, chunks);
        navigate('/editor');
      }
    } catch (error) {
      console.error('Error uploading CSV:', error);
    }
  }, [saveToLocalForage, navigate]);

  const downloadCSV = async (filename = "data.csv") => {
    try {
      const metadata = await localforage.getItem('csvMetadata');
      if (!metadata?.chunkLength) {
        alert("Nenhum dado para baixar.");
        return;
      }

      const chunks = [];
      for (let i = 0; i < metadata.chunkLength; i++) {
        const chunk = await localforage.getItem(`csvChunk_${i}`);
        if (chunk) {
          chunks.push({
            chunk_index: chunk.chunkIndex,
            headers: chunk.headers,
            rows: chunk.rows.map(row => {
              const { id: _, ...rest } = row;
              return rest;
            })
          });
        }
      }

      const payload = { chunks, filename };

      const response = await fetch(`${url}/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro ao baixar CSV: ${response.statusText}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };


  return(
    <>
      {uploaderOpen && <UploadFile isClose={setUploaderOpen} submit={uploadCSV} />}
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<StartPage openUploader={setUploaderOpen} loadStandardCSV={loadStandardCSV} />} />
          <Route path='editor' element={<Editor downloadCSV={downloadCSV} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

