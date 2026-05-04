import React, { useState, useCallback } from 'react';
import { useWindowManager } from '../../contexts/WindowManager';
import { portfolioProjects } from '../../data/fileSystem';
import ICONS from '../../data/iconMap';

const PAGES = {
  home: {
    url: 'https://www.william.dev',
    title: 'William - Portfolio',
  },
  projects: {
    url: 'https://www.william.dev/projects',
    title: 'My Projects',
  },
  about: {
    url: 'https://www.william.dev/about',
    title: 'About Me',
  },
  contact: {
    url: 'https://www.william.dev/contact',
    title: 'Contact',
  },
};

export default function InternetExplorer({ windowId }) {
  const { updateTitle } = useWindowManager();
  const [currentPage, setCurrentPage] = useState('home');
  const [address, setAddress] = useState(PAGES.home.url);
  const [history, setHistory] = useState(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = useCallback((pageId) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(pageId);
      setAddress(PAGES[pageId]?.url || address);
      setHistory(prev => [...prev.slice(0, historyIndex + 1), pageId]);
      setHistoryIndex(prev => prev + 1);
      if (updateTitle) updateTitle(windowId, `${PAGES[pageId]?.title || pageId} - Internet Explorer`);
      setIsLoading(false);
    }, 300);
  }, [historyIndex, windowId, updateTitle, address]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const pageId = history[newIndex];
      setCurrentPage(pageId);
      setAddress(PAGES[pageId]?.url || '');
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const pageId = history[newIndex];
      setCurrentPage(pageId);
      setAddress(PAGES[pageId]?.url || '');
    }
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const pageKey = Object.keys(PAGES).find(k => PAGES[k].url === address);
    if (pageKey) navigateTo(pageKey);
  };

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
        <button className="xp-toolbar-btn" onClick={() => setIsLoading(false)}>
          <img src={ICONS.stop} alt="Stop" />
        </button>
        <button className="xp-toolbar-btn" onClick={() => navigateTo(currentPage)}>
          <img src={ICONS.refresh} alt="Refresh" />
        </button>
        <button className="xp-toolbar-btn" onClick={() => navigateTo('home')}>
          <img src={ICONS.home} alt="Home" />
          <span>Home</span>
        </button>
        <div className="xp-toolbar-separator" />
        <button className="xp-toolbar-btn">
          <img src={ICONS.favorites} alt="Favorites" />
          <span>Favorites</span>
        </button>
        <button className="xp-toolbar-btn">
          <img src={ICONS.history} alt="History" />
          <span>History</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="xp-toolbar" style={{ gap: '4px' }}>
        <div className="xp-address-bar">
          <span className="address-label">Address</span>
          <form onSubmit={handleAddressSubmit} className="address-input" style={{ display: 'flex', flex: 1 }}>
            <img src={ICONS.ie16} alt="" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '11px', fontFamily: 'Tahoma', background: 'transparent' }}
            />
          </form>
        </div>
        <button className="xp-toolbar-btn" onClick={handleAddressSubmit}>
          <span>Go</span>
        </button>
      </div>

      {/* Loading bar */}
      {isLoading && (
        <div style={{ height: '2px', background: 'linear-gradient(90deg, #0055E5, #3C8CF8)', animation: 'boot-slide 1s infinite' }} />
      )}

      {/* Page Content */}
      <div className="flex-1 overflow-auto bg-white">
        {currentPage === 'home' && (
          <div style={{ padding: '30px', maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#003399', marginBottom: '8px' }}>
                Welcome to William's Portfolio
              </h1>
              <p style={{ color: '#666', fontSize: '13px' }}>
                Full-Stack Developer • Creative Technologist
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {['projects', 'about', 'contact'].map(page => (
                <button
                  key={page}
                  className="xp-button"
                  style={{ padding: '8px 20px', fontSize: '12px', fontWeight: 'bold' }}
                  onClick={() => navigateTo(page)}
                >
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '30px', padding: '16px', background: '#F0F0FF', border: '1px solid #CCC', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#003399' }}>Featured Projects</h3>
              {portfolioProjects.slice(0, 3).map(p => (
                <div key={p.id} style={{ padding: '8px 0', borderBottom: '1px solid #DDD' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '12px', color: '#0055AA', cursor: 'pointer' }}
                    onClick={() => navigateTo('projects')}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'projects' && (
          <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#003399', marginBottom: '16px' }}>My Projects</h2>
            {portfolioProjects.map(p => (
              <div key={p.id} style={{ padding: '12px', marginBottom: '10px', background: '#FAFAFA', border: '1px solid #DDD', borderRadius: '4px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#003399' }}>{p.title}</h3>
                <p style={{ fontSize: '11px', color: '#555', margin: '4px 0' }}>{p.description}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {p.tech.map(t => (
                    <span key={t} style={{ fontSize: '10px', padding: '2px 6px', background: '#E8F0FE', color: '#1A73E8', borderRadius: '3px' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentPage === 'about' && (
          <div style={{ padding: '30px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#003399', marginBottom: '16px' }}>About Me</h2>
            <p style={{ fontSize: '12px', lineHeight: '1.8', color: '#333' }}>
              Hi! I'm William, a passionate full-stack developer with a love for creating
              unique and interactive web experiences. This Windows XP portfolio is a testament
              to my attention to detail and love for nostalgic computing.
            </p>
            <div style={{ marginTop: '20px', padding: '12px', background: '#F8F8FF', border: '1px solid #DDD', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: '#003399', marginBottom: '8px' }}>Skills</h3>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['React', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'GSAP', 'Framer Motion'].map(s => (
                  <span key={s} style={{ fontSize: '10px', padding: '3px 8px', background: '#E8F0FE', color: '#1A73E8', borderRadius: '3px' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'contact' && (
          <div style={{ padding: '30px', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#003399', marginBottom: '16px' }}>Contact Me</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px', background: '#F8F8FF', border: '1px solid #DDD', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Email</div>
                <div style={{ fontSize: '11px', color: '#0055AA' }}>hello@william.dev</div>
              </div>
              <div style={{ padding: '10px', background: '#F8F8FF', border: '1px solid #DDD', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>GitHub</div>
                <div style={{ fontSize: '11px', color: '#0055AA' }}>github.com/william</div>
              </div>
              <div style={{ padding: '10px', background: '#F8F8FF', border: '1px solid #DDD', borderRadius: '4px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>LinkedIn</div>
                <div style={{ fontSize: '11px', color: '#0055AA' }}>linkedin.com/in/william</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="xp-status-bar">
        <span className="status-section">
          <img src={ICONS.ie16} alt="" style={{ width: 14, height: 14, verticalAlign: 'middle', marginRight: 4 }} />
          {isLoading ? 'Loading...' : 'Done'}
        </span>
        <span style={{ marginLeft: 'auto' }}>Internet</span>
      </div>
    </div>
  );
}
