import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../contexts/FileSystem';
import { useWindowManager } from '../../contexts/WindowManager';

export default function Notepad({ windowId, filePath }) {
  const { readFile, writeFile } = useFileSystem();
  const { updateTitle } = useWindowManager();
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('Untitled');
  const [wordWrap, setWordWrap] = useState(true);
  const [modified, setModified] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (filePath) {
      const data = readFile(filePath);
      if (data !== null) {
        setContent(data);
        const name = filePath.split('/').pop();
        setFileName(name);
        updateTitle(windowId, `${name} - Notepad`);
      }
    }
  }, [filePath]);

  const handleChange = (e) => {
    setContent(e.target.value);
    setModified(true);
  };

  const handleNew = () => {
    setContent('');
    setFileName('Untitled');
    setModified(false);
    updateTitle(windowId, 'Untitled - Notepad');
  };

  const handleSave = () => {
    if (filePath) {
      writeFile(filePath, content);
      setModified(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Menu bar */}
      <div className="xp-menubar">
        <div className="xp-menubar-item group relative">
          File
          <div className="hidden group-hover:block absolute top-full left-0 xp-context-menu z-50">
            <div className="xp-context-menu-item" onClick={handleNew}>New</div>
            <div className="xp-context-menu-item" onClick={handleSave}>Save</div>
            <div className="xp-context-menu-separator" />
            <div className="xp-context-menu-item">Exit</div>
          </div>
        </div>
        <div className="xp-menubar-item group relative">
          Edit
          <div className="hidden group-hover:block absolute top-full left-0 xp-context-menu z-50">
            <div className="xp-context-menu-item" onClick={() => document.execCommand('undo')}>Undo</div>
            <div className="xp-context-menu-separator" />
            <div className="xp-context-menu-item" onClick={() => document.execCommand('cut')}>Cut</div>
            <div className="xp-context-menu-item" onClick={() => document.execCommand('copy')}>Copy</div>
            <div className="xp-context-menu-item" onClick={() => document.execCommand('paste')}>Paste</div>
            <div className="xp-context-menu-item" onClick={() => document.execCommand('selectAll')}>Select All</div>
          </div>
        </div>
        <div className="xp-menubar-item group relative">
          Format
          <div className="hidden group-hover:block absolute top-full left-0 xp-context-menu z-50">
            <div className="xp-context-menu-item" onClick={() => setWordWrap(!wordWrap)}>
              {wordWrap ? '✓ ' : '  '}Word Wrap
            </div>
          </div>
        </div>
        <div className="xp-menubar-item" onClick={() => setShowAbout(true)}>Help</div>
      </div>

      {/* Text area */}
      <textarea
        className="flex-1 p-1 resize-none outline-none text-xs border-none bg-white"
        style={{
          fontFamily: 'Lucida Console, Courier New, monospace',
          whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
          overflowWrap: wordWrap ? 'break-word' : 'normal',
          overflowX: wordWrap ? 'hidden' : 'auto',
        }}
        value={content}
        onChange={handleChange}
        spellCheck={false}
      />

      {/* Status bar */}
      <div className="bg-[#ECE9D8] border-t border-gray-300 px-3 py-1 text-xs text-gray-600 flex justify-between">
        <span>{modified ? 'Modified' : ''}</span>
        <span>Ln 1, Col 1</span>
      </div>

      {/* About Dialog */}
      {showAbout && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-[#ECE9D8] border-2 border-[#0055E5] rounded p-4 w-[260px] shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">📝</span>
              <div>
                <div className="font-bold text-sm">Notepad</div>
                <div className="text-xs text-gray-600">Version 5.1 (XP Portfolio Edition)</div>
              </div>
            </div>
            <button className="xp-button w-full" onClick={() => setShowAbout(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
