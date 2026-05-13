import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.database import get_database 
from datetime import datetime, timezone
from app.services.ai_model import get_ai_response


router = APIRouter()

class UserMessage(BaseModel):
    username: str  
    message: str
    conversation_id: Optional[str] = None

# chat.py ke andar 'chat_with_ai' function ko aise badlein:
@router.post("/message")
async def chat_with_ai(user_input: UserMessage):
    try:
        db = get_database()
        chats_collection = db["chats"]
        conv_id = user_input.conversation_id if user_input.conversation_id else str(uuid.uuid4())

        # 1. AI Response logic call karein
        ai_reply, emotion_tag = await get_ai_response(user_input.message)

       
        danger_keywords = ["die", "suicide", "kill", "hopeless", "end my life", "death"]
        is_danger = any(word in user_input.message.lower() for word in danger_keywords)

        # 3. Database Save
        chat_document = {
            "user_id": user_input.username,
            "conversation_id": conv_id,
            "message": user_input.message,
            "ai_response": ai_reply,
            "emotion": emotion_tag,
            "is_crisis": is_danger,  # ✅ Agar dangerous word hai toh True save hoga
            "timestamp": datetime.now(timezone.utc)
        }
        
        await chats_collection.insert_one(chat_document)
        
        return {
            "reply": ai_reply, 
            "emotion": emotion_tag, 
            "crisis_alert": is_danger, # ✅ Frontend ko alert status bhejien
            "conversation_id": conv_id
        }
        
    except Exception as e:
        print(f"Chat Error: {str(e)}") 
        raise HTTPException(status_code=500, detail="Internal Chat Error")

@router.get("/conversations/{username}")
async def fetch_conversations(username: str):
    db = get_database()
    try:
        pipeline = [
            {"$match": {"user_id": username}},
            {"$sort": {"timestamp": 1}}, 
            {
                "$group": {
                    "_id": "$conversation_id",
                    "title": {"$first": "$message"},
                    "last_updated": {"$last": "$timestamp"}
                }
            },
            {"$sort": {"last_updated": -1}}
        ]
        conversations = await db["chats"].aggregate(pipeline).to_list(length=100)
        return conversations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    db = get_database()
    try:
        cursor = db["chats"].find({"conversation_id": conversation_id}).sort("timestamp", 1)
        history = await cursor.to_list(length=100)
        return [{**chat, "_id": str(chat["_id"])} for chat in history]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# NEW: Delete Session Route
@router.delete("/session/{conversation_id}")
async def delete_chat_session(conversation_id: str):
    try:
        db = get_database()
        result = await db["chats"].delete_many({"conversation_id": conversation_id})
        return {"message": "Deleted", "count": result.deleted_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# chat.py ke bilkul niche add karein
@router.post("/predict")
async def ai_prediction_only(data: dict):
    try:
        from app.services.bert_service import bert_engine
        from app.services.ai_model import LABEL_TAGS
        
        message = data.get("message", "")
        if not message:
            return {"emotion": "neutral", "confidence": 0.0}
            
        # BERT model se prediction lena
        predicted_id, confidence = bert_engine.predict(message)
        tag = LABEL_TAGS[predicted_id]
        
        return {"emotion": tag, "confidence": confidence}
    except Exception as e:
        print(f"Predict Route Error: {e}")
        return {"emotion": "neutral", "confidence": 0.0}