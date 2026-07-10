from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.mail_username,
    MAIL_PASSWORD=settings.mail_password,
    MAIL_FROM="noreply@admitai.com",
    MAIL_PORT=2525,
    MAIL_SERVER="sandbox.smtp.mailtrap.io",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
)

async def send_decision_email(to_email: str, decision: str, note: str | None):
    subject = "Başvuru Sonucunuz" if decision == "approved" else "Başvuru Durumunuz"
    body = (
        f"Başvurunuz {'onaylanmıştır' if decision == 'approved' else 'değerlendirilmiştir'}.\n\n"
        f"Not: {note or '-'}"
    )
    message = MessageSchema(
        subject=subject, recipients=[to_email], body=body, subtype="plain"
    )
    fm = FastMail(conf)
    await fm.send_message(message)