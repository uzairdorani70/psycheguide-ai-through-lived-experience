from app.services.bert_service import bert_engine
# ✅ Evaluate crisis ki import hata dein kyunke hum manager use nahi kar rahe
from app.services.llm_service import get_llm_response 

LABEL_TAGS = [
    'Anxiety', 'Bipolar', 'Depression', 'Normal', 'Personality disorder', 'Stress',
    'Suicidal', 'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
    'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval', 'disgust',
    'fear', 'gratitude', 'joy', 'love', 'nervousness', 'neutral', 'optimism',
    'pride', 'relief', 'remorse', 'surprise'
]

async def get_ai_response(user_text: str, chat_history: list = None):
    try:
        # 1. BERT Prediction (Emotion detect karne ke liye)
        predicted_id, confidence = bert_engine.predict(user_text)
        
        user_text_clean = user_text.lower().strip()
        common_greetings = ["morning", "good morning", "hello", "hi", "hey", "evening"]

        if user_text_clean in common_greetings:
            tag = "neutral"
        elif confidence < 0.60:
            tag = "neutral"
        else:
            tag = LABEL_TAGS[predicted_id] if predicted_id < len(LABEL_TAGS) else "neutral"
        
        print(f"DEBUG: BERT Analysis -> {tag} (Confidence: {confidence*100:.2f}%)")

        # ❌ SAFETY CHECK REMOVED: 
        # Pehle yahan 'evaluate_crisis' call hota tha jo API ko block karta tha.
        # Ab ye bypass ho kar seedha niche LLM ke paas jayega.

        # 2. LLM Response (Ab API hi in keywords ka jawab degi)
        llm_reply = await get_llm_response(user_text, tag)
        
        return llm_reply, tag

    except Exception as e:
        print(f"AI Service Error: {e}")
        return "I am here for you. How are you feeling?", "neutral"