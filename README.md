# 🧠 Smart Communication Hub

A real-time chat dashboard with AI-powered insights that summarize or tag conversations.  

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Sequelize ORM |
| **Real-Time** | Socket.io |
| **AI Integration** | HuggingFace|
| **Deployment (Optional)** | Vercel / Render / Docker |

---

## 📂 Project Structure

```
Smart-Communication-Hub/
│
├── client/                             # Frontend (Next.js + TypeScript)
│   └── src/
│       ├── app/                        # App Router entry
│       │   ├── login/                  # Login page
│       │   ├── register/               # Registration page
│       │   └── dashboard/              # Dashboard route (page only)
│       │        └── page.tsx           
│       │
│       ├── components/                 # Shared/global components
│       │   ├── DashboardContainer.tsx  # Container (logic & state)
│       │   └── DashboardView.tsx       # UI-only presentation
│       │
│       ├── lib/
│       │   └── api/                    # api layer
│       │        ├── messages.ts
│       │        ├── users.ts
│       │        └── insights.ts
│       │
│       ├── hooks/
│       │   └── useSocket.ts            # custom hooks
│       │
│       ├── context/
│       │   └── AuthContext.ts          # context & persistence
│       │
│       ├──types/                      # Shared TypeScript types
│       └──utils/                      # small helper utilities used
│
├── server/                             # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/                     # Environment & 3rd-party config
│   │   ├── controllers/                # HTTP route handlers
│   │   ├── services/                   # Business logic (AI insights, messaging)
│   │   │   └── interfaces/             # DTOs / service contracts
│   │   ├── repositories/               # Data access layer (DB queries)
│   │   ├── models/                     # Database models (ORM)
│   │   ├── sockets/                    # socket io 
│   │   ├── routes/                     # API route definitions
│   │   └── app.ts, server.ts           # Express  server init
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json

```

---

## ⚙️ Backend Setup (Server)

### 1️⃣ Create `.env` file inside `/server`
```bash
PORT=5000
DB_NAME=your_database_name
DB_USER=your_database_user
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_PASS=your_database_password
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 2️⃣ Install dependencies
```bash
cd server
npm install
```

### 3️⃣ Run development server
```bash
npm run dev
```

---

## 💻 Frontend Setup (Client)

### 1️⃣ Create `.env.local` file inside `/client`
```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5050
```

### 2️⃣ Install dependencies
```bash
cd client
npm install
```

### 3️⃣ Start frontend
```bash
npm run dev
```

Visit: 👉 [http://localhost:3000](http://localhost:3000)

---

## 🧱Finished Features

- ✅ JWT Authentication (Register/Login)
- ✅ Real-Time Chat via Socket.io
- ✅ AI-Powered Conversation Insights (HuggingFace)
- ✅ PostgreSQL Database Integration
- ✅ Mobile Responsive Dashboard
- ✅ Online Users Indicator

---

## 📖 Branching Convention

| Branch | Purpose |
|--------|----------|
| `main` | Stable production code |
| `dev` | Development integration branch |
| `feature/*` | Individual feature branches (e.g. `feature/auth`, `feature/chat`) |

---

## 💬 Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix a bug
chore: maintenance or config changes
docs: update documentation
refactor: improve structure or performance
style: UI or formatting changes
test: add or update tests
```

Example:
```
feat(auth): implement user registration and login
```

---

## 🧠 AI Insights (Summarization & Sentiment)

This project uses AI to analyze conversations between users and generate:
- A short summary of the chat
- Overall sentiment (positive, negative, or neutral)

AI is used here to enhance user experience, provide quick context, and enable conversation analytics.

HuggingFace models were integrated for free and reliable inference during development.
 OpenAI integration was included as an optional alternative for environments with available credits. The generated insights are stored in an `insights` table and updated whenever a conversation changes.

## 🧩 Author

**Amany Hamdy**  
Full Stack Developer
