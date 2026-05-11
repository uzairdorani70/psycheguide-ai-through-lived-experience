from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class EmotionData(BaseModel):
    """
    Stores the result from your BERT model.
    """
    primary_emotion: str  # e.g., "Sad", "Anxious", "Neutral"
    confidence_score: float # e.g., 0.95 (95% confident)

class ChatMessage(BaseModel):
    user_id: str # The ID of the user (from MongoDB)
    role: str    # "user" or "bot"
    content: str # The actual text message
    
    # The AI Analysis (Optional, because User messages might not be analyzed yet)
    emotion_analysis: Optional[EmotionData] = None
    
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "64f1a2b...",
                "role": "user",
                "content": "I feel really overwhelmed with my exams.",
                "emotion_analysis": {
                    "primary_emotion": "Anxious",
                    "confidence_score": 0.88
                }
            }
        }