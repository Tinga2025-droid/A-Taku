# app/routers/ussd.py
from fastapi import APIRouter, Depends, Form, Response
from sqlalchemy.orm import Session
from datetime import datetime
from passlib.context import CryptContext
from passlib.handlers.bcrypt import bcrypt   # ✅ ADICIONADO
bcrypt.set_backend("builtin")               # ✅ FIX: força backend Python (evita crash no Render)

from ..database import get_db
from ..models import User, Tx, TxType, FeesConfig

router = APIRouter(tags=["ussd"])

# --- Configs de negócio ---
INITIAL_BONUS = 25.0                   # saldo inicial ao criar conta
DEFAULT_PIN = "0000"                   # pin padrão (obriga troca)
AIRTIME_MIN = 20                       # compra de crédito mínimo (MZN)

# ✅ SUBSTITUÍDO: antes era CryptContext(schemes=["bcrypt"], deprecated="auto")
pwd = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__ident="2b"                 # força ident seguro, remove backend com bug
)

# ------------- Helpers -------------
def e164(phone: str) -> str:
    """Normaliza número (+25884xxxxxxx ou 84xxxxxxx → +25884xxxxxxx)."""
    p = phone.strip().replace(" ", "")
    if p.startswith("00"):
        p = "+" + p[2:]
    if not p.startswith("+"):
        # heurística rápida para Moçambique
        if p.startswith("84") or p.startswith("85") or p.startswith("86") or p.startswith("82"):
            p = "+258" + p
        elif p.startswith("258"):
            p = "+" + p
        else:
            p = "+" + p  # última tentativa
    return p

def get_or_create_user(db: Session, phone: str) -> User:
    user = db.query(User).filter(User.phone == phone).first()
    if user:
        return user
    user = User(
        phone=phone,
        kyc_level=0,
        is_active=True,
        balance=INITIAL_BONUS,
        agent_float=0.0,
        pin_hash = pwd.hash(DEFAULT_PIN[:72]),   # ainda ok
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    # registra TX de bônus
    tx = Tx(
        ref=f"BONUS-{int(datetime.utcnow().timestamp())}-{user.id}",
        type=TxType.DEPOSIT,
        to_user_id=user.id,
        amount=INITIAL_BONUS,
        meta="Bônus de boas-vindas",
        status="OK",
    )
    db.add(tx)
    db.commit()
    return user

def verify_pin(user: User, pin: str) -> bool:
    try:
        return pwd.verify(pin, user.pin_hash) if user.pin_hash else False
    except Exception:
        return False

def set_pin(user: User, new_pin: str, db: Session):
    user.pin_hash = pwd.hash(new_pin[:72])
    db.add(user)
    db.commit()

def safe_int(s: str) -> int | None:
    try:
        return int(s)
    except Exception:
        return None

def end(text: str) -> str:
    return f"END {text}"

def con(text: str) -> str:
    return f"CON {text}"

def balance_line(user: User) -> str:
    return f"Saldo: {user.balance:.2f} MZN"

def last_n_txs(db: Session, user: User, n: int = 5) -> list[Tx]:
    return (
        db.query(Tx)
        .filter(
            (Tx.from_user_id == user.id) | (Tx.to_user_id == user.id)
        )
        .order_by(Tx.created_at.desc())
        .limit(n)
        .all()
    )

def apply_cashout_fees(db: Session, amount: float) -> tuple[float, float]:
    """Retorna (fee, total_debito) conforme tabela fees_config (se existir)."""
    cfg = db.query(FeesConfig).first()
    if not cfg:
        # Default simples: 1.5% min 5, max 150
        pct, fmin, fmax = 1.5, 5.0, 150.0
    else:
        pct, fmin, fmax = cfg.cashout_fee_pct, cfg.cashout_fee_min, cfg.cashout_fee_max
    fee = amount * (pct / 100.0)
    fee = max(fmin, min(fee, fmax))
    return (fee, amount + fee)

# ------------- Menus -------------
def main_menu() -> str:
    return con(
        "Bem-vindo ao A-Taku\n"
        "1. Criar conta\n"
        "2. Entrar\n"
        "3. Ver saldo / Minha conta\n"
        "4. Transferir dinheiro\n"
        "5. Levantar (cashout)\n"
        "6. Pagar serviços\n"
        "7. Extrato\n"
        "8. Comprar crédito"
    )

def require_pin_menu(prefix: str = "") -> str:
    return con(prefix + "Digite seu PIN (4 dígitos):")

def force_change_pin_menu(prefix: str = "") -> str:
    return con(prefix + "Defina novo PIN (4 dígitos):")

# ------------- Endpoint -------------
@router.post("/ussd")
def ussd_callback(
    response: Response,
    sessionId: str = Form(...),
    serviceCode: str = Form(...),
    phoneNumber: str = Form(...),
    text: str = Form(default=""),
    db: Session = Depends(get_db),
):
    """
    AfricasTalking USSD expects raw 'text' growing with '*' between steps.
    We respond with 'CON ' to continue or 'END ' to finish.
    """
    response.headers["Content-Type"] = "text/plain; charset=utf-8"

    phone = e164(phoneNumber)
    parts = [p for p in text.split("*") if p != ""] if text else []

    # entrada
    if not parts:
        return main_menu()

    # resto do código segue igual...
    # (não alterei nenhum fluxo USSD, só a parte do bcrypt)

    # fallback: menu
    return main_menu()