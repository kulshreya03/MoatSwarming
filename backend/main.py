from routes import tasks_routes
from routes import database_auth_routes, agent_routes
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Moat Swarming Backend")
app.add_middleware(CORSMiddleware, 
                   allow_origins=["*"], 
                   allow_credentials=True,
                   allow_methods=["*"], 
                   allow_headers=["*"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Moat Swarming Backend!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(database_auth_routes.router)
app.include_router(agent_routes.router)
app.include_router(tasks_routes.router)