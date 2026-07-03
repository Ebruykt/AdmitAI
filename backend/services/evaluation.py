from google import genai
from core.config import settings
import json

client = genai.Client(api_key=settings.gemini_api_key)

EVAL_PROMPT = """
Sen bir üniversite personeline yardımcı olan bir ön değerlendirme asistanısın.
Sana bir adayın başvuru bilgileri verilecek. Bu bilgileri değerlendirip
SADECE şu JSON formatında cevap ver, başka hiçbir açıklama ekleme,
markdown code fence kullanma:
{{"score": 0-100 arası sayı, "summary": "2-3 cümlelik özet", "warnings": ["varsa tutarsızlıklar"]}}

Aday Bilgileri:
{application_data}
"""

def evaluate_application(application_data: dict) -> dict:
    prompt = EVAL_PROMPT.format(
        application_data=json.dumps(application_data, ensure_ascii=False)
    )

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    try:
        text = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(text)
    except (json.JSONDecodeError, AttributeError):
        return {"score": None, "summary": "Değerlendirme yapılamadı", "warnings": []}