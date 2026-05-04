import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useWindowManager } from './contexts/WindowManager';
import BootLoader from './components/os/BootLoader';
import Desktop from './components/os/Desktop';
import Taskbar from './components/os/Taskbar';
import StartMenu from './components/os/StartMenu';
import Window from './components/os/Window';

export default function App() {
  const [booted, setBooted] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const { windows } = useWindowManager();

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  const toggleStartMenu = useCallback(() => {
    setStartMenuOpen(prev => !prev);
  }, []);

  const closeStartMenu = useCallback(() => {
    setStartMenuOpen(false);
  }, []);

  if (!booted) {
    return <BootLoader onComplete={handleBootComplete} />;
  }

  return (
    <div className="w-full h-full overflow-hidden relative" onClick={closeStartMenu}>
      {/* Desktop */}
      <Desktop />

      {/* Windows */}
      {windows.map(win => (
        <Window key={win.id} windowData={win} />
      ))}

      {/* Start Menu */}
      <AnimatePresence>
        {startMenuOpen && (
          <StartMenu onClose={closeStartMenu} />
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar onStartClick={(e) => { e.stopPropagation(); toggleStartMenu(); }} startMenuOpen={startMenuOpen} />
    </div>
  );
}
