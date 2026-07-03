# Elevate — Peer-to-Peer Skill Exchange Platform

> Exchange skills, grow together. Elevate connects people who want to teach what they know and learn what they don't — completely free.

![Elevate](https://skillswap-frontend-8nuj.vercel.app/)

## 🧪 Test Credentials

You can use these accounts to test the platform immediately without registering:

**Account 1 — Testuser5**
- Email: **testuser5@gmail.com**
- Password: **56311400**

**Account 2 — Testuser6**
- Email: **testuser6@gmail.com**
- Password: **56311400**

> **Tip for testing the full flow:**
> Open Account 1 in Chrome and Account 2 in Edge/Firefox at the same time.
> - Browse skills → send a request from one account
> - Accept the request from the other account
> - Both accounts get access to the Exchange Workspace
> - Try the group chat, schedule a session, add tasks
> - Go to Projects → post a project → apply from other account

## ⚡ Quick Start 

1. Visit https://skillswap-frontend-8nuj.vercel.app/
2. Login with test credentials above
3. Go to **Browse** → search any skill
4. Click **View Profile** → **Request Exchange**
5. Switch to Account 2 → **Requests** → **Accept**
6. Both accounts now have access to **Exchange Workspace**
7. Try **Projects** tab → Post a project → Apply from other account

## 🚀 Live Demo

- **Frontend:** https://skillswap-frontend-8nuj.vercel.app/
- **Backend API:** https://skillswap-backend-jx0y.onrender.com/api/health

## 📌 What it Does

Elevate is a full-stack peer-to-peer skill exchange platform where users can:

- Create a profile and list skills they **offer** and **want to learn**
- Browse skills from other users with **search and category filters**
- Get **AI-powered match scores** showing compatibility with other users
- Send and receive **skill exchange requests** with a message
- Accept requests to start an **active exchange**
- **Chat** with exchange partners in real time
- Schedule sessions and track **exchange progress**
- Post and collaborate on **projects** — find contributors with matching skills
- Leave **reviews and ratings** after completed exchanges

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| ORM | Prisma |
| Database | PostgreSQL (Supabase) |
| Authentication | JWT + bcryptjs |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

## 📁 Project Structure
Frontend (skillswap-frontend)

├── src/

│   ├── pages/          # 14 pages

│   ├── components/     # Navbar, Cards, UI

│   ├── context/        # Auth Context

│   ├── api/            # Axios + Services

│   └── data/           # Dummy data fallback
Backend (skillswap-backend)

├── prisma/

│   └── schema.prisma   # 13 DB models

├── src/

│   ├── routes/         # 6 route files

│   ├── middleware/     # JWT auth guard

│   └── app.js          # Express server
## ⚙️ How to Run Locally

### Prerequisites
- Node.js v18+
- PostgreSQL database (or Supabase account)

### Backend Setup
```bash
git clone https://github.com/mdsufiyan04/skillswap-backend.git
cd skillswap-backend
npm install

Create .env file:
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
DIRECT_URL="your_secret_key"
PORT=5000

bashnpx prisma db push
npx prisma generate
npm run dev

Backend runs on http://localhost:5000

Frontend Setup
git clone https://github.com/mdsufiyan04/skillswap-frontend.git
cd skillswap-frontend
npm install

Create .env file:
VITE_API_URL=http://localhost:5000/api

npm run dev

Frontend runs on http://localhost:5173
🔌 API Endpoints
MethodEndpointAuthDescriptionPOST/api/auth/registerNoRegister userPOST/api/auth/loginNoLogin + JWT tokenGET/api/users/meYesGet my profilePUT/api/users/meYesUpdate profileGET/api/users/:idNoGet user profileGET/api/skillsNoBrowse all skillsPOST/api/skillsYesAdd a skillDELETE/api/skills/:idYesDelete skillPOST/api/requestsYesSend requestGET/api/requestsYesMy requestsPUT/api/requests/:idYesAccept/rejectGET/api/exchangesYesMy exchangesPOST/api/exchanges/:id/messagesYesSend messageGET/api/exchanges/:id/messagesYesGet messagesPOST/api/exchanges/:id/reviewsYesLeave reviewGET/api/projectsNoBrowse projectsPOST/api/projectsYesCreate projectPOST/api/projects/:id/applyYesApply to projectPUT/api/projects/:id/applications/:appIdYesAccept/reject application
🗄 Database Schema
13 models: User, Skill, Request, Exchange, Message, Review, Project, ProjectRole, ProjectApplication, ProjectMember, ProjectMessage, ProjectPost, ProjectTask
✨ Key Features
AI-Powered Matching

Dashboard shows match scores and reasons for compatible users based on complementary skills.
Complete Exchange Lifecycle

Request → Accept → Exchange Workspace → Schedule Sessions → Chat → Mark Complete → Review
Projects Feature

Post projects, define open roles with required skills, accept contributors, collaborate in team workspace with group chat and kanban board.
Real-time Chat

Messages stored in PostgreSQL, polled every 3 seconds for near real-time experience.
🔮 What I Would Improve With More Time

WebSocket real-time chat instead of polling
Google OAuth login
Mobile app with React Native
Video call integration for sessions
Gemini AI for real skill matching scores
Email notifications for requests
Advanced search with skill graph recommendations

👨‍💻 Developer
Mohammed Sufiyan

GitHub: mdsufiyan04
College: MVJ College of Engineering, Bengaluru
