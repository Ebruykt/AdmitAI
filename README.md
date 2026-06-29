# AdmitAI

AI-assisted foreign student application system for university admissions. Built as a university internship (staj) project, AdmitAI streamlines the international application process with smart document handling and OCR-based validation.

## Features

- **Multi-tab application form** — Personal info, high school background, contact details, and preferences in a guided, tabbed flow
- **Document upload & validation** — Upload required documents with automated checks for missing or incomplete files
- **OCR processing** — Tesseract-based OCR extracts and verifies data from uploaded documents
- **Authentication** — Secure JWT-based login and registration
- **Object storage** — Document files stored via MinIO

## Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS v4

**Backend**
- FastAPI
- SQLAlchemy
- PostgreSQL
- MinIO (object storage)
- Tesseract OCR
- JWT authentication

**Infrastructure**
- Docker Compose

## Project Structure

```
AdmitAI/
├── backend/
│   ├── core/          # Config, database, security
│   ├── models/        # SQLAlchemy models
│   ├── routers/        # API endpoints (auth, applications, documents)
│   ├── services/      # OCR, storage services
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components & form tabs
│   │   ├── pages/       # Login, Register, Dashboard, Application
│   │   └── services/    # API client
│   └── ...
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL
- MinIO

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file in `backend/` with the required environment variables (database URL, JWT secret, MinIO credentials, etc.).

```bash
uvicorn main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Docker (optional)

```bash
docker-compose up
```

## Status

🚧 In active development. Core infrastructure and authentication are complete; multi-tab application forms, document uploads, and OCR validation are in progress.

## License

This project is part of a university internship program.