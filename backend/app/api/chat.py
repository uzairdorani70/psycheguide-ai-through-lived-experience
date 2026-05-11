import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.database import get_database 
from datetime import datetime, timezone
from app.services.ai_model import get_ai_response
from app.services.crisis_manager import evaluate_crisis

router = APIRouter()

class UserMessage(BaseModel):
    username: str  
    message: str
    conversation_id: Optional[str] = None

@router.post("/message")
async def chat_with_ai(user_input: UserMessage):
    try:
        db = get_database()
        chats_collection = db["chats"]
        
        current_user = user_input.username 
        conv_id = user_input.conversation_id if user_input.conversation_id else str(uuid.uuid4())

        # 1. Message Count Check
        message_count = await chats_collection.count_documents({"conversation_id": conv_id})
        if message_count >= 300:
             return {
                "reply": "You've reached the 300-message limit for this conversation. Please start a 'New Chat'.",
                "limit_reached": True,
                "conversation_id": conv_id
            }

        # 2. History fetch
        history_docs = await chats_collection.find({"conversation_id": conv_id}).sort("timestamp", -1).limit(10).to_list(10)

        # 3. AI Response logic
        ai_reply, emotion_tag = await get_ai_response(user_input.message, history_docs)

        # 4. Crisis evaluation (Positional arguments fix)
        is_user_in_danger, crisis_suggestion = evaluate_crisis(user_input.message, emotion_tag, 0.9)
        
        if emotion_tag.lower() == "suicidal" or emotion_tag.lower() == "suicide": 
            is_user_in_danger = True
            
        if is_user_in_danger: 
            ai_reply = crisis_suggestion

        # 5. Database Save
        chat_document = {
            "user_id": current_user,
            "conversation_id": conv_id,
            "message": user_input.message,
            "ai_response": ai_reply,
            "emotion": emotion_tag,
            "is_crisis": is_user_in_danger,
            "timestamp": datetime.now(timezone.utc)
        }
        
        await chats_collection.insert_one(chat_document)
        
        return {
            "reply": ai_reply, 
            "emotion": emotion_tag, 
            "crisis_alert": is_user_in_danger,
            "conversation_id": conv_id,
            "message_count": message_count + 1
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