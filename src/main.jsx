import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { router } from './router.jsx'
import { RouterProvider } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { Toaster } from 'react-hot-toast';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
   
    <AuthContextProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '15px',
          },
          success: {
            iconTheme: {
              primary: '#4ade80', 
              secondary: '#333',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', 
              secondary: '#333',
            },
          },
        }}
      />
    </AuthContextProvider>
    </>
  </StrictMode>,
)
