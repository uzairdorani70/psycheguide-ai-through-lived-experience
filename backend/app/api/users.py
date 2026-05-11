from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel, EmailStr
from app.core.database import get_database
from app.core.security import get_password_hash, verify_password, create_access_token
from passlib.context import CryptContext
import jwt
import secrets
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from app.core.config import settings
from fastapi.responses import RedirectResponse

router = APIRouter()

# --- HELPER FUNCTIONS ---

async def send_verification_email(user_email, token):
    sender_email = settings.MAIL_USER 
    app_password = settings.MAIL_PASSWORD
    
    # Ye link user ko active karega
    verify_link = f"http://localhost:8000/auth/verify-email?token={token}"
    
    message = MIMEMultipart()
    message["From"] = f"PsycheGuide <{sender_email}>"
    message["To"] = user_email
    message["Subject"] = "Verify Your Account - PsycheGuide AI"

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="color: #0891b2;">Welcome to PsycheGuide!</h2>
        <p>Please verify your email to activate your account:</p>
        <a href="{verify_link}" style="background-color: #06b6d4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        <p>If you did not sign up, please ignore this email.</p>
      </body>
    </html>
    """
    message.attach(MIMEText(body, "html"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, user_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"⚠️ Verification Email Error: {e}")
        return False

def send_reset_email(user_email, token):
    sender_email = settings.MAIL_USER 
    app_password = settings.MAIL_PASSWORD
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    
    message = MIMEMultipart()
    message["From"] = f"PsycheGuide Support <{sender_email}>"
    message["To"] = user_email
    message["Subject"] = "Password Reset Request"

    body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #0891b2;">Password Reset Request</h2>
        <p>Please click the button below to set a new password:</p>
        <a href="{reset_link}" style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: bold;">Reset Password</a>
        <p>This link will expire in 30 minutes.</p>
      </body>
    </html>
    """
    message.attach(MIMEText(body, "html"))

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(sender_email, app_password)
        server.sendmail(sender_email, user_email, message.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"⚠️ Email Error: {e}")
        return False

# --- INPUT MODELS ---
class UserSignup(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ResetPasswordData(BaseModel):
    token: str
    new_password: str

class UpdateProfile(BaseModel):
    username: Optional[str] = None
    new_password: Optional[str] = None

# --- API ROUTES ---

@router.post("/register")
async def register(user: UserSignup):
    try:
        db = get_database()
        existing_user = await db["users"].find_one({"email": user.email})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        v_token = secrets.token_urlsafe(32)
        hashed_password = get_password_hash(user.password)
        
        new_user = {
            "username": user.username,
            "email": user.email,
            "password": hashed_password,
            "is_active": False,
            "verification_token": v_token,
            "created_at": datetime.utcnow()
        }
        
        await db["users"].insert_one(new_user)
        
        # Sahi tarah se await karein
        await send_verification_email(user.email, v_token)
        
        return {"message": "Registration successful! Please check your email to verify your account."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify-email")
async def verify_email(token: str = Query(...)):
    db = get_database()
    user = await db["users"].find_one({"verification_token": token})
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired verification token")

    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"is_active": True}, "$unset": {"verification_token": ""}}
    )
    
    return RedirectResponse(url="http://localhost:5173/login?verified=true")

@router.post("/login")
async def login(user: UserLogin):
    db = get_database()
    db_user = await db["users"].find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if not db_user.get("is_active", False):
        raise HTTPException(status_code=403, detail="Please verify your email first.")
    
    access_token = create_access_token(data={"sub": db_user["email"], "user_id": str(db_user["_id"])})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": db_user["username"]
    }

@router.post("/forgot-password")
async def forgot_password(data: dict):
    email = data.get("email")
    db = get_database()
    user = await db["users"].find_one({"email": email})
    
    reset_token = secrets.token_urlsafe(32)
    expire_time = datetime.utcnow() + timedelta(minutes=30)

    if user:
        await db["users"].update_one(
            {"email": email},
            {"$set": {"reset_token": reset_token, "reset_token_expires": expire_time}}
        )
        send_reset_email(email, reset_token)

    return {"message": "If your email is registered, a reset link has been sent."}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordData):
    db = get_database()
    user = await db["users"].find_one({
        "reset_token": data.token,
        "reset_token_expires": {"$gt": datetime.utcnow()}
    })

    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    hashed_password = get_password_hash(data.new_password)
    await db["users"].update_one(
        {"_id": user["_id"]},
        {
            "$set": {"password": hashed_password},
            "$unset": {"reset_token": "", "reset_token_expires": ""}
        }
    )
    return {"message": "Password updated successfully!"}

@router.put("/update-profile/{email}")
async def update_profile(email: str, data: UpdateProfile):
    db = get_database()
    update_data = {}
    
    if data.username:
        update_data["username"] = data.username
    if data.new_password:
        update_data["password"] = get_password_hash(data.new_password)
        
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    result = await db["users"].update_one({"email": email}, {"$set": update_data})
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "Profile updated successfully!"}