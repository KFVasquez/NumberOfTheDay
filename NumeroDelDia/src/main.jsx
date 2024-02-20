import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeContextProvider } from './Context/ThemeContext.jsx'
import App from "./App.jsx"
import NumberMinute from './WebPages/NumberMinute/NumberMinute.jsx'
import './index.css'
import Rules from './WebPages/Rules/Rules.jsx'
import FreeMode from './WebPages/FreeMode/FreeMode.jsx'

const routes = (
  <Routes>
    <Route path='/' element={<App />} />
    <Route path='/numberMinute' element={<NumberMinute />} />
    <Route path='/freeMode' element={<FreeMode />} />
    <Route path='/rules' element={<Rules />} />
  </Routes>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        {routes}
      </BrowserRouter>
    </ThemeContextProvider>
  </React.StrictMode>
)