import os
from groq import Groq
from app.core.config import settings

# Groq Client setup
client = Groq(api_key=settings.GROQ_API_KEY)

async def get_llm_response(user_text: str, tag: str):
    try:
        system_prompt = f"""
        You are PsychiGuide AI, a professional and empathetic mental health assistant.
        The AI classifier has detected the user's emotion as: {tag}.
        
        INSTRUCTIONS:
        1. Acknowledge the user's feeling ({tag}) with care.
        2. If the user just says 'Hi' or 'Hello', greet them warmly.
        3. Provide short, helpful, and supportive responses (Max 3-4 sentences).
        4. Respond in English.
        """

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text}
            ]
        )

        return response.choices.message.content

    except Exception as e:
        print(f"Groq API Error: {e}")
        return "The system is currently busy. Please try again in a moment."