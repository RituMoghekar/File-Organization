from sentence_transformers import SentenceTransformer

# Load embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")

def get_embedding(text: str):
    """Return embedding vector for a given text."""
    return model.encode(text)
