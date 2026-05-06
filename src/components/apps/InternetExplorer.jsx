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
      if (updateTitle) updateTitle(windowId, `${PAGES[pageId]?.title || pageId} - Microsoft Internet Explorer`);
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
    <div className="ie-container">

      {/* ========== MENU BAR ========== */}
      <div className="ie-menubar">
        <span className="ie-menubar-item">File</span>
        <span className="ie-menubar-item">Edit</span>
        <span className="ie-menubar-item">View</span>
        <span className="ie-menubar-item">Favorites</span>
        <span className="ie-menubar-item">Tools</span>
        <span className="ie-menubar-item">Help</span>
      </div>

      {/* ========== TOOLBAR ========== */}
      <div className="ie-toolbar">
        {/* Back */}
        <button
          className="ie-toolbar-btn ie-nav-btn"
          onClick={goBack}
          disabled={historyIndex <= 0}
        >
          <img src={ICONS.back} alt="Back" />
          <span>Back</span>
          <span className="ie-nav-dropdown">▾</span>
        </button>

        {/* Forward */}
        <button
          className="ie-toolbar-btn ie-nav-btn"
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
        >
          <img src={ICONS.forward} alt="Forward" />
        </button>

        <div className="ie-toolbar-separator" />

        {/* Stop */}
        <button className="ie-toolbar-btn" disabled={!isLoading}>
          <img src={ICONS.stop} alt="Stop" />
        </button>

        {/* Refresh */}
        <button className="ie-toolbar-btn" onClick={() => navigateTo(currentPage)}>
          <img src={ICONS.refresh} alt="Refresh" />
        </button>

        {/* Home */}
        <button className="ie-toolbar-btn" onClick={() => navigateTo('home')}>
          <img src={ICONS.home} alt="Home" />
        </button>

        <div className="ie-toolbar-separator" />

        {/* Search */}
        <button className="ie-toolbar-btn">
          <img src={ICONS.search} alt="Search" />
          <span>Search</span>
        </button>

        {/* Favorites */}
        <button className="ie-toolbar-btn">
          <img src={ICONS.favorites} alt="Favorites" />
          <span>Favorites</span>
        </button>

        {/* History */}
        <button className="ie-toolbar-btn">
          <img src={ICONS.history} alt="History" />
        </button>

        <div className="ie-toolbar-separator" />

        {/* Mail */}
        <button className="ie-toolbar-btn">
          <img src={ICONS.outlookExpress} alt="Mail" style={{ width: 20, height: 20 }} />
        </button>

        {/* IE throbber (animated logo) */}
        <div className="ie-throbber">
          <img
            src={ICONS.windowsSmall}
            alt="Windows"
            className={isLoading ? 'ie-throbber-spin' : ''}
          />
        </div>
      </div>

      {/* ========== ADDRESS BAR ========== */}
      <div className="ie-address-row">
        <span className="ie-address-label">Address</span>
        <form onSubmit={handleAddressSubmit} className="ie-address-field">
          <img src={ICONS.ie16} alt="" className="ie-address-icon" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            spellCheck={false}
          />
          <button type="submit" className="ie-go-btn">
            Go
          </button>
        </form>
        <span className="ie-links-label">Links</span>
        <span className="ie-links-chevron">»</span>
      </div>

      {/* ========== CONTENT AREA ========== */}
      <div className="ie-content">

        {/* HOME */}
        {currentPage === 'home' && (
          <div className="ie-page">
            {/* Hero Banner */}
            <div className="ie-hero">
              <div className="ie-hero-inner">
                <h1 className="ie-hero-title">Welcome to William's Portfolio</h1>
                <p className="ie-hero-subtitle">Full-Stack Developer &bull; Problem Solver &bull; Tech Enthusiast</p>
              </div>
            </div>

            {/* Navigation links row */}
            <div className="ie-nav-links">
              <span onClick={() => navigateTo('home')} className="ie-nav-link active">Home</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('projects')} className="ie-nav-link">Projects</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('about')} className="ie-nav-link">About Me</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('contact')} className="ie-nav-link">Contact</span>
            </div>

            <div className="ie-page-body">
              <table className="ie-home-table" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    {/* Main content */}
                    <td className="ie-home-main">
                      <h2 className="ie-section-title">
                        <img src={ICONS.ie} alt="" style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 6 }} />
                        Featured Projects
                      </h2>
                      <hr className="ie-hr" />
                      {portfolioProjects.slice(0, 3).map(p => (
                        <div key={p.id} className="ie-home-project">
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); navigateTo('projects'); }}
                            className="ie-link"
                          >
                            {p.title}
                          </a>
                          <span className="ie-project-tech"> — {p.tech.join(', ')}</span>
                          <p className="ie-project-desc">{p.points[0]}</p>
                        </div>
                      ))}
                      <p style={{ marginTop: 12 }}>
                        <a
                          href="#"
                          onClick={(e) => { e.preventDefault(); navigateTo('projects'); }}
                          className="ie-link"
                        >
                          View all projects &raquo;
                        </a>
                      </p>
                    </td>

                    {/* Sidebar */}
                    <td className="ie-home-sidebar">
                      <div className="ie-sidebar-box">
                        <h3 className="ie-sidebar-title">Quick Links</h3>
                        <ul className="ie-sidebar-links">
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('about'); }} className="ie-link">About Me</a>
                          </li>
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('projects'); }} className="ie-link">My Projects</a>
                          </li>
                          <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }} className="ie-link">Contact</a>
                          </li>
                          <li>
                            <a href="https://github.com/williamgladston" target="_blank" rel="noreferrer" className="ie-link">GitHub Profile</a>
                          </li>
                        </ul>
                      </div>
                      <div className="ie-sidebar-box">
                        <h3 className="ie-sidebar-title">Skills</h3>
                        <p className="ie-sidebar-text">React.js &bull; Node.js &bull; MongoDB &bull; Express &bull; Python &bull; C++ &bull; Java &bull; SQL</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {currentPage === 'projects' && (
          <div className="ie-page">
            <div className="ie-nav-links">
              <span onClick={() => navigateTo('home')} className="ie-nav-link">Home</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('projects')} className="ie-nav-link active">Projects</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('about')} className="ie-nav-link">About Me</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('contact')} className="ie-nav-link">Contact</span>
            </div>
            <div className="ie-page-body">
              <h2 className="ie-page-title">My Projects</h2>
              <hr className="ie-hr" />

              {portfolioProjects.map(p => (
                <div key={p.id} className="ie-project-card">
                  <div className="ie-project-header">
                    <img src={ICONS.ie16} alt="" style={{ width: 16, height: 16 }} />
                    <h3 className="ie-project-name">{p.title}</h3>
                  </div>
                  <div className="ie-project-meta">
                    <strong>Technologies:</strong> {p.tech.join(', ')}
                    {' | '}
                    <a href={p.github} target="_blank" rel="noreferrer" className="ie-link">GitHub</a>
                    {' | '}
                    <a href={p.live} target="_blank" rel="noreferrer" className="ie-link">Live Demo</a>
                  </div>
                  <ul className="ie-project-points">
                    {p.points.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT */}
        {currentPage === 'about' && (
          <div className="ie-page">
            <div className="ie-nav-links">
              <span onClick={() => navigateTo('home')} className="ie-nav-link">Home</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('projects')} className="ie-nav-link">Projects</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('about')} className="ie-nav-link active">About Me</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('contact')} className="ie-nav-link">Contact</span>
            </div>
            <div className="ie-page-body">
              <h2 className="ie-page-title">About Me</h2>
              <hr className="ie-hr" />
              <table className="ie-about-table" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td className="ie-about-main">
                      <p className="ie-body-text">
                        Hi! I'm <strong>William Gladston</strong>, a full-stack developer focused on building
                        scalable systems, real-time applications, and AI-powered tools.
                      </p>
                      <p className="ie-body-text">
                        Currently pursuing B.Tech in Computer Science at BK Birla Institute of Engineering &amp; Technology, Pilani (2023–2027).
                      </p>
                      <h3 className="ie-sub-heading">Experience</h3>
                      <ul className="ie-body-list">
                        <li><strong>Software Development Intern</strong> — Blue Stocks (Jun–Jul 2025)<br />
                          Developed backend modules using Node.js, optimized DB queries reducing API response time by 30%
                        </li>
                        <li><strong>AI &amp; Cloud Trainee</strong> — Edunet Foundation (Jul–Aug 2025)<br />
                          Hands-on AI &amp; cloud training using IBM Cloud, worked on AI-based deployment workflows
                        </li>
                      </ul>
                      <h3 className="ie-sub-heading">Achievements</h3>
                      <ul className="ie-body-list">
                        <li>GATE 2026 Qualified</li>
                        <li>2nd Place — Smart India Hackathon 2025</li>
                        <li>Winner — Ideathon (BITS Pilani 2024)</li>
                        <li>AWS Cloud Certified</li>
                      </ul>
                    </td>
                    <td className="ie-about-sidebar">
                      <div className="ie-sidebar-box">
                        <h3 className="ie-sidebar-title">Technical Skills</h3>
                        <p className="ie-sidebar-text"><strong>Languages:</strong> Python, C++, JavaScript, Java, SQL</p>
                        <p className="ie-sidebar-text"><strong>Frameworks:</strong> React.js, Node.js, Express.js</p>
                        <p className="ie-sidebar-text"><strong>Databases:</strong> MongoDB, MySQL</p>
                        <p className="ie-sidebar-text"><strong>Tools:</strong> Git, GitHub, Firebase, Postman</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTACT */}
        {currentPage === 'contact' && (
          <div className="ie-page">
            <div className="ie-nav-links">
              <span onClick={() => navigateTo('home')} className="ie-nav-link">Home</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('projects')} className="ie-nav-link">Projects</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('about')} className="ie-nav-link">About Me</span>
              <span className="ie-nav-divider">|</span>
              <span onClick={() => navigateTo('contact')} className="ie-nav-link active">Contact</span>
            </div>
            <div className="ie-page-body">
              <h2 className="ie-page-title">Contact Me</h2>
              <hr className="ie-hr" />
              <table className="ie-contact-table" cellPadding={0} cellSpacing={0}>
                <tbody>
                  <tr>
                    <td style={{ width: 20 }}>
                      <img src={ICONS.outlookExpress} alt="" style={{ width: 16, height: 16 }} />
                    </td>
                    <td className="ie-contact-label">Email:</td>
                    <td>
                      <a href="mailto:williamgladston4@gmail.com" className="ie-link">williamgladston4@gmail.com</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src={ICONS.ie16} alt="" style={{ width: 16, height: 16 }} />
                    </td>
                    <td className="ie-contact-label">GitHub:</td>
                    <td>
                      <a href="https://github.com/williamgladston" target="_blank" rel="noreferrer" className="ie-link">github.com/williamgladston</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <img src={ICONS.home} alt="" style={{ width: 16, height: 16 }} />
                    </td>
                    <td className="ie-contact-label">Portfolio:</td>
                    <td>
                      <a href="https://williamgladston.github.io/win-xp" target="_blank" rel="noreferrer" className="ie-link">williamgladston.github.io/win-xp</a>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="ie-body-text" style={{ marginTop: 20 }}>
                Feel free to reach out for collaboration, freelance opportunities, or just to say hello!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========== STATUS BAR ========== */}
      <div className="ie-statusbar">
        <div className="ie-status-left">
          {isLoading ? (
            <>
              <span className="ie-status-icon ie-status-loading" />
              <span>Opening page {address}...</span>
            </>
          ) : (
            <span>Done</span>
          )}
        </div>
        <div className="ie-status-zone">
          <img src={ICONS.ie16} alt="" style={{ width: 14, height: 14 }} />
          <span>Internet</span>
        </div>
      </div>
    </div>
  );
}
