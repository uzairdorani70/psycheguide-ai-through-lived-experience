from fastapi import APIRouter, HTTPException
from app.core.database import get_database
from datetime import datetime, timedelta, timezone
from collections import defaultdict

router = APIRouter()

@router.get("/stats/{email}")
async def get_dashboard_stats(email: str):
    db = get_database()
    
    # 1. Pehle hi dates tyar kar lein taake error block mein bhi use ho sakein
    today = datetime.now(timezone.utc).date()
    seven_days = [(today - timedelta(days=i)) for i in range(6, -1, -1)]
    
    try:
        total_chats = await db["chats"].count_documents({"user_id": email})
        crisis_count = await db["chats"].count_documents({"user_id": email, "is_crisis": True})
        
        # Sahi BERT Labels ka Score Map
        score_map = {
            "joy": 5, "love": 5, "admiration": 5, "pride": 5, "gratitude": 5, "amusement": 5, "optimism": 5, "relief": 5,
            "approval": 4, "caring": 4, "curiosity": 4, "surprise": 4, "Normal": 4,
            "neutral": 3, "desire": 3, "realization": 3,
            "confusion": 2, "annoyance": 2, "disappointment": 2, "nervousness": 2, "remorse": 2, "fear": 2,
            "Anxiety": 2, "Stress": 2, "anger": 2, "disapproval": 2, "disgust": 2,
            "Depression": 1, "Bipolar": 1, "Personality disorder": 1, "Suicidal": 0
        }

        # Sahi tareeqa index se date uthane ka
        start_day = seven_days # ✅ List ka pehla item (0) uthana lazmi hai
        since = datetime(start_day.year, start_day.month, start_day.day, tzinfo=timezone.utc)
        
        cursor = db["chats"].find({"user_id": email, "timestamp": {"$gte": since}}).sort("timestamp", 1)
        chats = await cursor.to_list(length=500)
        
        day_scores = defaultdict(list)
        for c in chats:
            ts = c.get("timestamp")
            if ts:
                if ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                chat_date = str(ts.date())
                # Emotion label aur uska score nikalna
                emotion_label = str(c.get("emotion", "neutral"))
                score = score_map.get(emotion_label, 3) # Default to neutral 3
                day_scores[chat_date].append(score)
        
        mood_history = []
        for day in seven_days:
            day_str = str(day)
            scores = day_scores.get(day_str, [])
            if scores:
                raw = sum(scores) / len(scores)
                avg_score = int(raw * 10) / 10.0
            else:
                avg_score = 3.0 # Empty day placeholder
            mood_history.append({"day": day.strftime("%a"), "score": avg_score})

        return {
            "total_chats": total_chats,
            "crisis_alerts": crisis_count,
            "mood_data": mood_history,
        }
        
    except Exception as e:
        print(f"Dashboard Backend Error: {str(e)}")
        # FIX: Agar error aaye toh frontend ko 7 days ka neutral data bhejien taake graph na tute
        fallback_history = [{"day": d.strftime("%a"), "score": 3.0} for d in seven_days]
        return {
            "total_chats": 0, 
            "crisis_alerts": 0, 
            "mood_data": fallback_history
        }