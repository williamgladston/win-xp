import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ICONS from '../../data/iconMap';

const BIOS_LINES = [
  'AMI BIOS (C) 2002 American Megatrends, Inc.',
  'ASUS P4PE ACPI BIOS Revision 1008',
  '',
  'Intel(R) Pentium(R) 4 CPU 2.40GHz',
  'Memory Test: 524288K OK',
  '',
  'IDE Channel 0 Master: WDC WD800JB-00JJC0',
  'IDE Channel 1 Master: ASUS CD-S520/A',
  '',
  'Press DEL to enter SETUP',
  '',
  'Booting from Hard Disk...',
];

export default function BootLoader({ onComplete }) {
  const [phase, setPhase] = useState('bios'); // bios, loading, login, welcome
  const [biosLines, setBiosLines] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);
  const bootSoundPlayed = useRef(false);

  // Play startup sound after user interaction
  const playBootSound = useCallback(() => {
    if (bootSoundPlayed.current) return;
    bootSoundPlayed.current = true;
    try {
      const audio = new Audio('/src/assets/sounds/error.wav');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  }, []);

  // Track user interaction for autoplay policy
  useEffect(() => {
    const handler = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('click', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // BIOS phase
  useEffect(() => {
    if (phase !== 'bios') return;
    let lineIndex = 0;
    const interval = setInterval(() => {
      if (lineIndex < BIOS_LINES.length) {
        setBiosLines(prev => [...prev, BIOS_LINES[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => setPhase('loading'), 400);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  // Loading phase
  useEffect(() => {
    if (phase !== 'loading') return;
    const timer = setTimeout(() => setPhase('login'), 3500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Handle login click
  const handleLoginClick = useCallback(() => {
    if (hasInteracted) playBootSound();
    setPhase('welcome');
  }, [hasInteracted, playBootSound]);

  // Welcome phase
  useEffect(() => {
    if (phase !== 'welcome') return;
    const timer = setTimeout(() => onComplete(), 2000);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <div className="fixed inset-0 z-[99999]" onClick={() => !hasInteracted && setHasInteracted(true)}>
      <AnimatePresence mode="wait">
        {/* BIOS SCREEN */}
        {phase === 'bios' && (
          <motion.div
            key="bios"
            className="boot-bios"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {biosLines.map((line, i) => (
              <div key={i}>{line || '\u00A0'}</div>
            ))}
            <span style={{ animation: 'blink-cursor 1s infinite' }}>_</span>
          </motion.div>
        )}

        {/* XP LOADING SCREEN */}
        {phase === 'loading' && (
          <motion.div
            key="loading"
            className="boot-xp-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="xp-logo">
              <img src={ICONS.windowsLogo} alt="Windows XP" />
              <div className="xp-title">
                Windows<sup>xp</sup>
              </div>
              <div className="xp-subtitle">Portfolio Edition</div>
            </div>

            {/* Animated progress bar with sliding blue blocks */}
            <div className="boot-progress-container">
              <div className="boot-progress-track">
                <div className="boot-progress-blocks">
                  <div className="boot-progress-block" />
                  <div className="boot-progress-block" />
                  <div className="boot-progress-block" />
                </div>
              </div>
            </div>

            <div style={{ color: '#666', fontSize: '10px', marginTop: '16px' }}>
              For the best experience, enter Full Screen (F11)
            </div>
          </motion.div>
        )}

        {/* LOGIN SCREEN */}
        {phase === 'login' && (
          <motion.div
            key="login"
            className="boot-login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="boot-login-top" />
            <div className="boot-login-center">
              {/* Left: Branding */}
              <div className="boot-login-branding">
                <img src={ICONS.windowsLogo} alt="Windows XP" />
                <div className="brand-name">
                  Windows<sup>xp</sup>
                </div>
                <div className="brand-subtitle">Portfolio Edition</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '12px', textAlign: 'center' }}>
                  To begin, click on William to log in
                </div>
              </div>

              <div className="boot-login-divider" />

              {/* Right: User */}
              <div className="boot-login-user" onClick={handleLoginClick}>
                <img src={ICONS.userAvatar} alt="User" />
                <div>
                  <div className="user-name">William</div>
                  <div className="user-role">Developer</div>
                </div>
              </div>
            </div>
            <div className="boot-login-bottom">
              <button className="restart-btn" onClick={handleLoginClick}>
                <img src={ICONS.windowsSmall} alt="" />
                Restart William XP
              </button>
              <div className="hint">
                After you log on, the system is yours to explore.
              </div>
            </div>
          </motion.div>
        )}

        {/* WELCOME SCREEN */}
        {phase === 'welcome' && (
          <motion.div
            key="welcome"
            className="boot-welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>Welcome</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
