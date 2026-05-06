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
          content: `V. WILLIAM GLADSTON
+91-7014825243 | williamgladston4@gmail.com
LinkedIn | GitHub | Portfolio

OBJECTIVE
---------
Aspiring Software Developer with strong problem-solving skills and experience in full-stack web development and backend systems.
Skilled in building scalable applications using React, Node.js, and MongoDB with growing interest in AI-driven solutions.

EDUCATION
---------
B.Tech in Computer Science (2023 – 2027)
BK Birla Institute of Engineering & Technology, Pilani

EXPERIENCE
----------
Software Development Intern - Blue Stocks (Jun 2025 – Jul 2025)
• Developed backend modules using Node.js improving efficiency by 25%
• Optimized database queries reducing API response time by 30%

AI & Cloud Trainee - Edunet Foundation (Jul 2025 – Aug 2025)
• Hands-on AI & cloud training using IBM Cloud
• Worked on deployment and AI-based workflows
• Gained real-world ML exposure

PROJECTS
--------
AI-Powered Code Reviewer
• AI-based code analysis using Gemini API
• Reduced review time by 40%

Real-Time Collaboration App
• WebSocket-based live collaboration system

File Sharing Web Application
• Secure file sharing with 24-hour expiry

Bank Transaction System
• Backend banking simulation with secure APIs

SKILLS
------
Languages: Python, C++, JavaScript, Java, SQL
Frameworks: React.js, Node.js, Express.js
Databases: MongoDB, MySQL
Tools: Git, GitHub, Firebase, Postman

ACHIEVEMENTS
------------
• GATE 2026 Qualified
• 2nd Place - Smart India Hackathon 2025
• Winner - Ideathon (BITS Pilani 2024)
• AWS Cloud Certified
`,
        },

        'projects.txt': {
          type: 'file',
          content: `MY PROJECTS
===========

1. AI-Powered Code Reviewer
   MERN Stack, Gemini API
   - AI-based code feedback system
   - 200+ evaluations processed
   - Reduced review time by 40%

2. Real-Time Collaboration App
   React, Node.js, WebSocket
   - Live collaboration system
   - Real-time bidirectional communication

3. File Sharing Web App
   Node.js, MongoDB, Multer
   - Secure link sharing (24hr expiry)

4. Bank Transaction System
   Node.js, MongoDB
   - Simulated banking APIs
   - 1000+ transactions handled
`,
        },

        'about-me.txt': {
          type: 'file',
          content: `Hi! I'm William 👋

I'm a full-stack developer focused on building:
• Scalable backend systems
• Real-time applications
• AI-powered tools

This Windows XP portfolio is a combination of creativity + engineering.

Explore around 🚀`,
        },
      },
    },

    Desktop: {
      type: 'folder',
      children: {
        'welcome.txt': {
          type: 'file',
          content:
            'Welcome to William’s Windows XP Portfolio!\n\nExplore projects, resume, and more 🚀',
        },
      },
    },

    'Recycle Bin': {
      type: 'folder',
      children: {},
    },
  },
};

/* ================= PROJECT DATA ================= */

export const portfolioProjects = [
  {
    id: 1,
    title: 'AI-Powered Code Reviewer',
    tech: ['MERN Stack', 'Gemini API'],
    github: 'https://github.com/williamgladston/ai-powered-code-optimization',
    live: '#',
    points: [
      'Built to automate manual code review with AI feedback',
      'Integrated Gemini API for code optimization suggestions',
      'Processed 200+ evaluations reducing review time by 40%',
      'Implemented JWT auth and dashboard tracking system'
    ]
  },
  {
    id: 2,
    title: 'Full Stack Real-Time Collaboration App',
    tech: ['React.js', 'Node.js', 'WebSocket'],
    github: 'https://github.com/williamgladston/IDE-with-real-time-collabration',
    live: 'https://ide-with-real-time-collabration-2.onrender.com',
    points: [
      'Developed real-time collaborative system using WebSockets',
      'Built dynamic React frontend',
      'Implemented bidirectional communication',
      'Designed scalable backend for concurrent users'
    ]
  },
  {
    id: 3,
    title: 'File Sharing Web Application',
    tech: ['Node.js', 'Express', 'MongoDB', 'Multer', 'EJS'],
    github: 'https://github.com/williamgladston/Inshare',
    live: 'https://github.com/williamgladston/Inshare',
    points: [
      'Built file sharing via secure links/email',
      'Implemented 24-hour expiry system',
      'Designed clean download UI',
      'Used Multer + MongoDB for file handling'
    ]
  },
  {
    id: 4,
    title: 'Bank Transaction System',
    tech: ['Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/williamgladston/backend-ledger',
    live: 'https://backend-ledger-t9p6.onrender.com',
    points: [
      'Simulated banking system with secure APIs',
      'Built deposit/withdraw APIs',
      'Handled 1000+ transactions',
      'Optimized DB schema for performance'
    ]
  }
];
