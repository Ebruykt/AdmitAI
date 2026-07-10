from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from core.database import Base

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    passport_no = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    nationality = Column(String)
    gender = Column(String)
    birth_place = Column(String)
    birth_date = Column(DateTime)
    high_school_name = Column(String)
    high_school_country = Column(String)
    gpa = Column(Float)
    graduation_date = Column(DateTime)
    preferred_program = Column(String)
    country = Column(String)
    city = Column(String)
    district = Column(String)
    address = Column(String)
    phone = Column(String)
    status = Column(String, default="draft")
    ai_score = Column(Float, nullable=True)
    ai_summary = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    staff_note = Column(String, nullable=True)

class ProgramChoice(Base):
    __tablename__ = "program_choices"
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"))
    faculty = Column(String)
    program_name = Column(String)
    priority_order = Column(Integer)