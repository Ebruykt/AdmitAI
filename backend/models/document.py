from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from core.database import Base

class Document(Base):
    __tablename__ = "documents"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    doc_type = Column(String)
    file_url = Column(String)
    ocr_text = Column(String, nullable=True)
    is_valid = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, server_default=func.now())