import React, { useState, useRef, useEffect } from 'react';

const COMMANDS = {
  help: () => [
    'Available commands:',
    '  help        - Show this help message',
    '  about       - About the developer',
    '  projects    - List projects',
    '  skills      - List skills',
    '  contact     - Contact information',
    '  dir         - List files',
    '  cls         - Clear screen',
    '  echo [msg]  - Print a message',
    '  date        - Show current date/time',
    '  ver         - Show version',
    '  color [hex] - Change text color (e.g. color 0a)',
    '  matrix      - Enter the matrix',
    '  whoami      - Who are you?',
    '',
  ],
  about: () => [
    '╔══════════════════════════════════════╗',
    '║          ABOUT THE DEVELOPER         ║',
    '╠══════════════════════════════════════╣',
    '║  Name:     William                   ║',
    '║  Role:     Full-Stack Developer      ║',
    '║  Passion:  Creative Web Experiences  ║',
    '╚══════════════════════════════════════╝',
    '',
  ],
  projects: () => [
    'My Projects:',
    '  [1] E-Commerce Platform   - React, Node.js, PostgreSQL',
    '  [2] AI Chat Application   - Next.js, OpenAI, WebSocket',
    '  [3] Task Management       - React, TypeScript, GraphQL',
    '  [4] Weather Dashboard     - React, D3.js, GSAP',
    '  [5] Portfolio OS           - React, Tailwind, GSAP (this!)',
    '',
  ],
  skills: () => [
    'Skills:',
    '  Frontend:  React, Next.js, TypeScript, Tailwind, GSAP',
    '  Backend:   Node.js, Python, Go, GraphQL',
    '  Database:  PostgreSQL, MongoDB, Redis',
    '  DevOps:    Docker, K8s, AWS, CI/CD',
    '',
  ],
  contact: () => [
    'Contact:',
    '  Email:    hello@william.dev',
    '  GitHub:   github.com/william',
    '  LinkedIn: linkedin.com/in/william',
    '  Twitter:  @william_dev',
    '',
  ],
  dir: () => [
    ' Volume in drive C has no label.',
    ' Volume Serial Number is 4B7D-9F2A',
    '',
    ' Directory of C:\\Users\\William\\Desktop',
    '',
    '03/24/2026  11:00 PM    <DIR>          .',
    '03/24/2026  11:00 PM    <DIR>          ..',
    '03/24/2026  10:00 PM             1,337 readme.txt',
    '03/24/2026  09:00 PM    <DIR>          Projects',
    '03/24/2026  08:00 PM             4,096 resume.pdf',
    '               2 File(s)          5,433 bytes',
    '               3 Dir(s)  100,000,000 bytes free',
    '',
  ],
  ver: () => [
    '',
    'Microsoft Windows XP [Version 5.1.2600] (Portfolio Edition)',
    '',
  ],
  whoami: () => ['C:\\Users\\William', ''],
  date: () => [new Date().toString(), ''],
  matrix: () => [
    '  Wake up, William...',
    '  The Matrix has you...',
    '  Follow the white rabbit.',
    '  Knock, knock.',
    '',
  ],
};

export default function CommandPrompt() {
  const [lines, setLines] = useState([
    'Microsoft Windows XP [Version 5.1.2600]',
    '(C) Copyright 1985-2026 Microsoft Corp. (Portfolio Edition)',
    '',
    'Type "help" for a list of commands.',
    '',
  ]);
  const [input, setInput] = useState('');
  const [textColor, setTextColor] = useState('#C0C0C0');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    let output = [`C:\\Users\\William> ${trimmed}`];

    if (command === 'cls') {
      setLines([]);
      return;
    } else if (command === 'echo') {
      output.push(args || '', '');
    } else if (command === 'color' && args) {
      const colors = {
        '0': '#000000', '1': '#0000AA', '2': '#00AA00', '3': '#00AAAA',
        '4': '#AA0000', '5': '#AA00AA', '6': '#AA5500', '7': '#AAAAAA',
        '8': '#555555', '9': '#5555FF', 'a': '#55FF55', 'b': '#55FFFF',
        'c': '#FF5555', 'd': '#FF55FF', 'e': '#FFFF55', 'f': '#FFFFFF',
      };
      const fgChar = args.length >= 2 ? args[1] : args[0];
      if (colors[fgChar.toLowerCase()]) {
        setTextColor(colors[fgChar.toLowerCase()]);
        output.push('');
      } else {
        output.push('Invalid color.', '');
      }
    } else if (COMMANDS[command]) {
      output = output.concat(COMMANDS[command]());
    } else if (trimmed === '') {
      output = ['C:\\Users\\William>'];
    } else {
      output.push(`'${command}' is not recognized as an internal or external command,`);
      output.push('operable program or batch file.', '');
    }

    setLines(prev => [...prev, ...output]);
    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className="flex flex-col h-full cursor-text"
      style={{ background: '#000', color: textColor, fontFamily: 'Lucida Console, Courier New, monospace', fontSize: '13px' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-2 pb-0">
        {lines.map((line, i) => (
          <div key={i} style={{ minHeight: '16px' }}>{line || '\u00A0'}</div>
        ))}
        <div className="flex items-center">
          <span>C:\Users\William&gt;&nbsp;</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none border-none caret-current"
            style={{ color: textColor, fontFamily: 'inherit', fontSize: 'inherit' }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
