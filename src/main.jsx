import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {createCSVAPI} from './services/csvApi.js'

const csvAPI = createCSVAPI(import.meta.env.VITE_CSV_API);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App csvAPI={csvAPI}/>
    </BrowserRouter>
  </StrictMode>,
)
