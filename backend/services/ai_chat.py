from google import genai
from core.config import settings

client = genai.Client(api_key=settings.gemini_api_key)

SYSTEM_PROMPT = """
Sen bir üniversitenin yabancı uyruklu öğrenci başvuru asistanısın.
Adaylara şu konularda yardımcı oluyorsun:
- Hangi programa başvurabilecekleri
- Gerekli belgeler (diploma, transkript, pasaport, sınav sonucu)
- Başvuru tarihleri ve ücretler
- Dil şartları (Türkçe/İngilizce yeterlilik)
- Denklik ve diploma koşulları

Kurallar:
- Sadece üniversitenin başvuru süreciyle ilgili sorulara cevap ver
- Bilmediğin spesifik bir bilgi sorulursa adayı resmi başvuru
  kılavuzuna yönlendir
- Kısa, anlaşılır ve yardımcı bir dil kullan
- Adayın hangi ülkeden geldiğini ve hangi bölüme ilgi duyduğunu
  öğrenmeye çalış
"""

def ask_assistant(user_message: str, history: list = None) -> str:
    messages = []
    if history:
        messages.extend(history)
    messages.append({"role": "user", "content": user_message})

    full_prompt = SYSTEM_PROMPT + "\n\n"
    for msg in messages:
        role = "Kullanıcı" if msg["role"] == "user" else "Asistan"
        full_prompt += f"{role}: {msg['content']}\n"

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt
    )
    return response.text