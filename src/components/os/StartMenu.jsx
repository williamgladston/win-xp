import React from 'react';
import { motion } from 'framer-motion';
import { useWindowManager } from '../../contexts/WindowManager';
import { APP_REGISTRY } from './Desktop';
import ICONS from '../../data/iconMap';

const LEFT_PINNED = [
  { label: 'Internet Explorer', sublabel: 'Browse the Web', icon: ICONS.ie, appId: 'ie' },
  { label: 'Outlook Express', sublabel: 'Send a message', icon: ICONS.outlookExpress, appId: 'ie' },
];

const LEFT_FREQUENT = [
  { label: 'Winamp', icon: ICONS.winamp, appId: 'winamp' },
  { label: 'Notepad', icon: ICONS.notepad, appId: 'notepad' },
  { label: 'Paint', icon: ICONS.paint, appId: 'paint' },
  { label: 'Command Prompt', icon: ICONS.cmd, appId: 'cmd' },
];

const ALL_PROGRAMS = [
  { label: 'Accessories', icon: ICONS.folder, children: [
    { label: 'Calculator', icon: ICONS.calculator, appId: 'calculator' },
    { label: 'Command Prompt', icon: ICONS.cmd, appId: 'cmd' },
    { label: 'Notepad', icon: ICONS.notepad, appId: 'notepad' },
    { label: 'Paint', icon: ICONS.paint, appId: 'paint' },
  ]},
  { label: 'Games', icon: ICONS.folder, children: [
    { label: 'Minesweeper', icon: ICONS.minesweeper, appId: 'minesweeper' },
  ]},
  { label: 'Entertainment', icon: ICONS.folder, children: [
    { label: 'Winamp', icon: ICONS.winamp, appId: 'winamp' },
    { label: 'Windows Media Player', icon: ICONS.mediaPlayer, appId: 'winamp' },
  ]},
  { label: 'Internet Explorer', icon: ICONS.ie, appId: 'ie' },
];

const RIGHT_ITEMS = [
  { label: 'My Documents', icon: ICONS.myDocuments, appId: 'myDocuments', bold: true },
  { label: 'My Pictures', icon: ICONS.myPictures, appId: 'myDocuments', bold: true },
  { label: 'My Music', icon: ICONS.minesweeper, appId: 'myDocuments', bold: true },
  { label: 'My Computer', icon: ICONS.myComputer, appId: 'myComputer', bold: true },
  { separator: true },
  { label: 'Control Panel', icon: ICONS.controlPanel, appId: 'controlPanel' },
  { label: 'Help and Support', icon: ICONS.help, appId: 'ie' },
  { label: 'Search', icon: ICONS.search, appId: 'ie' },
];

export default function StartMenu({ onClose }) {
  const { openWindow } = useWindowManager();
  const [expandedProgram, setExpandedProgram] = React.useState(null);
  const [showAllPrograms, setShowAllPrograms] = React.useState(false);

  const launchApp = (appId) => {
    const config = APP_REGISTRY[appId];
    if (config) openWindow(config);
    onClose();
  };

  return (
    <motion.div
      className="xp-start-menu"
      initial={{ opacity: 0, y: 20, scaleY: 0.9 }}
      animate={{ opacity: 1, y: 0, scaleY: 1 }}
      exit={{ opacity: 0, y: 10, scaleY: 0.95 }}
      transition={{ duration: 0.15 }}
      style={{ transformOrigin: 'bottom left' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header - User */}
      <div className="xp-start-menu-header">
        <img src={ICONS.userAvatar} alt="User" />
        <span>William</span>
      </div>

      {/* Content */}
      <div className="flex flex-1 min-h-[340px]">
        {/* Left column */}
        <div className="flex-1 flex flex-col" style={{ borderRight: '1px solid #D6D2C2' }}>
          {!showAllPrograms ? (
            <>
              {/* Pinned items */}
              <div className="py-1 px-1">
                {LEFT_PINNED.map(item => (
                  <div
                    key={item.appId + item.label}
                    className="xp-start-menu-item"
                    onClick={() => launchApp(item.appId)}
                  >
                    <img src={item.icon} alt="" />
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '11px' }}>{item.label}</div>
                      {item.sublabel && <div style={{ fontSize: '10px', color: '#888' }}>{item.sublabel}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="xp-context-menu-separator" style={{ margin: '2px 8px' }} />

              {/* Frequent items */}
              <div className="flex-1 py-1 px-1">
                {LEFT_FREQUENT.map(item => (
                  <div
                    key={item.appId + item.label}
                    className="xp-start-menu-item"
                    onClick={() => launchApp(item.appId)}
                  >
                    <img src={item.icon} alt="" />
                    <span style={{ fontSize: '11px' }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* All Programs button */}
              <div className="xp-context-menu-separator" style={{ margin: '2px 8px' }} />
              <div
                className="xp-start-menu-item"
                style={{ padding: '6px 12px', fontWeight: 'bold' }}
                onClick={() => setShowAllPrograms(true)}
              >
                <span style={{ flex: 1, fontSize: '11px' }}>All Programs</span>
                <span style={{ color: '#398E3D', fontSize: '12px', fontWeight: 'bold' }}>▶</span>
              </div>
            </>
          ) : (
            /* All Programs view */
            <div className="py-1 px-1 overflow-y-auto flex-1">
              <div
                className="xp-start-menu-item"
                style={{ fontWeight: 'bold', fontSize: '11px' }}
                onClick={() => setShowAllPrograms(false)}
              >
                <span>◀ Back</span>
              </div>
              <div className="xp-context-menu-separator" style={{ margin: '2px 4px' }} />
              {ALL_PROGRAMS.map((item, i) => (
                <div key={i} className="relative">
                  <div
                    className="xp-start-menu-item small"
                    onClick={() => item.children ? setExpandedProgram(expandedProgram === i ? null : i) : launchApp(item.appId)}
                    onMouseEnter={() => item.children && setExpandedProgram(i)}
                  >
                    <img src={item.icon} alt="" style={{ width: 24, height: 24 }} />
                    <span style={{ flex: 1, fontSize: '11px' }}>{item.label}</span>
                    {item.children && <span>▶</span>}
                  </div>
                  {/* Submenu */}
                  {item.children && expandedProgram === i && (
                    <div
                      className="xp-context-menu absolute left-full top-0"
                      style={{ minWidth: '180px', position: 'absolute' }}
                    >
                      {item.children.map(child => (
                        <div
                          key={child.appId}
                          className="xp-context-menu-item flex items-center gap-2 py-1"
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}
                          onClick={() => launchApp(child.appId)}
                        >
                          <img src={child.icon} alt="" style={{ width: 16, height: 16 }} />
                          <span style={{ fontSize: '11px' }}>{child.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="py-1" style={{ width: '170px', background: '#D3E5FA' }}>
          {RIGHT_ITEMS.map((item, i) => {
            if (item.separator) {
              return <div key={i} className="xp-context-menu-separator" style={{ margin: '3px 8px' }} />;
            }
            return (
              <div
                key={item.label}
                className="xp-start-menu-right-item"
                style={{ fontWeight: item.bold ? 'bold' : 'normal' }}
                onClick={() => launchApp(item.appId)}
              >
                <img src={item.icon} alt="" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="xp-start-menu-footer">
        <button onClick={onClose}>
          <img src={ICONS.logoff} alt="" />
          Log Off
        </button>
        <button onClick={onClose}>
          <img src={ICONS.shutdown} alt="" />
          Shut Down
        </button>
      </div>
    </motion.div>
  );
}
