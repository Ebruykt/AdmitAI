from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from core.security import get_current_user
from models.chat import ChatMessage
from services.ai_chat import ask_assistant

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str

@router.post("/")
def send_message(
    data: ChatRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    previous = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id
    ).order_by(ChatMessage.created_at).limit(10).all()
    
    history = [{"role": m.role, "content": m.content} for m in previous]
    reply = ask_assistant(data.message, history)
    
    db.add(ChatMessage(user_id=user.id, role="user", content=data.message))
    db.add(ChatMessage(user_id=user.id, role="assistant", content=reply))
    db.commit()
    
    return {"reply": reply}

@router.get("/history")
def get_history(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    messages = db.query(ChatMessage).filter(
        ChatMessage.user_id == user.id
    ).order_by(ChatMessage.created_at).all()
    return messages