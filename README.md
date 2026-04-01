# Moat Swarming

**The Moat Swarming Framework is an open, collaborative software platform designed to empower individuals—particularly the unemployed and underemployed—to collectively analyze, deconstruct, and replicate the business models of dominant market incumbents.** The framework provides a secure, modular environment where users can form teams, conduct open-source intelligence gathering, reverse engineer products and services, and co-create parallel ventures. Core features include a moat analysis engine, project management tools, skill-matching algorithms, knowledge repositories, and integrated legal/ethical compliance modules. The platform emphasizes transparency, ethical collaboration, and sustainable business creation, offering built-in mechanisms for profit-sharing, community governance, and ongoing mentorship. By democratizing access to business innovation and lowering barriers to entrepreneurship, the Moat Swarming Framework aims to redistribute opportunity, foster economic inclusion, and challenge entrenched monopolies through collective action.

## Project Structure

```
MoatSwarming/
├── backend/                 # FastAPI backend service and agents logic
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   ├── state.py            # Application state and configurations
│   ├── graph.py            # Graph utilities for moat/swarm logic
│   ├── llm.py              # Language model integration helpers
│   ├── database/           # Database layer
│   │   ├── database.py     # Connection and session management
│   │   ├── models.py       # ORM models
│   │   └── db_schema.txt   # Schema description
│   ├── routes/             # API route definitions
│   │   ├── admin_routes.py # Admin dashboard and project management
│   │   ├── agent_routes.py # Agent skills and task matching
│   │   ├── database_auth_routes.py # Authentication endpoints
│   │   └── tasks_routes.py # Task status updates
│   ├── services/           # External service integrations
│   │   └── github_mcp_service.py # GitHub commit analytics via MCP
│   ├── agents/             # Agent skills and behavior modules
│   │   ├── skill_extract.py # Resume PDF skill extraction
│   │   ├── skill_match.py  # Skill-to-task matching algorithm
│   │   └── task_decompose.py # AI-powered project task decomposition
│   ├── alembic.ini         # DB migration config
│   ├── alembic/            # Migration scripts
│   └── __pycache__/
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Application styles
│   │   ├── index.css      # Global styles
│   │   ├── main.jsx       # React entry point
│   │   ├── assets/        # Static assets
│   │   ├── pages/         # Page components
│   │   │   ├── AdminDashboard.jsx # Admin project and task management
│   │   │   ├── AdminLogin.jsx     # Admin authentication
│   │   │   ├── AdminPage.jsx      # Admin interface
│   │   │   ├── HomePage.jsx       # Landing page
│   │   │   ├── TasksPage.jsx      # Task viewing and assignment
│   │   │   ├── Userlogin.jsx      # User authentication
│   │   │   └── UserPage.jsx       # User dashboard
│   │   └── css/           # CSS modules for styling
│   ├── public/            # Public static files
│   ├── package.json       # Node.js dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── eslint.config.js   # ESLint configuration
│   ├── index.html         # HTML entry point
│   └── README.md          # Frontend-specific documentation
└── requirements.txt       # Root-level Python dependencies (empty)
```

The backend has evolved beyond a simple "main.py"; it now includes state management, agent skills, database models, and routing modules. The frontend continues to use React with Vite and includes dedicated CSS modules for pages like admin and user flows.


## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server for running FastAPI
- **SQLAlchemy** - Database toolkit and ORM
- **PostgreSQL** - Database (via psycopg2-binary)
- **Alembic** - Database migration tool
- **LangChain** - LLM integration framework
- **LangGraph** - Graph-based agent orchestration
- **Google Generative AI** - AI model provider
- **PyPDF2** - PDF processing for resume extraction
- **MCP (Model Context Protocol)** - GitHub integration client
- **GitHub MCP service** - Integration for agent coordination and commit analytics

### Frontend
- **React** (v19.2.0) - UI library
- **Vite** (v7.2.4) - Build tool and dev server
- **React Router DOM** (v7.11.0) - Client-side routing
- **ESLint** (v9.39.1) - Code linting


## Features & Highlights

- **Agent Skill Processing** – Upload resumes for PDF skill extraction (`/agent/extract-skills`) and match candidates to tasks based on a skill matrix.
- **Task Discovery** – View available tasks and ongoing assignments including GitHub commit counts to monitor progress (`/agent/view-tasks`, `/agent/view-ongoing-tasks`).
- **Authentication** – Secure login endpoint for users (`/auth/login`) and admins (`/auth/admin-login`) with database validation.
- **Task Management** – Endpoints to update task status and manage assignments (`/tasks/update-status`).
- **Admin Dashboard** – Comprehensive admin interface for project creation, task decomposition using AI, dashboard metrics, user management, and task completion tracking (`/admin/dashboard`, `/admin/create-project`, `/admin/users-with-tasks`, `/admin/update-task-status`, `/admin/completed-tasks`).
- **AI-Powered Task Decomposition** – Automatically generate project tasks using LLM when creating new projects.
- **Skill Matching Algorithm** – Intelligent matching of user skills to project tasks using both rule-based and AI-powered approaches.
- **GitHub Integration** – Real-time commit count tracking via MCP for progress monitoring.
- **Modular Backend** – State management, graph utilities, and LLM integration in separate modules.
- **Database Layer** – SQLAlchemy models with Alembic migrations and a documented schema in `database/db_schema.txt`.
- **Frontend Structure** – React pages organized with CSS modules for admin/user workflows; real-time data fetched from backend APIs.
- **CORS Enabled** – Backend configured to allow cross-origin access; adjust for production.

The architecture supports evolution toward a comprehensive moat analysis and collaborative project management platform.

## Prerequisites

- **Python 3.7+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (for package management)
- **PostgreSQL** (database)
- **GitHub Personal Access Token** (for MCP integration)
- **GitHub MCP Server** (path to the MCP executable)

## Installation & Setup

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment (recommended):**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   
   This will install:
   - `fastapi` - Web framework
   - `uvicorn` - ASGI server
   - `sqlalchemy` - Database ORM
   - `psycopg2-binary` - PostgreSQL driver
   - `alembic` - Database migrations
   - `langchain` - LLM framework
   - `langgraph` - Graph-based orchestration
   - `langchain-google-genai` - Google AI integration
   - `python-multipart` - File upload handling
   - `PyPDF2` - PDF processing
   - `mcp` - Model Context Protocol client

4. **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```
   
   The backend will be available at `http://localhost:8000`
   
   **API Endpoints:**
   - `GET /` – Welcome message
   - `GET /health` – Health check
   - `POST /auth/login` – Authenticate user with email/password
   - `POST /auth/admin-login` – Authenticate admin with email/password
   - `POST /agent/extract-skills` – Upload a resume (PDF) and extract skills via agent
   - `GET /agent/user/skills/{user_id}` – Retrieve stored skills for a user
   - `PUT /agent/user/skills` – Update skills for a user
   - `GET /agent/view-tasks/{user_id}` – Retrieve tasks matched to current skills
   - `GET /agent/view-ongoing-tasks` – Admin view of assigned tasks with GitHub commit counts
   - `POST /tasks/update-status?task_id=<id>&user_id=<id>` – Mark a task as assigned
   - `GET /admin/dashboard` – Get admin dashboard metrics
   - `GET /admin/users-with-tasks` – Get users and their assigned tasks
   - `POST /admin/create-project` – Create a new project and generate tasks using AI
   - `PUT /admin/update-task-status` – Mark a task as completed
   - `GET /admin/completed-tasks` – Retrieve completed tasks
   - API documentation available at `http://localhost:8000/docs` (Swagger UI)

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
   
   This will install all dependencies listed in `package.json`:
   - React and React DOM
   - Vite and related plugins
   - ESLint and linting tools
   - React Router DOM for routing

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will typically be available at `http://localhost:5173`

### Running Both Services

To run the full application locally, you need to run both services simultaneously:

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Available Scripts

### Frontend Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build locally

### Backend Scripts

The backend runs with:
```bash
uvicorn main:app --reload
```

For production, remove the `--reload` flag.

## API Configuration

The backend is configured with CORS middleware to allow requests from any origin:
- `allow_origins=["*"]` - Allow all origins
- `allow_methods=["*"]` - Allow all HTTP methods
- `allow_headers=["*"]` - Allow all headers

**Note:** Update CORS settings in production to restrict origins appropriately.

## Development Workflow

1. **Start the backend server** (Terminal 1)
2. **Start the frontend dev server** (Terminal 2)
3. **Frontend** communicates with backend API at `http://localhost:8000`
4. **Make changes** - Vite hot-reloads frontend, Uvicorn auto-reloads backend with `--reload`

## Building for Production

### Frontend Production Build
```bash
cd frontend
npm run build
```
Output will be in the `frontend/dist/` directory.

### Backend Production Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

### Port Already in Use
If ports 8000 or 5173 are already in use, you can specify different ports:
- Backend: `uvicorn main:app --port 8001`
- Frontend: `npm run dev -- --port 5174`

### Virtual Environment Issues
Make sure to activate the virtual environment before installing dependencies:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

### CORS Issues
Ensure both frontend and backend are running and the frontend is making requests to the correct backend URL.

## Authors

- Shreya Kulkarni
- Ansh Palekar