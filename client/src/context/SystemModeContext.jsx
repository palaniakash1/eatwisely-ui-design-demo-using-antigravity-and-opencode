import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const SystemModeContext = createContext(null);

const STORAGE_KEY = 'systemMode';

const defaultMode = {
  maintenanceMode: false,
  underDevelopment: false,
  enabledForRoles: ['superAdmin'],
};

export function SystemModeProvider({ children }) {
  const [systemMode, setSystemMode] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load system mode:', e);
    }
    return defaultMode;
  });

  const [isLoading] = useState(false);

  const saveToStorage = useCallback((newMode) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newMode));
    } catch (e) {
      console.error('Failed to save system mode:', e);
    }
  }, []);

  const setMaintenanceMode = useCallback((enabled) => {
    setSystemMode((prev) => {
      const newMode = { ...prev, maintenanceMode: enabled };
      saveToStorage(newMode);
      return newMode;
    });
  }, [saveToStorage]);

  const setUnderDevelopment = useCallback((enabled) => {
    setSystemMode((prev) => {
      const newMode = { ...prev, underDevelopment: enabled };
      saveToStorage(newMode);
      return newMode;
    });
  }, [saveToStorage]);

  const toggleMaintenanceMode = useCallback(() => {
    setSystemMode((prev) => {
      const newMode = { ...prev, maintenanceMode: !prev.maintenanceMode };
      saveToStorage(newMode);
      return newMode;
    });
  }, [saveToStorage]);

  const toggleUnderDevelopment = useCallback(() => {
    setSystemMode((prev) => {
      const newMode = { ...prev, underDevelopment: !prev.underDevelopment };
      saveToStorage(newMode);
      return newMode;
    });
  }, [saveToStorage]);

  const value = useMemo(() => ({
    systemMode,
    isLoading,
    isMaintenanceMode: systemMode.maintenanceMode,
    isUnderDevelopment: systemMode.underDevelopment,
    setMaintenanceMode,
    setUnderDevelopment,
    toggleMaintenanceMode,
    toggleUnderDevelopment,
  }), [systemMode, isLoading, setMaintenanceMode, setUnderDevelopment, toggleMaintenanceMode, toggleUnderDevelopment]);

  return (
    <SystemModeContext.Provider value={value}>
      {children}
    </SystemModeContext.Provider>
  );
}

export function useSystemMode() {
  const context = useContext(SystemModeContext);
  if (!context) {
    throw new Error('useSystemMode must be used within a SystemModeProvider');
  }
  return context;
}

export default SystemModeContext;
