from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    username: str = Field(..., min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(..., min_length=6)
    
    # AI/Safety Context
    # 'safe', 'monitor', or 'crisis' - helpful for the backend logic
    safety_status: str = "safe" 
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "username": "ali_khan",
                "email": "ali@example.com",
                "password": "strongpassword123",
                "safety_status": "safe"
            }
        }