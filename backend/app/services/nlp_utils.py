import re
import string

def clean_text(text: str) -> str:
    """
    Prepares user input for the AI model.
    1. Lowercases text
    2. Removes special characters (like @, #, etc.)
    3. Removes extra spaces
    """
    if not text:
        return ""
    
    # 1. Convert to lowercase
    text = text.lower()
    
    # 2. Remove punctuation (optional, but good for simple emotion models)
    # This keeps only letters, numbers, and spaces
    text = re.sub(r'[^\w\s]', '', text)
    
    # 3. Remove extra whitespace (e.g., "hello   world" -> "hello world")
    text = " ".join(text.split())
    
    return text

# Test it inside the file
if __name__ == "__main__":
    sample = "I am SO   Anxious!!! #Help"
    print(f"Original: {sample}")
    print(f"Cleaned:  {clean_text(sample)}")