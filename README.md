 SyllabusPath AI — AI-Powered Study Planner
SyllabusPath AI is an intelligent study-planning platform that converts any syllabus into a personalized study roadmap, curates the best YouTube videos, tracks student progress, and provides AI-powered insights & analytics.

Built for students, educators, and self-learners who want a structured, time-optimized, and distraction-free learning experience.

✨ Features
🔹 AI-Generated Study Roadmap
Paste your syllabus text

AI extracts topics intelligently using Gemini API

Categorizes difficulty: Beginner / Intermediate / Advanced

Estimates required study time

Reorders topics into an optimal learning sequence

🔹 YouTube Learning Playlist
Auto-curated educational videos for every topic

Highest-quality sources selected using YouTube Data API

Includes video title, channel name & direct links

Filtered for relevance and quality

🔹 Progress Tracking
Mark topic completion

Track percentage progress

Monitor time spent per topic

View completed vs pending topics in real-time

🔹 Analytics Dashboard
Identify hardest topics

Track slowest topics

Overall progress trends

Weekly learning insights

🛠️ Tech Stack
Frontend
React + TypeScript

Vite (Build tool)

TailwindCSS (Styling)

Axios (API calls)

React Router (Navigation)

Clean 2D SaaS-grade UI

Backend
Node.js + Express

Gemini AI (Topic extraction & roadmap generation)

YouTube Data API (Video curation)

LowDB (JSON-based database)

JWT Authentication

Helmet + CORS + Rate Limiting

📁 Project Structure
text
syllabuspath-ai/
│
├── frontend/
│   ├── src/
│   │   ├── api.ts              # Axios instance for backend
│   │   ├── App.tsx             # Routing logic
│   │   ├── main.tsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── RoadmapCard.tsx
│   │   │   ├── VideoCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   └── pages/
│   │       ├── Home.tsx
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Analytics.tsx
│   │       └── Progress.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── backend/
    ├── controllers/
    │   ├── auth.js           # Login + Register logic
    │   ├── generate.js       # AI roadmap generation
    │   ├── progress.js       # Save user progress
    │   └── analytics.js      # Analytics insights
    ├── services/
    │   └── ai.js             # Gemini AI integration
    ├── db.js                 # LowDB wrapper
    ├── db.json               # Database file
    ├── server.js             # Main Express server
    ├── package.json
    └── .env                  # API keys
⚙️ Installation Guide
Prerequisites
Node.js (v16+)

npm or yarn

Gemini API Key

YouTube Data API Key

1️⃣ Clone the Repository
bash
git clone https://github.com/<your-username>/syllabuspath-ai.git
cd syllabuspath-ai
2️⃣ Backend Setup
bash
cd backend
npm install
npm run dev
Backend runs at: http://localhost:4000

3️⃣ Frontend Setup
bash
cd frontend
npm install
npm run dev
Frontend runs at: http://localhost:5173

🔐 Environment Variables
Create a .env file inside the backend folder:

text
JWT_SECRET=your_jwt_secret_key
YOUTUBE_API_KEY=your_youtube_api_key
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
🧬 Backend API Endpoints
Route	Method	Description
/register	POST	Register new user
/login	POST	User login (returns JWT token)
/generate-public	POST	Generate AI-powered study roadmap
/progress	POST	Update topic progress
/analytics	GET	Retrieve analytics insights
Example Request: Generate Roadmap
POST /generate-public

json
{
  "syllabusText": "Introduction to Machine Learning, Neural Networks, Deep Learning, NLP"
}
Response:

json
{
  "roadmap": [
    {
      "topic": "Introduction to Machine Learning",
      "difficulty": "Beginner",
      "estimatedTime": "3 hours",
      "videos": [
        {
          "title": "ML Basics",
          "channel": "StatQuest",
          "url": "https://youtube.com/watch?v=..."
        }
      ]
    }
  ]
}
🎨 UI Highlights
Clean SaaS-grade design

2D components (optimized for performance)

Fully responsive for desktop + mobile

Smooth Tailwind transitions

Premium spacing & typography

📦 Deployment
Frontend
Deploy to:

Vercel

Netlify

Cloudflare Pages

Backend
Deploy to:

Render

Railway

AWS / Azure / GCP

🌟 Future Enhancements
Multi-language roadmap support

Smart difficulty prediction using ML

Group-study collaboration features

AI chatbot for doubt-solving

Adaptive learning schedule based on user progress

❤️ Contributors
Built with passion for AI SpellBound Coders Cup Hackathon.

Team:

[Yash Goel]
[Chakshu Arora]

📜 License
MIT License — Open-source and free to use.

🎯 Project Highlights
This project demonstrates:

✅ Full-stack development with modern tech stack

✅ AI integration for intelligent content generation

✅ API integration (YouTube Data API)

✅ Authentication & security (JWT, Helmet, Rate Limiting)

✅ Real-time progress tracking

✅ Clean code architecture with proper folder structure

✅ Production-ready deployment

Made with 🔥 for revolutionizing how students learn
