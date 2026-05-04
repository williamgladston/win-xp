import React, { useState, useCallback, useEffect } from 'react';
import { useWindowManager } from '../../contexts/WindowManager';
import { motion, AnimatePresence } from 'framer-motion';
import ICONS, { WALLPAPER } from '../../data/iconMap';

// Import all apps
import MyComputer from '../apps/MyComputer';
import Notepad from '../apps/Notepad';
import Paint from '../apps/Paint';
import Calculator from '../apps/Calculator';
import InternetExplorer from '../apps/InternetExplorer';
import Minesweeper from '../apps/Minesweeper';
import CommandPrompt from '../apps/CommandPrompt';
import ControlPanel from '../apps/ControlPanel';
import RecycleBin from '../apps/RecycleBin';
import Winamp from '../apps/Winamp';

export const APP_REGISTRY = {
  myComputer: { appId: 'myComputer', title: 'My Computer', icon: ICONS.myComputer, icon16: ICONS.myComputer16, component: MyComputer, width: 750, height: 520 },
  myDocuments: { appId: 'myDocuments', title: 'My Documents', icon: ICONS.myDocuments, icon16: ICONS.myDocuments, component: MyComputer, width: 750, height: 520, props: { startPath: '/My Documents' } },
  notepad: { appId: 'notepad', title: 'Notepad', icon: ICONS.notepad, icon16: ICONS.notepad16, component: Notepad, width: 600, height: 400, allowMultiple: true },
  paint: { appId: 'paint', title: 'Paint', icon: ICONS.paint, icon16: ICONS.paint16, component: Paint, width: 800, height: 600 },
  calculator: { appId: 'calculator', title: 'Calculator', icon: ICONS.calculator, icon16: ICONS.calculator16, component: Calculator, width: 240, height: 340, resizable: false },
  ie: { appId: 'ie', title: 'Internet Explorer', icon: ICONS.ie, icon16: ICONS.ie16, component: InternetExplorer, width: 850, height: 600 },
  minesweeper: { appId: 'minesweeper', title: 'Minesweeper', icon: ICONS.minesweeper, icon16: ICONS.minesweeper, component: Minesweeper, width: 290, height: 380, resizable: false },
  cmd: { appId: 'cmd', title: 'Command Prompt', icon: ICONS.cmd, icon16: ICONS.cmd16, component: CommandPrompt, width: 680, height: 440 },
  controlPanel: { appId: 'controlPanel', title: 'Control Panel', icon: ICONS.controlPanel, icon16: ICONS.controlPanel16, component: ControlPanel, width: 750, height: 520 },
  recycleBin: { appId: 'recycleBin', title: 'Recycle Bin', icon: ICONS.recycleBinEmpty, icon16: ICONS.recycleBinEmpty, component: RecycleBin, width: 600, height: 400 },
  winamp: { appId: 'winamp', title: 'Winamp', icon: ICONS.winamp, icon16: ICONS.winamp, component: Winamp, width: 275, height: 580, resizable: false },
};

const DESKTOP_ICONS = [
  { id: 'myComputer', label: 'My Computer', icon: ICONS.myComputer, appId: 'myComputer' },
  { id: 'myDocuments', label: 'My Documents', icon: ICONS.myDocuments, appId: 'myDocuments' },
  { id: 'recycleBin', label: 'Recycle Bin', icon: ICONS.recycleBinEmpty, appId: 'recycleBin' },
  { id: 'ie', label: 'Internet Explorer', icon: ICONS.ie, appId: 'ie' },
  { id: 'notepad', label: 'Notepad', icon: ICONS.notepad, appId: 'notepad' },
  { id: 'cmd', label: 'Command Prompt', icon: ICONS.cmd, appId: 'cmd' },
  { id: 'winamp', label: 'Winamp', icon: ICONS.winamp, appId: 'winamp' },
];

export default function Desktop() {
  const { openWindow } = useWindowManager();
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [showBalloon, setShowBalloon] = useState(false);

  // Show welcome balloon after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setShowBalloon(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-hide balloon after 8 seconds
  useEffect(() => {
    if (!showBalloon) return;
    const timer = setTimeout(() => setShowBalloon(false), 8000);
    return () => clearTimeout(timer);
  }, [showBalloon]);

  const handleDoubleClick = useCallback((appId) => {
    const config = APP_REGISTRY[appId];
    if (config) openWindow(config);
  }, [openWindow]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <div
      className="absolute inset-0 bottom-[30px] overflow-hidden"
      style={{
        backgroundImage: `url(${WALLPAPER})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={() => { setSelectedIcon(null); closeContextMenu(); }}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Icons - vertical column flow */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: '4px',
        padding: '12px 8px',
        height: '100%',
      }}>
        {DESKTOP_ICONS.map(icon => (
          <div
            key={icon.id}
            className={`desktop-icon ${selectedIcon === icon.id ? 'selected' : ''}`}
            onClick={(e) => { e.stopPropagation(); setSelectedIcon(icon.id); }}
            onDoubleClick={() => handleDoubleClick(icon.appId)}
          >
            <img src={icon.icon} alt={icon.label} draggable={false} />
            <span>{icon.label}</span>
          </div>
        ))}
      </div>

      {/* Welcome Notification Balloon */}
      <AnimatePresence>
        {showBalloon && (
          <motion.div
            className="xp-notification-balloon notification-enter"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <button className="balloon-close" onClick={() => setShowBalloon(false)}>×</button>
            <div className="balloon-title">
              <img src={ICONS.help} alt="" style={{ width: 16, height: 16 }} />
              Welcome to Windows XP
            </div>
            <div>
              A faithful XP-inspired interface, custom-built to showcase my work and attention to detail.
            </div>
            <div style={{ marginTop: '6px' }}>
              Get Started: <a onClick={() => { handleDoubleClick('ie'); setShowBalloon(false); }}>My Projects</a> | <a onClick={() => { handleDoubleClick('myDocuments'); setShowBalloon(false); }}>About Me</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            className="xp-context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="xp-context-menu-item" onClick={() => { openWindow(APP_REGISTRY.notepad); closeContextMenu(); }}>
              New → Text Document
            </div>
            <div className="xp-context-menu-separator" />
            <div className="xp-context-menu-item" onClick={closeContextMenu}>
              Arrange Icons By →
            </div>
            <div className="xp-context-menu-item" onClick={closeContextMenu}>
              Refresh
            </div>
            <div className="xp-context-menu-separator" />
            <div className="xp-context-menu-item" onClick={() => { openWindow(APP_REGISTRY.controlPanel); closeContextMenu(); }}>
              Properties
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
