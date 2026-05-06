import React, { useState, useRef, useEffect } from 'react';

/* ================= FILE SYSTEM ================= */
const FILE_SYSTEM = {
  name: 'C:',
  type: 'folder',
  children: {
    Users: {
      type: 'folder',
      children: {
        William: {
          type: 'folder',
          children: {
            Desktop: {
              type: 'folder',
              children: {
                projects: {
                  type: 'folder',
                  children: {
                    'ai-reviewer': {
                      type: 'link',
                      url: 'https://github.com/williamgladston/ai-reviewer',
                    },
                    'collab-app': {
                      type: 'link',
                      url: 'https://github.com/williamgladston/collab-app',
                    },
                  },
                },
                'resume.pdf': {
                  type: 'file',
                  url: '/resume.pdf',
                },
              },
            },
          },
        },
      },
    },
  },
};

/* ================= STATIC COMMANDS ================= */
const COMMANDS = {
  help: () => [
    'Available commands:',
    '  help        - Show this help',
    '  about       - About developer',
    '  projects    - View projects',
    '  skills      - Skills',
    '  experience  - Experience',
    '  achievements- Achievements',
    '  contact     - Contact info',
    '  dir         - List directory',
    '  cd [folder] - Change directory',
    '  open [name] - Open file/project',
    '  resume      - Open resume',
    '  cls/clear   - Clear screen',
    '  echo [msg]  - Print message',
    '  color [hex] - Change color',
    '',
  ],

  about: () => [
    '╔══════════════════════════════════════════╗',
    '║        V. William Gladston              ║',
    '║        Full Stack Developer             ║',
    '║        AI + Scalable Systems            ║',
    '╚══════════════════════════════════════════╝',
    '',
  ],

  projects: () => [
    '[1] AI Code Reviewer (MERN + Gemini)',
    '[2] Real-Time Collaboration App',
    '[3] File Sharing Platform',
    '[4] Bank Transaction System',
    '',
    'Use: open ai-reviewer',
    '',
  ],

  skills: () => [
    'Languages: Python, C++, JS, Java, SQL',
    'Frontend: React',
    'Backend: Node.js, Express',
    'DB: MongoDB, MySQL',
    '',
  ],

  experience: () => [
    'Blue Stocks Intern → +25% performance',
    'Edunet (IBM AI + Cloud)',
    '',
  ],

  achievements: () => [
    'GATE 2026 Qualified',
    'SIH 2025 - 2nd Place',
    'Ideathon Winner (BITS)',
    '',
  ],

  contact: () => [
    'Email: williamgladston4@gmail.com',
    'Phone: +91-7014825243',
    'GitHub: github.com/williamgladston',
    '',
  ],
};

/* ================= COMPONENT ================= */
export default function CommandPrompt() {
  const [lines, setLines] = useState([
    'Microsoft Windows XP [Version 5.1.2600]',
    'Portfolio Terminal v2.0',
    'Type "help"',
    '',
  ]);

  const [input, setInput] = useState('');
  const [textColor, setTextColor] = useState('#C0C0C0');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [path, setPath] = useState(['C:', 'Users', 'William', 'Desktop']);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  /* ===== GET CURRENT DIR ===== */
  const getDir = () => {
    let dir = FILE_SYSTEM;
    for (let i = 1; i < path.length; i++) {
      dir = dir.children[path[i]];
    }
    return dir;
  };

  /* ===== COMMAND EXECUTION ===== */
  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output = [`${path.join('\\')}> ${trimmed}`];
    const dir = getDir();

    /* CLEAR */
    if (command === 'cls' || command === 'clear') {
      setLines([]);
      return;
    }

    /* DIR */
    else if (command === 'dir') {
      output.push('');
      Object.keys(dir.children || {}).forEach((item) => {
        const type = dir.children[item].type === 'folder' ? '<DIR>' : 'FILE';
        output.push(`${type.padEnd(10)} ${item}`);
      });
      output.push('');
    }

    /* CD */
    else if (command === 'cd') {
      if (!args[0]) {
        output.push('Usage: cd <folder>');
      } else if (args[0] === '..') {
        if (path.length > 1) setPath((p) => p.slice(0, -1));
      } else if (dir.children[args[0]]?.type === 'folder') {
        setPath((p) => [...p, args[0]]);
      } else {
        output.push('Directory not found.');
      }
      output.push('');
    }

    /* OPEN */
    else if (command === 'open') {
      const file = dir.children[args[0]];
      if (!file) {
        output.push('Not found.');
      } else {
        window.open(file.url, '_blank');
        output.push(`Opening ${args[0]}...`);
      }
      output.push('');
    }

    /* RESUME */
    else if (command === 'resume') {
      window.open('/resume.pdf', '_blank');
      output.push('Opening resume...');
      output.push('');
    }

    /* COLOR */
    else if (command === 'color') {
      const colors = {
        a: '#55FF55',
        b: '#55FFFF',
        c: '#FF5555',
        d: '#FF55FF',
        e: '#FFFF55',
        f: '#FFFFFF',
      };
      if (colors[args[0]]) setTextColor(colors[args[0]]);
      output.push('');
    }

    /* ECHO */
    else if (command === 'echo') {
      output.push(args.join(' '), '');
    }

    /* STATIC COMMANDS */
    else if (COMMANDS[command]) {
      output = output.concat(COMMANDS[command]());
    }

    /* EMPTY */
    else if (trimmed === '') {
      output = [`${path.join('\\')}>`];
    }

    /* INVALID */
    else {
      output.push(`'${command}' is not recognized.`);
      output.push('');
    }

    setLines((prev) => [...prev, ...output]);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  /* ===== KEY HANDLER ===== */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const i = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(i);
        setInput(history[i]);
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex >= 0) {
        const i = historyIndex + 1;
        if (i >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(i);
          setInput(history[i]);
        }
      }
    }
  };

  /* ===== UI ===== */
  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: '#000',
        color: textColor,
        fontFamily: 'monospace',
        fontSize: '13px',
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-2">
        {lines.map((line, i) => (
          <div key={i}>{line || '\u00A0'}</div>
        ))}

        <div className="flex">
          <span>{path.join('\\')}&gt;&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none"
            style={{ color: textColor }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}