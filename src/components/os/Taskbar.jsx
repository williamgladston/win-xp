import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../contexts/WindowManager';
import ICONS from '../../data/iconMap';

export default function Taskbar({ onStartClick, startMenuOpen }) {
  const { windows, activeWindowId, focusWindow, minimizeWindow } = useWindowManager();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTaskbarBtnClick = (windowId) => {
    if (activeWindowId === windowId) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <div className="xp-taskbar">
      {/* Start Button - uses pre-rendered start.png image */}
      <button
        className={`xp-start-btn ${startMenuOpen ? 'active' : ''}`}
        onClick={onStartClick}
      >
        <img src={ICONS.startBtn} alt="start" draggable={false} />
      </button>

      {/* Quick Launch */}
      <div className="xp-quick-launch">
        <button title="Show Desktop">
          <img src={ICONS.myComputer16} alt="Desktop" />
        </button>
        <button title="Internet Explorer">
          <img src={ICONS.ie16} alt="IE" />
        </button>
        <button title="Windows Media Player">
          <img src={ICONS.mediaPlayer} alt="Media" style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Running Windows */}
      <div className="flex items-center gap-1 flex-1 px-1 overflow-hidden">
        {windows.map(win => (
          <button
            key={win.id}
            className={`xp-taskbar-btn ${activeWindowId === win.id && !win.minimized ? 'active' : ''}`}
            onClick={() => handleTaskbarBtnClick(win.id)}
          >
            {win.icon && <img src={win.icon} alt="" />}
            <span className="truncate text-xs">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="xp-systray">
        <img src={ICONS.network} alt="Network" title="Network" style={{ width: 16, height: 16 }} />
        <img src={ICONS.mediaPlayer} alt="Volume" title="Volume" style={{ width: 16, height: 16 }} />
        <span className="font-bold">{timeStr}</span>
      </div>
    </div>
  );
}
