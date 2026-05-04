import React, { useState, useCallback } from 'react';
import { useFileSystem } from '../../contexts/FileSystem';
import { useWindowManager } from '../../contexts/WindowManager';
import { APP_REGISTRY } from '../os/Desktop';
import ICONS, { getFileIcon } from '../../data/iconMap';

export default function MyComputer({ windowId, startPath }) {
  const { listDir, getNode } = useFileSystem();
  const { openWindow, updateTitle } = useWindowManager();
  const [currentPath, setCurrentPath] = useState(startPath || '/');
  const [history, setHistory] = useState([startPath || '/']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState('icons'); // icons, list, details
  const [selectedItem, setSelectedItem] = useState(null);

  const items = listDir(currentPath);
  const currentNode = getNode(currentPath);

  const navigate = useCallback((path) => {
    setCurrentPath(path);
    setSelectedItem(null);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), path]);
    setHistoryIndex(prev => prev + 1);
    if (updateTitle) {
      const name = path === '/' ? 'My Computer' : path.split('/').pop();
      updateTitle(windowId, name);
    }
  }, [historyIndex, windowId, updateTitle]);

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  };

  const goUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    navigate('/' + parts.join('/'));
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      navigate(newPath);
    } else if (item.type === 'file') {
      const config = APP_REGISTRY.notepad;
      openWindow({
        ...config,
        title: `${item.name} - Notepad`,
        props: { filePath: currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}` },
      });
    }
  };

  const getItemIcon = (item) => {
    if (item.icon) return item.icon;
    if (item.type === 'folder') return ICONS.folder;
    return ICONS.file16;
  };

  const pathParts = currentPath.split('/').filter(Boolean);

  return (
    <div className="flex flex-col h-full" style={{ background: '#ECE9D8' }}>
      {/* Menu Bar */}
      <div className="xp-menubar">
        <span className="xp-menubar-item">File</span>
        <span className="xp-menubar-item">Edit</span>
        <span className="xp-menubar-item">View</span>
        <span className="xp-menubar-item">Favorites</span>
        <span className="xp-menubar-item">Tools</span>
        <span className="xp-menubar-item">Help</span>
      </div>

      {/* Toolbar */}
      <div className="xp-toolbar">
        <button className="xp-toolbar-btn" onClick={goBack} disabled={historyIndex <= 0}>
          <img src={ICONS.back} alt="Back" />
          <span>Back</span>
        </button>
        <button className="xp-toolbar-btn" onClick={goForward} disabled={historyIndex >= history.length - 1}>
          <img src={ICONS.forward} alt="Forward" />
        </button>
        <button className="xp-toolbar-btn" onClick={goUp} disabled={currentPath === '/'}>
          <img src={ICONS.up} alt="Up" />
        </button>
        <div className="xp-toolbar-separator" />
        <button className="xp-toolbar-btn">
          <img src={ICONS.search} alt="Search" />
          <span>Search</span>
        </button>
        <button className="xp-toolbar-btn">
          <img src={ICONS.folder} alt="Folders" style={{ width: 16, height: 16 }} />
          <span>Folders</span>
        </button>
        <div className="xp-toolbar-separator" />
        {/* View mode buttons */}
        <button
          className="xp-toolbar-btn"
          onClick={() => setViewMode(v => v === 'icons' ? 'list' : v === 'list' ? 'details' : 'icons')}
          title={`View: ${viewMode}`}
        >
          <span style={{ fontSize: '10px' }}>
            {viewMode === 'icons' ? '⊞' : viewMode === 'list' ? '≡' : '☰'}
          </span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="xp-toolbar" style={{ gap: '4px' }}>
        <div className="xp-address-bar">
          <span className="address-label">Address</span>
          <div className="address-input">
            <img src={currentPath === '/' ? ICONS.myComputer16 : ICONS.folderSmall} alt="" />
            <input
              type="text"
              value={currentPath === '/' ? 'My Computer' : `C:\\${pathParts.join('\\')}`}
              readOnly
            />
          </div>
        </div>
        <button className="xp-toolbar-btn">
          <span>Go</span>
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side Panel */}
        <div className="xp-side-panel hidden md:block">
          <div className="xp-side-panel-section">
            <div className="section-title">
              <img src={ICONS.myComputer16} alt="" style={{ width: 16, height: 16 }} />
              System Tasks
            </div>
            <div className="section-link" onClick={() => navigate('/')}>
              <span>View system information</span>
            </div>
            <div className="section-link">
              <span>Add or remove programs</span>
            </div>
            <div className="section-link">
              <span>Change a setting</span>
            </div>
          </div>

          <div className="xp-side-panel-section">
            <div className="section-title">
              <img src={ICONS.folderSmall} alt="" style={{ width: 16, height: 16 }} />
              Other Places
            </div>
            <div className="section-link" onClick={() => navigate('/My Documents')}>
              <span>My Documents</span>
            </div>
            <div className="section-link" onClick={() => navigate('/')}>
              <span>My Computer</span>
            </div>
            <div className="section-link" onClick={() => navigate('/My Documents')}>
              <span>Shared Documents</span>
            </div>
          </div>
        </div>

        {/* File listing */}
        <div className="flex-1 overflow-auto bg-white p-2" onClick={() => setSelectedItem(null)}>
          {/* Computer root view */}
          {currentPath === '/' && (
            <>
              <div style={{ color: '#777', fontSize: '11px', margin: '4px 0 8px 4px' }}>
                Hard Disk Drives
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <div
                  className={`desktop-icon ${selectedItem === '__c_drive' ? 'selected' : ''}`}
                  style={{ width: '110px' }}
                  onClick={(e) => { e.stopPropagation(); setSelectedItem('__c_drive'); }}
                  onDoubleClick={() => navigate('/My Documents')}
                >
                  <img src={ICONS.hardDrive} alt="" style={{ width: 32, height: 32 }} />
                  <span style={{ color: '#000', textShadow: 'none', fontSize: '11px' }}>Local Disk (C:)</span>
                </div>
              </div>
              <div style={{ color: '#777', fontSize: '11px', margin: '4px 0 8px 4px' }}>
                Files Stored on This Computer
              </div>
            </>
          )}

          {/* Items */}
          <div className={
            viewMode === 'icons' ? 'flex flex-wrap gap-1' :
            viewMode === 'list' ? 'flex flex-col gap-0' :
            'flex flex-col gap-0'
          }>
            {viewMode === 'details' && (
              <div className="flex items-center gap-2 px-2 py-1 bg-[#ECE9D8] border-b border-[#ACA899] text-xs font-bold select-none">
                <span style={{ width: '24px' }}></span>
                <span style={{ width: '200px' }}>Name</span>
                <span style={{ width: '80px' }}>Size</span>
                <span style={{ width: '100px' }}>Type</span>
                <span style={{ width: '140px' }}>Date Modified</span>
              </div>
            )}
            {items.map(item => {
              const icon = getItemIcon(item);
              const isSelected = selectedItem === item.name;

              if (viewMode === 'icons') {
                return (
                  <div
                    key={item.name}
                    className={`desktop-icon ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                  >
                    <img src={icon} alt="" style={{ width: 32, height: 32 }} />
                    <span style={{ color: '#000', textShadow: 'none', fontSize: '11px' }}>{item.name}</span>
                  </div>
                );
              }

              return (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 px-2 py-0.5 cursor-pointer text-xs ${isSelected ? 'bg-[#316AC5] text-white' : 'hover:bg-[#EBE8D6]'}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedItem(item.name); }}
                  onDoubleClick={() => handleItemDoubleClick(item)}
                >
                  <img src={icon} alt="" style={{ width: 16, height: 16 }} />
                  <span style={{ width: '200px' }} className="truncate">{item.name}</span>
                  {viewMode === 'details' && (
                    <>
                      <span style={{ width: '80px' }}>{item.type === 'file' ? '1 KB' : ''}</span>
                      <span style={{ width: '100px' }}>{item.type === 'folder' ? 'File Folder' : 'Text Document'}</span>
                      <span style={{ width: '140px' }}>4/4/2026 8:00 AM</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center text-[#888] mt-8" style={{ fontSize: '11px' }}>
              This folder is empty.
            </div>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="xp-status-bar">
        <span className="status-section">{items.length} object(s)</span>
        <span>{selectedItem ? `"${selectedItem}" selected` : ''}</span>
      </div>
    </div>
  );
}
