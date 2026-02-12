from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# SECRET KEY
SECRET_KEY = "sefs-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Use argon2 instead of bcrypt (no 72-byte limit)
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Fake user DB (for hackathon)
users_db = {}

def hash_password(password: str) -> str:
    """Hash any-length password safely with argon2."""
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """Verify password safely."""
    return pwd_context.verify(plain, hashed)

def create_user(username: str, password: str):
    """Create user if not exists."""
    if username not in users_db:
        users_db[username] = hash_password(password)

def authenticate_user(username: str, password: str) -> bool:
    """Authenticate user."""
    if username not in users_db:
        return False
    return verify_password(password, users_db[username])

def create_access_token(data: dict):
    """Create JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
