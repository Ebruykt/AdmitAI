from minio import Minio
from core.config import settings
import uuid
import io

client = Minio(
    settings.minio_endpoint,
    access_key=settings.minio_access_key,
    secret_key=settings.minio_secret_key,
    secure=False
)

BUCKET = "belgeler"

def upload_file(file_bytes: bytes, filename: str, content_type: str) -> str:
    unique_name = f"{uuid.uuid4()}_{filename}"
    client.put_object(
        BUCKET, unique_name, io.BytesIO(file_bytes),
        length=len(file_bytes), content_type=content_type
    )
    return f"http://{settings.minio_endpoint}/{BUCKET}/{unique_name}"