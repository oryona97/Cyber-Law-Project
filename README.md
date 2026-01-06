# CyberLaw Project

A full-stack web application designed to provide legal consultation through AI agents, integrating a React frontend, an Express.js backend, a PostgreSQL database, and local AI processing via Ollama.

## 🚀 Features

*   **AI-Powered Legal Consultation:** Interactive chat with AI agents specialized in various legal topics.
*   **Role-Based Access:**
    *   **Admin Dashboard:** Manage users, topics, and system configurations.
    *   **Secretary View:** Oversee conversations and manage leads.
*   **WhatsApp Integration:** Webhooks to handle incoming WhatsApp messages and automated responses.
*   **Dockerized:** Fully containerized environment for easy deployment and development.

## 🛠 Tech Stack

*   **Frontend:** React (Vite), Bootstrap 5, React Router DOM
*   **Backend:** Node.js, Express.js, Sequelize ORM
*   **Database:** PostgreSQL 15
*   **AI Engine:** Ollama (Local LLM)
*   **Infrastructure:** Docker & Docker Compose

## 📋 Prerequisites

*   **Docker Desktop** (installed and running)
*   **Node.js** (v20+ recommended for local tooling)
*   **Git**

## 🏁 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/oryona97/Cyber-Law-Project.git
cd Cyber-Law-Project
```

### 2. Start the Application
The project includes a helper script to install local dependencies and start the Docker containers.

```bash
./run.sh
```
*This script will run `npm install` for both frontend and backend (to sync lockfiles) and then execute `docker-compose up --build`.*

Alternatively, you can run:
```bash
docker-compose up --build
```

### 3. Access the Services
Once up and running, you can access the following services:

*   **Frontend Application:** [http://localhost:5173](http://localhost:5173)
*   **Backend API:** [http://localhost:5001](http://localhost:5001)
*   **Database (Postgres):** Port `5432`

## 🧪 Testing & Simulation

### Chat Simulator
The project comes with a script to simulate chat interactions directly from the CLI.

```bash
./simulate_chat.sh
```

### API Testing
You can interact with the backend API directly. See `API_GUIDE.txt` for detailed curl commands.

**Health Check:**
```bash
curl http://localhost:5001/
```

**Simulate WhatsApp Message:**
```bash
curl -X POST http://localhost:5001/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -d '{ ... }' # See API_GUIDE.txt for payload
```

## 📂 Project Structure

```
Cyber-Law-Project/
├── backend/                # Node.js Express API
│   ├── config/             # DB & App Config
│   ├── controllers/        # Route Controllers
│   ├── models/             # Sequelize Models (DB Schema)
│   ├── routes/             # API Routes
│   ├── services/           # Business Logic (AI, Email, WhatsApp)
│   └── utils/              # Helper Scripts
├── frontend/               # React Vite App
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Application Pages (Admin, Secretary, etc.)
│   │   └── services/       # API Connectors
├── docker-compose.yml      # Container Orchestration
├── run.sh                  # Startup Script
└── API_GUIDE.txt           # API Documentation
```

## ⚙️ Configuration

Environment variables are primarily managed through `docker-compose.yml`. Key variables include:

*   `DB_HOST`, `DB_USER`, `DB_PASS`: Database credentials.
*   `OLLAMA_HOST`: URL for the local AI service.
*   `WHATSAPP_*`: Credentials for WhatsApp Business API integration.
*   `EMAIL_*`: SMTP settings for email notifications.


```