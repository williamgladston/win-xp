// NOTE: Icon images are resolved at runtime by MyComputer/Desktop using the iconMap
// These are just string keys for the icon map, or will fall back to defaults

export const initialFileSystem = {
  type: 'folder',
  children: {
    'My Computer': {
      type: 'folder',
      children: {
        'Local Disk (C:)': {
          type: 'folder',
          children: {
            'Program Files': { type: 'folder', children: {} },
            'Windows': { type: 'folder', children: {} },
          },
        },
      },
    },
    'My Documents': {
      type: 'folder',
      children: {
        'My Pictures': { type: 'folder', children: {} },
        'My Music': { type: 'folder', children: {} },
        'resume.txt': {
          type: 'file',
          content: `WILLIAM - SOFTWARE DEVELOPER
============================

ABOUT ME
--------
Passionate full-stack developer with a love for creative web experiences.
I build things that make people smile.

SKILLS
------
• JavaScript / TypeScript / React / Next.js
• Node.js / Python / Go
• CSS / Tailwind / GSAP / Framer Motion
• PostgreSQL / MongoDB / Redis
• AWS / Docker / Kubernetes

EXPERIENCE
----------
Senior Developer - Tech Corp (2023-Present)
• Led frontend architecture redesign
• Built real-time collaboration features
• Mentored junior developers

Full-Stack Developer - Startup Inc (2021-2023)
• Built product from 0 to 50k users
• Implemented CI/CD pipeline
• Designed microservices architecture

EDUCATION
---------
B.S. Computer Science
University of Technology (2021)

CONTACT
-------
Email: hello@william.dev
GitHub: github.com/william
LinkedIn: linkedin.com/in/william
`,
        },
        'about-me.txt': {
          type: 'file',
          content: `Hi! I'm William

I'm a developer who loves building creative and interactive web experiences.
This Windows XP portfolio is a showcase of what I can do!

Feel free to explore around - try opening different applications,
play some Minesweeper, draw in Paint, or use the calculator.

Every app in this OS is fully functional and built from scratch with React.

Thanks for visiting!
`,
        },
        'projects.txt': {
          type: 'file',
          content: `MY PROJECTS
===========

1. E-Commerce Platform
   Full-stack e-commerce solution with real-time inventory, payments, admin dashboard
   Tech: React, Node.js, PostgreSQL, Stripe, Redis

2. AI Chat Application
   Real-time chat with AI-powered responses, threading, file sharing
   Tech: Next.js, OpenAI, WebSocket, MongoDB

3. Task Management System
   Kanban-style PM tool with drag-and-drop, collaboration, analytics
   Tech: React, TypeScript, GraphQL, PostgreSQL

4. Weather Dashboard
   Weather visualization with animated backgrounds, forecasts
   Tech: React, D3.js, Weather API, GSAP

5. Portfolio OS (This Site!)
   Windows XP themed portfolio built from scratch
   Tech: React, Tailwind, GSAP, Framer Motion, Web Audio API
`,
        },
      },
    },
    Desktop: {
      type: 'folder',
      children: {
        'welcome.txt': {
          type: 'file',
          content: 'Welcome to Windows XP Portfolio Edition!\n\nDouble-click on icons to explore.',
        },
      },
    },
    'Recycle Bin': {
      type: 'folder',
      children: {},
    },
  },
};

export const portfolioProjects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Full-stack e-commerce solution with real-time inventory management, payment processing, and admin dashboard.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis'],
    url: 'https://github.com/william/ecommerce',
  },
  {
    id: 2,
    title: 'AI Chat Application',
    description: 'Real-time chat app with AI-powered responses, message threading, and file sharing.',
    tech: ['Next.js', 'OpenAI', 'WebSocket', 'MongoDB'],
    url: 'https://github.com/william/aichat',
  },
  {
    id: 3,
    title: 'Task Management System',
    description: 'Kanban-style project management tool with drag-and-drop, team collaboration, and analytics.',
    tech: ['React', 'TypeScript', 'GraphQL', 'PostgreSQL'],
    url: 'https://github.com/william/taskmanager',
  },
  {
    id: 4,
    title: 'Weather Dashboard',
    description: 'Beautiful weather visualization with animated backgrounds, forecasts, and location tracking.',
    tech: ['React', 'D3.js', 'Weather API', 'GSAP'],
    url: 'https://github.com/william/weather',
  },
  {
    id: 5,
    title: 'Portfolio OS (This Site!)',
    description: 'Windows XP-themed portfolio built from scratch with React, featuring multiple working applications.',
    tech: ['React', 'Tailwind', 'GSAP', 'Framer Motion', 'Web Audio API'],
    url: 'https://github.com/william/winxp-portfolio',
  },
];
