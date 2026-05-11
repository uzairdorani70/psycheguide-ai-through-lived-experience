from app.services.bert_service import bert_engine
from app.services.crisis_manager import evaluate_crisis
from app.services.llm_service import get_llm_response # Agar Groq use kar rahe hain toh wahan se import karein

# Updated 30 Labels List (Jo Colab ne print ki thi)
LABEL_TAGS = [
    'Anxiety', 'Bipolar', 'Depression', 'Normal', 'Personality disorder', 'Stress',
    'Suicidal', 'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
    'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval', 'disgust',
    'fear', 'gratitude', 'joy', 'love', 'nervousness', 'neutral', 'optimism',
    'pride', 'relief', 'remorse', 'surprise'
]

async def get_ai_response(user_text: str, chat_history: list = None):
    try:
        # 1. BERT Prediction
        predicted_id, confidence = bert_engine.predict(user_text)
        
        # --- IMPROVED LOGIC FOR COMMON GREETINGS ---
        common_greetings = ["morning", "good morning", "hello", "hi", "hey", "evening"]
        user_text_clean = user_text.lower().strip()
        
        # Pehle check karein ke kya sirf greeting hai
        if user_text_clean in common_greetings:
            tag = "neutral"
        # Phir confidence check karein (80% se kam par neutral rakhein common words ke liye)
        elif confidence < 0.80 and user_text_clean in ["morning", "night", "day"]:
            tag = "neutral"
        elif confidence < 0.60:
            tag = "neutral"
        else:
            tag = LABEL_TAGS[predicted_id] if predicted_id < len(LABEL_TAGS) else "neutral"
        
        print(f"DEBUG: BERT Analysis -> {tag} (Confidence: {confidence*100:.2f}%)")

        # 2. Safety Check (Crisis)
        is_crisis, suggestion = evaluate_crisis(user_text, tag, confidence)
        if is_crisis:
            return suggestion, "Crisis"

        # 3. LLM Response
        llm_reply = await get_llm_response(user_text, tag)
        
        return llm_reply, tag

    except Exception as e:
        print(f"AI Service Error: {e}")
        return "I am here for you. How are you feeling?", "neutral"