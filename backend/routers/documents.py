from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from core.database import get_db
from models.document import Document
from services.storage import upload_file
from services.ocr import extract_text
from services.document_check import check_document

router = APIRouter(prefix="/documents", tags=["documents"])

class DocumentResponse(BaseModel):
    id: int
    application_id: int
    doc_type: str
    file_url: str
    is_valid: bool
    ocr_text: str | None = None

    class Config:
        from_attributes = True

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    application_id: int, doc_type: str,
    file: UploadFile = File(...), db: Session = Depends(get_db)
):
    content = await file.read()
    url = upload_file(content, file.filename, file.content_type)

    ocr_text = None
    if file.content_type in ["image/jpeg", "image/png"]:
        ocr_text = extract_text(content)

    check_result = None
    if ocr_text:
        check_result = check_document(doc_type, ocr_text)

    doc = Document(
        application_id=application_id, doc_type=doc_type,
        file_url=url, ocr_text=ocr_text,
        is_valid=check_result["is_readable"] if check_result else False
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc
    doc = Document(
        application_id=application_id, doc_type=doc_type,
        file_url=url, ocr_text=ocr_text
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc