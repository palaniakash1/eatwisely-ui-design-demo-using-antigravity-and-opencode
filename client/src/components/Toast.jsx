import { createContext, useContext, useState, useCallback } from 'react'
import { HiCheck, HiExclamation, HiInformationCircle, HiX } from 'react-icons/hi'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, duration)
  }, [])

  const toast = {
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info'),
    warning: (message) => addToast(message, 'warning'),
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function Toast({ message, type, onClose }) {
  const icons = {
    success: <HiCheck className="w-5 h-5" />,
    error: <HiExclamation className="w-5 h-5" />,
    info: <HiInformationCircle className="w-5 h-5" />,
    warning: <HiExclamation className="w-5 h-5" />,
  }

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${colors[type]} animate-slide-in`}>
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <HiX className="w-4 h-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
