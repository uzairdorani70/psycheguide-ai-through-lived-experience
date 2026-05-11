import torch
from transformers import BertTokenizer, BertForSequenceClassification
import os
import pathlib

# Current file ki location se backend folder tak ka rasta nikalna
BASE_DIR = pathlib.Path(__file__).parent.parent.parent.resolve()

# Model ka path set karein
MODEL_PATH = os.path.join(BASE_DIR, "ml_model") 

class BertClassifier:
    def __init__(self):
        print(f"Loading Local BERT Model from: {MODEL_PATH}")
        try:
            self.tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
            self.model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
            self.model.eval()
            print("SUCCESS: BERT Model Loaded Successfully!")
        except Exception as e:
            print(f"ERROR: Model files not found at {MODEL_PATH}")
            print(f"Details: {e}")
            self.model = None

    # Sahi Indentation: 'def' ka 'd' hamesha class ke andar 4 spaces par hona chahiye
    def predict(self, text):
        if not self.model:
            return 24, 0.0  # 24 'neutral' ka ID hai

        # Tokenization
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
        
        with torch.no_grad():
            outputs = self.model(**inputs)
        
        # 1. Prediction ID
        predicted_class_id = torch.argmax(outputs.logits, dim=1).item()

        # 2. Confidence Score
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
        confidence = torch.max(probabilities).item()

        return predicted_class_id, confidence

# Instance create kar rahe hain
bert_engine = BertClassifier()