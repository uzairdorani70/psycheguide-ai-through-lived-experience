CRISIS_KEYWORDS = ["die", "suicide", "kill", "hopeless", "end my life", "death"]

def evaluate_crisis(text: str, emotion: str, confidence: float):
    """
    Decides if the user needs immediate help.
    Returns: (is_crisis: bool, suggestion: str)
    """
    is_crisis = False
    suggestion = "Everything looks okay. How can I help you further?"

    # 1. Check for specific dangerous keywords (Rule-based)
    for word in CRISIS_KEYWORDS:
        if word in text.lower():
            is_crisis = True
            suggestion = " It sounds like you’re going through a difficult time. Please reach out to a helpline, or consider speaking with someone you trust, like a friend, family member, or counselor."
            return is_crisis, suggestion

    # 2. Check for High Negative Emotion (AI-based)
    if emotion in ["sadness", "fear", "anger"] and confidence > 0.85:
        is_crisis = True
        suggestion = "I notice you are feeling very strong emotions. Would you like to try a breathing exercise or talk to a counselor?"
    
    # 3. Empathetic Support for mild sadness
    elif emotion == "sadness":
        suggestion = "I'm sorry you're feeling down. I'm here to listen."

    return is_crisis, suggestion 