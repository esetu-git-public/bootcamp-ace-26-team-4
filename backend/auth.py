import os
import json
import time
import hmac
import hashlib
import secrets
from pathlib import Path
from typing import Optional

import jwt
from fastapi import HTTPException

# Configuration
USERS_FILE = Path("users.json")
JWT_SECRET = os.getenv("JWT_SECRET", "change_this_secret_in_production")
JWT_ALGORITHM = "HS256"
JWT_EXP_SECONDS = int(os.getenv("JWT_EXP_SECONDS", "86400"))  # 1 day

# Ensure users file exists
if not USERS_FILE.exists():
    USERS_FILE.write_text(json.dumps({}), encoding="utf-8")


def _load_users():
    try:
        return json.loads(USERS_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {}


def _save_users(users: dict):
    USERS_FILE.write_text(json.dumps(users, indent=2), encoding="utf-8")


def _hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    # Return (salt, hashed)
    if salt is None:
        salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100_000)
    return salt, hashed.hex()


def create_user(email: str, password: str, name: Optional[str] = None) -> dict:
    users = _load_users()
    if email in users:
        raise HTTPException(status_code=400, detail="User already exists")

    salt, hashed = _hash_password(password)
    users[email] = {
        "email": email,
        "name": name or email.split("@")[0],
        "salt": salt,
        "password_hash": hashed,
        "created_at": int(time.time()),
    }
    _save_users(users)
    return users[email]


def verify_user(email: str, password: str) -> dict:
    users = _load_users()
    if email not in users:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    user = users[email]
    salt = user.get("salt")
    _, hashed = _hash_password(password, salt)
    if not hmac.compare_digest(hashed, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return user


def create_jwt_for_user(user: dict) -> str:
    now = int(time.time())
    payload = {
        "sub": user["email"],
        "name": user.get("name"),
        "iat": now,
        "exp": now + JWT_EXP_SECONDS,
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    # pyjwt returns str in v2
    return token


def decode_jwt(token: str) -> dict:
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return data
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_user(email: str) -> Optional[dict]:
    users = _load_users()
    return users.get(email)
