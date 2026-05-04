import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WindowManagerProvider } from './contexts/WindowManager'
import { FileSystemProvider } from './contexts/FileSystem'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WindowManagerProvider>
      <FileSystemProvider>
        <App />
      </FileSystemProvider>
    </WindowManagerProvider>
  </StrictMode>,
)
