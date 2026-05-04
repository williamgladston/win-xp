import React from 'react';
import { useFileSystem } from '../../contexts/FileSystem';

export default function RecycleBin() {
  const { recycleBin, emptyRecycleBin } = useFileSystem();

  return (
    <div className="flex flex-col h-full">
      <div className="xp-menubar">
        <span className="xp-menubar-item">File</span>
        <span className="xp-menubar-item">Edit</span>
        <span className="xp-menubar-item">View</span>
        <span className="xp-menubar-item">Help</span>
      </div>

      <div className="xp-toolbar">
        {recycleBin.length > 0 && (
          <button className="xp-button text-xs" onClick={emptyRecycleBin}>
            🗑️ Empty Recycle Bin
          </button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Side panel */}
        <div className="w-[180px] p-3 overflow-y-auto border-r" style={{ background: 'linear-gradient(180deg, #6B9CD4 0%, #4978B0 100%)' }}>
          <div className="bg-white/90 rounded-lg p-2">
            <div className="font-bold text-xs mb-1 text-blue-800">Recycle Bin Tasks</div>
            {recycleBin.length > 0 && (
              <div
                className="text-xs text-blue-600 hover:underline cursor-pointer"
                onClick={emptyRecycleBin}
              >
                Empty the Recycle Bin
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white p-2 overflow-auto">
          {recycleBin.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-4xl mb-2">🗑️</span>
              <span className="text-xs">Recycle Bin is empty</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-300 text-xs font-bold text-gray-600">
                <span className="flex-1">Name</span>
                <span className="w-[120px]">Original Location</span>
                <span className="w-[80px]">Type</span>
              </div>
              {recycleBin.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1 hover:bg-blue-100 text-xs cursor-pointer">
                  <span className="flex-1 flex items-center gap-1">
                    <span>{item.icon || '📄'}</span>
                    {item.name}
                  </span>
                  <span className="w-[120px] text-gray-500 truncate">{item.path}</span>
                  <span className="w-[80px] text-gray-500">{item.type === 'folder' ? 'Folder' : 'File'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#ECE9D8] border-t border-gray-300 px-3 py-1 text-xs text-gray-600">
        {recycleBin.length} object(s)
      </div>
    </div>
  );
}
