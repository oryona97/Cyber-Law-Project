# Project Overview

This is a full-stack web application designed for a "CyberLaw" project. It integrates a React frontend, an Express.js backend, a PostgreSQL database, and n8n for workflow automation (specifically for handling WhatsApp interactions and AI agents).

## Architecture

The project is containerized using **Docker** and consists of the following services:

*   **Frontend (`frontend/`):** A **React** application built with **Vite**.
    *   Runs on port `5173`.
    *   Includes a standard structure with `components`, `pages`, and `services`.
*   **Backend (`backend/`):** A **Node.js/Express** REST API.
    *   Runs on port `5000`.
    *   Uses **Sequelize** as an ORM to interact with PostgreSQL.
    *   Structured with `controllers`, `models`, `routes`, `middleware`, and `config`.
*   **Database (`db`):** A **PostgreSQL** instance.
    *   Runs on port `5432`.
    *   Data is persisted in the `postgres_data` volume.
*   **Automation (`n8n`):** An **n8n** instance for workflow automation.
    *   Runs on port `5678`.
    *   Intended to handle WhatsApp message processing and AI logic.

## Key Features

*   **Data Models:** Comprehensive schema including `User`, `Topic`, `ExpertConfig` (for AI personas), `Conversation`, `Message`, `Lawyer`, and `Lead`.
*   **Dockerized Environment:** One-command startup for the entire stack.
*   **Local Development:** Scripts to keep local dependencies in sync with the container environment.

---

# Building and Running

The project includes a helper script to simplify the startup process.

### Prerequisites
*   **Docker Desktop** must be installed and running.
*   **Node.js** (v20+) is recommended for local dependency management (IntelliSense), though the app runs inside Docker.

### Start the Application
To install dependencies and start all services (Backend, Frontend, Database, n8n):

```bash
./run.sh
```

This script will:
1.  Run `npm install` locally in both `backend/` and `frontend/` (to update lockfiles).
2.  Execute `docker-compose up --build` to start the containers.

### Accessing Services
*   **Frontend:** [http://localhost:5173](http://localhost:5173)
*   **Backend API:** [http://localhost:5001](http://localhost:5001)
*   **n8n Dashboard:** [http://localhost:5678](http://localhost:5678)

---

# Development Conventions

## Directory Structure

*   **`backend/`**
    *   `config/`: Database and environment configuration.
    *   `controllers/`: Request handling logic.
    *   `models/`: Sequelize schemas (User, Conversation, etc.).
    *   `routes/`: API endpoint definitions.
    *   `middleware/`: Request pre-processing (auth, validation).
*   **`frontend/`**
    *   `src/components/`: Reusable UI elements (Buttons, Forms).
    *   `src/pages/`: Full-page views (Home, Dashboard).
    *   `src/services/`: API client functions (axios/fetch wrappers).

## Database Management
The backend is configured to automatically synchronize models with the database on startup (`sequelize.sync({ alter: true })`). This means changing a model file (`backend/models/*.js`) and restarting the server will automatically update the database schema.

## AI & Automation
*   **n8n** is used to orchestrate complex flows, such as receiving WhatsApp webhooks, querying the backend, and calling AI models.
*   The `ai_services/` directory is reserved for Python scripts or standalone AI models if needed in the future.
