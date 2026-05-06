import React, { useState, useCallback } from 'react';
import { useWindowManager } from '../../contexts/WindowManager';
import { portfolioProjects } from '../../data/fileSystem';
import ICONS from '../../data/iconMap';

const PAGES = {
  home: {
    url: 'https://williamgladston.github.io/win-xp/',
    title: 'William - Portfolio',
  },
  projects: {
    url: 'https://williamgladston.github.io/win-xp/#projects',
    title: 'My Projects',
  },
  about: {
    url: 'https://williamgladston.github.io/win-xp/#about',
    title: 'About Me',
  },
  contact: {
    url: 'https://williamgladston.github.io/win-xp/#contact',
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
      
      {/* Toolbar (unchanged) */}
      <div className="xp-toolbar">
        <button onClick={goBack} disabled={historyIndex <= 0}>
          <img src={ICONS.back} alt="Back" /> Back
        </button>
        <button onClick={goForward} disabled={historyIndex >= history.length - 1}>
          <img src={ICONS.forward} alt="Forward" />
        </button>
        <button onClick={() => navigateTo(currentPage)}>
          <img src={ICONS.refresh} alt="Refresh" />
        </button>
        <button onClick={() => navigateTo('home')}>
          <img src={ICONS.home} alt="Home" /> Home
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">

        {/* HOME */}
        {currentPage === 'home' && (
          <div style={{ padding: 30 }}>
            <h1>Welcome to William's Portfolio</h1>
            <p>Full-Stack Developer</p>

            <h3 style={{ marginTop: 20 }}>Featured Projects</h3>
            {portfolioProjects.slice(0, 3).map(p => (
              <div key={p.id} style={{ marginTop: 10 }}>
                <b onClick={() => navigateTo('projects')} style={{ cursor: 'pointer', color: 'blue' }}>
                  {p.title}
                </b>
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS */}
        {currentPage === 'projects' && (
          <div style={{ padding: 20, maxWidth: 750, margin: '0 auto' }}>
            <h2>My Projects</h2>

            {portfolioProjects.map(p => (
              <div key={p.id} style={{ marginBottom: 20, border: '1px solid #ccc', padding: 12 }}>

                {/* Title + Links */}
                <h3>
                  {p.title} | {p.tech.join(', ')} |{' '}
                  <a href={p.github} target="_blank">GitHub</a> |{' '}
                  <a href={p.live} target="_blank">Live</a>
                </h3>

                {/* Bullet Points */}
                <ul>
                  {p.points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>

              </div>
            ))}
          </div>
        )}

        {/* ABOUT */}
        {currentPage === 'about' && (
          <div style={{ padding: 30 }}>
            <h2>About Me</h2>
            <p>
              I'm a full-stack developer focused on building scalable systems,
              real-time applications, and AI-powered tools.
            </p>
          </div>
        )}

        {/* CONTACT */}
        {currentPage === 'contact' && (
          <div style={{ padding: 30 }}>
            <h2>Contact</h2>
            <p>Email: williamgladston4@gmail.com</p>
            <p>GitHub: github.com/williamgladston</p>
            <p>Portfolio: williamgladston.github.io/win-xp</p>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="xp-status-bar">
        {isLoading ? 'Loading...' : 'Done'}
      </div>
    </div>
  );
}
