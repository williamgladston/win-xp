import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useWindowManager } from '../../contexts/WindowManager';

export default function Window({ windowData }) {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow, activeWindowId } = useWindowManager();
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const isActive = activeWindowId === windowData.id;
  const Component = windowData.component;

  const handleMouseDownTitleBar = useCallback((e) => {
    if (windowData.maximized) return;
    e.preventDefault();
    focusWindow(windowData.id);
    const rect = windowRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setIsDragging(true);
  }, [focusWindow, windowData.id, windowData.maximized]);

  const handleMouseDownResize = useCallback((e) => {
    if (windowData.maximized || !windowData.resizable) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(windowData.id);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: windowData.width,
      h: windowData.height,
    };
    setIsResizing(true);
  }, [focusWindow, windowData]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e) => {
      const x = e.clientX - dragOffset.current.x;
      const y = Math.max(0, e.clientY - dragOffset.current.y);
      moveWindow(windowData.id, x, y);
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, moveWindow, windowData.id]);

  useEffect(() => {
    if (!isResizing) return;
    const handleMove = (e) => {
      const w = Math.max(windowData.minWidth, resizeStart.current.w + (e.clientX - resizeStart.current.x));
      const h = Math.max(windowData.minHeight, resizeStart.current.h + (e.clientY - resizeStart.current.y));
      resizeWindow(windowData.id, w, h);
    };
    const handleUp = () => setIsResizing(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isResizing, resizeWindow, windowData]);

  if (windowData.minimized) return null;

  const style = windowData.maximized
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 30px)', zIndex: windowData.zIndex, borderRadius: 0 }
    : { top: windowData.y, left: windowData.x, width: windowData.width, height: windowData.height, zIndex: windowData.zIndex };

  // Get the 16px icon for titlebar (or fall back to main icon)
  const titleIcon = windowData.icon16 || windowData.icon;

  return (
    <div
      ref={windowRef}
      className="xp-window"
      style={style}
      onMouseDown={() => focusWindow(windowData.id)}
    >
      {/* Title bar */}
      <div
        className={`xp-titlebar ${isActive ? '' : 'inactive'}`}
        onMouseDown={handleMouseDownTitleBar}
        onDoubleClick={() => maximizeWindow(windowData.id)}
      >
        {titleIcon && (
          <img
            src={titleIcon}
            alt=""
            className="xp-title-icon"
            draggable={false}
          />
        )}
        <span className="truncate flex-1" style={{ fontSize: '12px' }}>{windowData.title}</span>
        <div className="xp-title-buttons">
          <button className="xp-title-btn" onClick={(e) => { e.stopPropagation(); minimizeWindow(windowData.id); }} title="Minimize">
            <svg width="8" height="2" viewBox="0 0 8 2"><rect width="8" height="2" fill="white"/></svg>
          </button>
          <button className="xp-title-btn" onClick={(e) => { e.stopPropagation(); maximizeWindow(windowData.id); }} title="Maximize">
            {windowData.maximized ? (
              <svg width="8" height="8" viewBox="0 0 8 8">
                <rect x="2" y="0" width="6" height="6" fill="none" stroke="white" strokeWidth="1.5"/>
                <rect x="0" y="2" width="6" height="6" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8">
                <rect width="8" height="8" fill="none" stroke="white" strokeWidth="1.5"/>
              </svg>
            )}
          </button>
          <button className="xp-title-btn close" onClick={(e) => { e.stopPropagation(); closeWindow(windowData.id); }} title="Close">
            <svg width="8" height="8" viewBox="0 0 8 8">
              <line x1="0" y1="0" x2="8" y2="8" stroke="white" strokeWidth="1.5"/>
              <line x1="8" y1="0" x2="0" y2="8" stroke="white" strokeWidth="1.5"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ background: 'var(--xp-window-bg)' }}>
        <Component windowId={windowData.id} {...windowData.props} />
      </div>

      {/* Resize handle */}
      {windowData.resizable && !windowData.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleMouseDownResize}
          style={{ zIndex: 1 }}
        />
      )}
    </div>
  );
}
