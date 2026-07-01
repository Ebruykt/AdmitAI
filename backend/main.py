from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.database import Base, engine
from models import user, application, document, chat
from routers import auth, applications, documents, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AdmitAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(applications.router)
app.include_router(documents.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"status": "running"}