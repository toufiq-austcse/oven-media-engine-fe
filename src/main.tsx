import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import OBSPage from './OBSPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <div>
        <nav style={{
          backgroundColor: '#333',
          padding: '10px 20px',
          marginBottom: '20px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '20px'
          }}>
            <Link
              to="/"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 15px',
                borderRadius: '4px',
                backgroundColor: '#555'
              }}
            >
              Meeting
            </Link>
            {/*<Link*/}
            {/*  to="/obs"*/}
            {/*  style={{*/}
            {/*    color: 'white',*/}
            {/*    textDecoration: 'none',*/}
            {/*    padding: '8px 15px',*/}
            {/*    borderRadius: '4px',*/}
            {/*    backgroundColor: '#555'*/}
            {/*  }}*/}
            {/*>*/}
            {/*  OBS Setup*/}
            {/*</Link>*/}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/obs" element={<OBSPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  </StrictMode>,
)
