import asyncio
from groq import Groq

from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)


async def get_llm_response(user_text: str, tag: str) -> str:
    print(f"DEBUG: Calling Groq for Emotion: {tag}")

    def _sync_chat() -> str | None:
        system_prompt = f"""
You are PsychiGuide AI, a professional and empathetic mental health assistant.
The user's detected emotion is: {tag}.
Provide a warm and supportive response in English (Max 3 sentences).
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text},
            ],
        )

        if not response.choices:
            return None

        msg = response.choices[0].message
        if msg is None or msg.content is None:
            return None

        return msg.content.strip()

    try:
        text = await asyncio.to_thread(_sync_chat)
        if text:
            return text
        return "I am here for you. Please tell me more about how you're feeling."
    except Exception as e:
        print(f"Groq API Error: {str(e)}")
        return "I am here for you. Please tell me more about how you're feeling."