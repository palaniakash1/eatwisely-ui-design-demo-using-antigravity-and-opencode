import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { store, persistor } from './redux/store'
import { ToastProvider } from './components/Toast'
import { AuthProvider } from './context/AuthContext'
import { SystemModeProvider } from './context/SystemModeContext'
import App from './App.jsx'
import './index.css'

if (typeof window !== 'undefined') {
  localStorage.removeItem('eatwisely_users_json');
  localStorage.removeItem('eatwisely_users');
  localStorage.removeItem('users');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ToastProvider>
            <AuthProvider>
              <SystemModeProvider>
                <App />
              </SystemModeProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
