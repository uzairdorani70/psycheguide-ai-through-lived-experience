import asyncio
import os
import re
from groq import Groq
from app.core.config import settings
from dotenv import load_dotenv

load_dotenv()

async def get_llm_response(user_text: str, tag: str) -> str:
    API_KEYS = [
        os.getenv("GROQ_API_KEY_1"),
        os.getenv("GROQ_API_KEY_2"),
        os.getenv("GROQ_API_KEY_3"),
        getattr(settings, "GROQ_API_KEY_1", None),
        getattr(settings, "GROQ_API_KEY_2", None),
        getattr(settings, "GROQ_API_KEY_3", None)
    ]
    
    valid_keys = [k for k in API_KEYS if k and str(k).strip() != ""]
    
    if not valid_keys:
        print("CRITICAL ERROR: No Groq API keys found! Check your .env file.")
        return "I am here for you. Please tell me more about how you're feeling."

    # 🎯 FIX 1: (Available Keys: 3) hata diya
    print("DEBUG: Calling Groq")

    def _sync_chat(api_key: str) -> str | None:
        try:
            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": f"You are PsycheGuide AI. User emotion: {tag}. Max 3 sentences."},
                    {"role": "user", "content": user_text},
                ],
                timeout=15.0 
            )

            if not response or not getattr(response, 'choices', None):
                return None

            response_str = str(response)

            match = re.search(r'content=["\'](.*?)["\'](?:, role=|, tags=|\))', response_str, re.DOTALL)
            if match:
                clean_text = match.group(1)
                try:
                    clean_text = clean_text.encode().decode('unicode_escape')
                except:
                    pass
                return clean_text.strip()

            try:
                return str(response.choices.message.content).strip()
            except:
                pass

            return None

        except Exception as e:
            print(f"GROQ SERVER REJECTED KEY: {str(e)}") 
            return None

    for current_key in valid_keys:
        text = await asyncio.to_thread(_sync_chat, current_key)
        
        if text:
            # 🎯 FIX 2: Key 1 worked perfectly ki jagah generic text
            print("SUCCESS: Response received perfectly!")
            return text
            
        # 🎯 FIX 3: Key 1 failed ki jagah generic text
        print("Connection failed. Trying fallback...")

    return "I am here for you. Please tell me more about how you're feeling."