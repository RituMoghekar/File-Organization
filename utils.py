import re
from collections import Counter

STOPWORDS = {
    "the", "is", "and", "of", "to", "in", "a", "for", "on", "with",
    "this", "that", "as", "are", "an", "by", "be", "or"
}


def extract_keywords(text, top_k=3):
    words = re.findall(r"[a-zA-Z]{3,}", text.lower())
    words = [w for w in words if w not in STOPWORDS]
    freq = Counter(words)
    return [w for w, _ in freq.most_common(top_k)]


def generate_cluster_name(texts):
    all_words = []
    for t in texts:
        all_words.extend(extract_keywords(t))

    if not all_words:
        return "Misc_Files"

    return "_".join(all_words[:3]).title()

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def find_duplicates(embeddings, paths, threshold=0.75):
    """
    Returns list of duplicate file pairs based on cosine similarity
    """

    duplicates = []
    if len(embeddings) < 2:
        return duplicates

    X = np.array(embeddings)
    sim_matrix = cosine_similarity(X)

    n = len(paths)
    for i in range(n):
        for j in range(i + 1, n):
            if sim_matrix[i][j] >= threshold:
                duplicates.append({
                    "file_1": paths[i],
                    "file_2": paths[j],
                    "similarity": round(float(sim_matrix[i][j]), 2)
                })

    return duplicates
