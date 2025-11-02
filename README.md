# 🧠 Smart Communication Hub

A real-time chat dashboard with AI-powered insights that summarize or tag conversations.  
Built as part of the **V.Connct Full Stack Developer Challenge**.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL with Sequelize ORM |
| **Real-Time** | Socket.io |
| **AI Integration** | OpenAI API |
| **Deployment (Optional)** | Vercel / Render / Docker |

---

## 📂 Project Structure

```
Smart-Communication-Hub/
│
├── client/                # Frontend (Next.js + TypeScript)
│   ├── src/
│   ├── public/
│   ├── .env.local
│   └── package.json
│
├── server/                # Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── services/
|   |   ├─────interfaces/
│   │   ├── repositories/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.ts, server.ts
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

## 🧱 Upcoming Features

- ✅ JWT Authentication (Register/Login)
- ✅ Real-Time Chat via Socket.io
- ✅ AI-Powered Conversation Insights (OpenAI API)
- ✅ PostgreSQL Database Integration
- ✅ Mobile Responsive Dashboard
- ✅ Online Users Indicator
- ✅ Docker Deployment (optional)

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

## 🧠 About AI Integration

AI insights will summarize or tag user conversations.  
This will be implemented using the **OpenAI API** (via `text-embedding` or `chat/completions` endpoint).  
A lightweight `insights` table will store each conversation’s summary and sentiment.

---

## 🧩 Author

**Amany Hamdy**  
Full Stack Developer
