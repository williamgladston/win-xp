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
          content: `V. WILLIAM GLADSTON - SOFTWARE DEVELOPER
==========================================

ABOUT ME
--------
Aspiring Software Developer with strong problem-solving skills and experience in full-stack web development and backend systems.
Skilled in building scalable applications using React, Node.js, and MongoDB, with a growing interest in AI-driven solutions.

SKILLS
------
• Languages: Python, C++, JavaScript, Java, SQL
• Frameworks: React.js, Node.js, Express.js
• Databases: MongoDB, MySQL
• Tools: Git, GitHub, Firebase, Postman

EXPERIENCE
----------
Software Development Intern - Blue Stocks (Jun 2025 - Jul 2025)
• Developed backend modules using Node.js
• Improved data retrieval efficiency by ~25%
• Reduced API response time by ~30%

AI & Cloud Trainee - Edunet Foundation (Jul 2025 - Aug 2025)
• Worked on AI & cloud-based workflows using IBM Cloud
• Implemented real-world ML and deployment concepts

EDUCATION
---------
B.Tech Computer Science
BK Birla Institute of Engineering & Technology (2023 - 2027)

ACHIEVEMENTS
------------
• GATE 2026 Qualified
• 2nd Place - Smart India Hackathon 2025
• Winner - Ideathon (IEI BITS Pilani 2024)
• AWS Cloud Foundations Certified

CONTACT
-------
Email: williamgladston4@gmail.com
GitHub: github.com/williamgladston
Portfolio: williamgladston.github.io/win-xp/
`,
        },

        'about-me.txt': {
          type: 'file',
          content: `Hi! I'm William 👋

I'm a full-stack developer passionate about building real-world scalable applications and AI-powered tools.

This Windows XP portfolio is one of my creative projects where I combined UI/UX with functionality.

I enjoy working on:
• Full-stack web apps
• Backend systems & APIs
• Real-time apps using WebSockets
• AI-powered developer tools

Feel free to explore everything here 
`,
        },

        'projects.txt': {
          type: 'file',
          content: `MY PROJECTS
===========

1. AI-Powered Code Reviewer
   Automates code review using AI (Gemini API)
   Tech: MERN Stack, JWT
   GitHub: github.com/williamgladston/ai-powered-code-optimization

2. Real-Time Collaboration IDE
   Live collaborative coding using WebSockets
   Tech: React, Node.js, WebSocket
   Live: ide-with-real-time-collabration-2.onrender.com

3. File Sharing Web Application
   Share files via link/email with 24-hour expiry
   Tech: Node.js, Express, MongoDB, Multer
   GitHub: github.com/williamgladston/Inshare

4. Bank Transaction System
   Simulates banking operations with secure APIs
   Tech: Node.js, Express, MongoDB
   Live: backend-ledger-t9p6.onrender.com

5. Windows XP Portfolio (This Site!)
   Interactive OS-style portfolio
   Tech: React, Tailwind, GSAP
`,
        },
      },
    },

    Desktop: {
      type: 'folder',
      children: {
        'welcome.txt': {
          type: 'file',
          content:
            'Welcome to William’s Windows XP Portfolio!\n\nDouble-click icons to explore projects, resume, and more 🚀',
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
    title: 'AI-Powered Code Reviewer',
    description:
      'AI-based system that reviews code and provides optimization suggestions using Gemini API.',
    tech: ['React', 'Node.js', 'MongoDB', 'Gemini API', 'JWT'],
    url: 'https://github.com/williamgladston/ai-powered-code-optimization',
  },
  {
    id: 2,
    title: 'Real-Time Collaboration IDE',
    description:
      'Live collaborative coding platform with real-time updates using WebSocket communication.',
    tech: ['React', 'Node.js', 'WebSocket'],
    url: 'https://ide-with-real-time-collabration-2.onrender.com',
  },
  {
    id: 3,
    title: 'File Sharing Web Application',
    description:
      'File sharing system with secure links and 24-hour expiration for downloads.',
    tech: ['Node.js', 'Express', 'MongoDB', 'Multer', 'EJS'],
    url: 'https://github.com/williamgladston/Inshare',
  },
  {
    id: 4,
    title: 'Bank Transaction System',
    description:
      'Backend system simulating real-world banking operations with secure transaction APIs.',
    tech: ['Node.js', 'Express', 'MongoDB'],
    url: 'https://backend-ledger-t9p6.onrender.com',
  },
  {
    id: 5,
    title: 'Windows XP Portfolio',
    description:
      'Interactive OS-style portfolio with multiple working apps and animations.',
    tech: ['React', 'Tailwind', 'GSAP', 'Framer Motion'],
    url: 'https://williamgladston.github.io/win-xp/',
  },
];
