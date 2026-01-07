# Moat Swarming

A full-stack application with a FastAPI backend and React frontend, designed for collaborative swarming and moat-based operations.

## Project Structure

```
MoatSwarming/
├── backend/                 # FastAPI backend service
│   ├── main.py             # FastAPI application entry point
│   ├── requirements.txt     # Python dependencies
│   └── __pycache__/        # Python cache directory
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Application styles
│   │   ├── index.css      # Global styles
│   │   ├── main.jsx       # React entry point
│   │   └── assets/        # Static assets
│   ├── public/            # Public static files
│   ├── package.json       # Node.js dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── eslint.config.js   # ESLint configuration
│   ├── index.html         # HTML entry point
│   └── README.md          # Frontend-specific documentation
└── requirements.txt       # Root-level Python dependencies (empty)
```

## Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server for running FastAPI
- **SQLAlchemy** - SQL toolkit and ORM

### Frontend
- **React** (v19.2.0) - UI library
- **Vite** (v7.2.4) - Build tool and dev server
- **ESLint** (v9.39.1) - Code linting

## Prerequisites

- **Python 3.7+** (for backend)
- **Node.js 16+** (for frontend)
- **npm or yarn** (for package management)

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

4. **Run the backend server:**
   ```bash
   uvicorn main:app --reload
   ```
   
   The backend will be available at `http://localhost:8000`
   
   **API Endpoints:**
   - `GET /` - Welcome message
   - `GET /health` - Health check
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