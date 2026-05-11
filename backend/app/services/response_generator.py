import random
from app.services import nlp_utils  # <-- "app.services" lagana zaroori hai
from app.services.crisis_manager import CrisisManager

# Mukhtalif jazbaat (emotions) ke liye jawab
EMPATHETIC_RESPONSES = {
    "joy": [
        "That sounds amazing! I'm so happy for you! 🎉",
        "It's great to see you feeling positive. Tell me more about it!",
        "Keep up this positive energy! You are doing great."
    ],
    "sadness": [
        "I'm sorry to hear that. I'm here if you want to vent.",
        "It's okay to feel sad sometimes. Be gentle with yourself.",
        "I can sense that you are down. Would you like to talk about what happened?"
    ],
    "anger": [
        "I hear you. It sounds like a frustrating situation.",
        "Take a deep breath. I'm here to listen to your side of the story.",
        "It's understandable to feel angry. Do you want to let it all out?"
    ],
    "fear": [
        "It sounds scary, but you are not alone. I'm here with you.",
        "Anxiety can be overwhelming. Let's take it one step at a time.",
        "Take a deep breath. You are safe here."
    ],
    "neutral": [
        "I'm listening. Go on.",
        "Tell me more about your day.",
        "I am here for you."
    ]
}

def generate_response(emotion: str):
    """
    It selects a sweet, random reply according to the detected emotion.
    """
    # Agar emotion list mein na ho to 'neutral' jawab den
    responses = EMPATHETIC_RESPONSES.get(emotion, EMPATHETIC_RESPONSES["neutral"])
    
    # List mein se ek random jawab pick karein
    return random.choice(responses)