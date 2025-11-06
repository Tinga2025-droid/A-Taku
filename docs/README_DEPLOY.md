# A‑Taku — Deploy rápido (Railway/VPS) e Apps

## Backend local
```
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r app/requirements.txt
uvicorn app.main:app --reload --port 8080
```

## Docker
```
cd backend
docker build -t ataku-api .
docker run -p 8080:8080 --env-file .env ataku-api
```

## Rotas principais
- POST /auth/otp
- POST /auth/login
- GET  /wallet/balance
- POST /wallet/send
- GET  /wallet/history
- POST /agent/login
- POST /agent/seed
- POST /agent/deposit
- POST /agent/cashout
- POST /admin/fees

## Mobile
- `mobile-client/` — cliente final
- `mobile-agent/` — operador/agente
Editar `app.json` → `extra.apiUrl` para apontar para seu backend (HTTPS).
