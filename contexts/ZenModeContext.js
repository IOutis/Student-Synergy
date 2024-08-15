import { createContext, useContext, useState, useEffect } from 'react';

const ZenModeContext = createContext();

export const useZenMode = () => useContext(ZenModeContext);

export const ZenModeProvider = ({ children }) => {
  const [isZenMode, setIsZenMode] = useState(false);

  useEffect(() => {
    const savedZenMode = JSON.parse(localStorage.getItem('zenMode'));
    if (savedZenMode !== null) {
      setIsZenMode(savedZenMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('zenMode', JSON.stringify(isZenMode));
  }, [isZenMode]);

  const toggleZenMode = () => {
    setIsZenMode(!isZenMode);
  };

  return (
    <ZenModeContext.Provider value={{ isZenMode, toggleZenMode }}>
      {children}
    </ZenModeContext.Provider>
  );
};
