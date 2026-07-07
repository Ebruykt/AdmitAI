from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from core.security import get_current_user
from datetime import datetime
from models.document import Document
from services.evaluation import evaluate_application
from models.application import Application, ProgramChoice
from core.security import require_staff

router = APIRouter(prefix="/applications", tags=["applications"])
REQUIRED_DOCS = ["diploma", "transcript", "passport"]


class PersonalInfo(BaseModel):
    passport_no: str
    first_name: str
    last_name: str
    nationality: str
    gender: str
    birth_place: str

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    status: str
    passport_no: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    nationality: str | None = None
    gender: str | None = None
    birth_place: str | None = None
    high_school_name: str | None = None
    high_school_country: str | None = None
    gpa: float | None = None
    country: str | None = None
    city: str | None = None
    district: str | None = None
    address: str | None = None
    phone: str | None = None
    ai_score: float | None = None
    ai_summary: str | None = None

    class Config:
        from_attributes = True

@router.post("/", response_model=ApplicationResponse)
def create_application(db: Session = Depends(get_db), user=Depends(get_current_user)):
    app_ = Application(user_id=user.id, status="draft")
    db.add(app_)
    db.commit()
    db.refresh(app_)
    return app_

@router.put("/{app_id}/personal", response_model=ApplicationResponse)
def update_personal(app_id: int, data: PersonalInfo, db: Session = Depends(get_db)):
    app_ = db.query(Application).filter(Application.id == app_id).first()
    if not app_:
        raise HTTPException(404, "Başvuru bulunamadı")
    for key, value in data.dict().items():
        setattr(app_, key, value)
    db.commit()
    db.refresh(app_)
    return app_

class HighSchoolInfo(BaseModel):
    high_school_name: str
    high_school_country: str
    gpa: float
    graduation_date: str  # "YYYY-MM-DD" formatında

@router.put("/{app_id}/highschool", response_model=ApplicationResponse)
def update_highschool(app_id: int, data: HighSchoolInfo, db: Session = Depends(get_db)):
    app_ = db.query(Application).filter(Application.id == app_id).first()
    if not app_:
        raise HTTPException(404, "Başvuru bulunamadı")
    app_.high_school_name = data.high_school_name
    app_.high_school_country = data.high_school_country
    app_.gpa = data.gpa
    app_.graduation_date = datetime.strptime(data.graduation_date, "%Y-%m-%d")
    db.commit()
    db.refresh(app_)
    return app_

class ContactInfo(BaseModel):
    country: str
    city: str
    district: str
    address: str
    phone: str

@router.put("/{app_id}/contact", response_model=ApplicationResponse)
def update_contact(app_id: int, data: ContactInfo, db: Session = Depends(get_db)):
    app_ = db.query(Application).filter(Application.id == app_id).first()
    if not app_:
        raise HTTPException(404, "Başvuru bulunamadı")
    app_.country = data.country
    app_.city = data.city
    app_.district = data.district
    app_.address = data.address
    app_.phone = data.phone
    db.commit()
    db.refresh(app_)
    return app_


class ChoiceRequest(BaseModel):
    faculty: str
    program_name: str
    priority_order: int

class ChoiceResponse(BaseModel):
    id: int
    application_id: int
    faculty: str
    program_name: str
    priority_order: int

    class Config:
        from_attributes = True

@router.post("/{app_id}/choices", response_model=ChoiceResponse)
def add_choice(app_id: int, data: ChoiceRequest, db: Session = Depends(get_db)):
    from models.application import ProgramChoice
    existing_count = db.query(ProgramChoice).filter(
        ProgramChoice.application_id == app_id).count()
    if existing_count >= 4:
        raise HTTPException(400, "En fazla 4 program seçebilirsiniz")
    choice = ProgramChoice(application_id=app_id, **data.dict())
    db.add(choice)
    db.commit()
    db.refresh(choice)
    return choice

@router.get("/{app_id}/missing")
def check_missing(app_id: int, db: Session = Depends(get_db)):
    uploaded = db.query(Document).filter(
        Document.application_id == app_id).all()
    uploaded_types = {d.doc_type for d in uploaded}
    missing = [d for d in REQUIRED_DOCS if d not in uploaded_types]
    return {"missing": missing, "complete": len(missing) == 0}


@router.post("/{app_id}/submit", response_model=ApplicationResponse)
def submit_application(app_id: int, db: Session = Depends(get_db)):
    missing = check_missing(app_id, db)
    if not missing["complete"]:
        raise HTTPException(400, f"Eksik belgeler var: {missing['missing']}")

    app_ = db.query(Application).filter(Application.id == app_id).first()
    if not app_:
        raise HTTPException(404, "Başvuru bulunamadı")

    top_choice = db.query(ProgramChoice).filter(
        ProgramChoice.application_id == app_id
    ).order_by(ProgramChoice.priority_order).first()

    app_data = {
        "name": f"{app_.first_name} {app_.last_name}",
        "nationality": app_.nationality,
        "gpa": app_.gpa,
        "high_school": app_.high_school_name,
        "preferred_program": top_choice.program_name if top_choice else None,
        "faculty": top_choice.faculty if top_choice else None,
    }
    result = evaluate_application(app_data)

    app_.ai_score = result["score"]
    app_.ai_summary = result["summary"]
    app_.status = "submitted"
    db.commit()
    db.refresh(app_)
    return app_

@router.get("/staff/all")
def all_applications_for_staff(
    status: str = None, db: Session = Depends(get_db), staff=Depends(require_staff)
):
    query = db.query(Application).filter(Application.status == "submitted") if not status else db.query(Application).filter(Application.status == status)
    return query.order_by(Application.ai_score.desc()).all()

@router.get("/{app_id}/full")
def get_full_application(
    app_id: int, db: Session = Depends(get_db), staff=Depends(require_staff)
):
    app_ = db.query(Application).filter(Application.id == app_id).first()
    if not app_:
        raise HTTPException(404, "Başvuru bulunamadı")

    documents = db.query(Document).filter(
        Document.application_id == app_id).all()
    choices = db.query(ProgramChoice).filter(
        ProgramChoice.application_id == app_id).all()

    return {
        "application": app_,
        "documents": documents,
        "choices": choices
    }