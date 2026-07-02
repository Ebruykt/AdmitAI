from google import genai
from core.config import settings
import json

client = genai.Client(api_key=settings.gemini_api_key)

CHECK_PROMPT = """
Sana bir {doc_type} belgesinden OCR ile çıkarılmış metin verilecek.
Bu metni analiz et ve SADECE şu JSON formatında cevap ver, başka hiçbir
açıklama ekleme, markdown code fence kullanma:
{{"is_readable": true/false, "detected_fields": {{"name": "...", "date": "..."}}, "issues": ["..."]}}

OCR Metni:
{ocr_text}
"""

def check_document(doc_type: str, ocr_text: str) -> dict:
    if not ocr_text or len(ocr_text.strip()) < 10:
        return {"is_readable": False, "detected_fields": {}, "issues": ["Belge okunamadı"]}

    prompt = CHECK_PROMPT.format(doc_type=doc_type, ocr_text=ocr_text)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    try:
        text = response.text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except (json.JSONDecodeError, AttributeError):
        return {"is_readable": False, "detected_fields": {}, "issues": ["Analiz hatası"]}