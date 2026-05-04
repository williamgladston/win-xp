import React from 'react';
import { useWindowManager } from '../../contexts/WindowManager';
import { APP_REGISTRY } from '../os/Desktop';

const CATEGORIES = [
  { icon: '🖥️', label: 'Display', description: 'Change wallpaper and theme' },
  { icon: '🖱️', label: 'Mouse', description: 'Configure mouse settings' },
  { icon: '🔊', label: 'Sounds', description: 'Change system sounds' },
  { icon: '🌐', label: 'Internet Options', description: 'Configure Internet settings' },
  { icon: '👤', label: 'User Accounts', description: 'Manage user accounts' },
  { icon: '📁', label: 'Folder Options', description: 'Configure folder views' },
  { icon: '🔒', label: 'Security Center', description: 'View security status' },
  { icon: '⏰', label: 'Date and Time', description: 'Set date and time' },
  { icon: '🔤', label: 'Fonts', description: 'View and install fonts' },
  { icon: '🖨️', label: 'Printers', description: 'View printers and faxes' },
  { icon: '📶', label: 'Network', description: 'Network connections' },
  { icon: '⚡', label: 'Power Options', description: 'Configure power settings' },
];

export default function ControlPanel() {
  const { openWindow } = useWindowManager();

  return (
    <div className="flex flex-col h-full">
      <div className="xp-menubar">
        <span className="xp-menubar-item">File</span>
        <span className="xp-menubar-item">Edit</span>
        <span className="xp-menubar-item">View</span>
        <span className="xp-menubar-item">Favorites</span>
        <span className="xp-menubar-item">Tools</span>
        <span className="xp-menubar-item">Help</span>
      </div>

      <div className="xp-toolbar">
        <div className="flex-1">
          <div className="bg-white border border-gray-400 px-2 py-1 text-xs rounded-sm">
            📁 Control Panel
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Side panel */}
        <div className="w-[200px] p-3 overflow-y-auto border-r" style={{ background: 'linear-gradient(180deg, #6B9CD4 0%, #4978B0 100%)' }}>
          <div className="bg-white/90 rounded-lg p-2 mb-2">
            <div className="font-bold text-xs mb-1 text-blue-800">Control Panel</div>
            <div className="text-xs text-gray-600">
              Pick a category to view or change settings.
            </div>
          </div>
          <div className="bg-white/90 rounded-lg p-2">
            <div className="font-bold text-xs mb-1 text-blue-800">See Also</div>
            <div
              className="text-xs text-blue-600 hover:underline cursor-pointer"
              onClick={() => openWindow(APP_REGISTRY.myComputer)}
            >
              My Computer
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 bg-white p-4 overflow-auto">
          <h2 className="text-sm font-bold text-blue-900 mb-3">Pick a category</h2>
          <div className="grid grid-cols-3 gap-4">
            {CATEGORIES.map(cat => (
              <div
                key={cat.label}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors group"
              >
                <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-xs font-bold text-blue-800 text-center">{cat.label}</span>
                <span className="text-[10px] text-gray-500 text-center">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#ECE9D8] border-t border-gray-300 px-3 py-1 text-xs text-gray-600">
        {CATEGORIES.length} objects
      </div>
    </div>
  );
}
