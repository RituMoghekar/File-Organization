import numpy as np
from sklearn.cluster import AgglomerativeClustering
from sklearn.preprocessing import normalize

def cluster_embeddings(vectors):
    """
    Cluster embeddings using AgglomerativeClustering (cosine similarity)
    Returns labels list.
    """
    if len(vectors) == 0:
        return []
    if len(vectors) == 1:
        return [0]

    X = np.array(vectors)
    X = normalize(X)
    n_clusters = max(2, int(len(X)**0.5))  # heuristic: sqrt(num files)
    model = AgglomerativeClustering(
        n_clusters=n_clusters,
        metric="cosine",
        linkage="average"
    )
    labels = model.fit_predict(X)
    return labels.tolist()
