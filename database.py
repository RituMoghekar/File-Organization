import sqlite3
import json

# -----------------------------
# DATABASE CONNECTION
# -----------------------------
DB_PATH = "sefs.db"
conn = sqlite3.connect(DB_PATH, check_same_thread=False)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

# -----------------------------
# CREATE TABLES
# -----------------------------
cur.execute("""
CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT UNIQUE,
    embedding TEXT,
    cluster INTEGER
)
""")
conn.commit()

# -----------------------------
# FILE OPERATIONS
# -----------------------------
def save_or_update_file(path, embedding, cluster):
    """Insert or update file; embedding is a list/np array."""
    cur.execute("""
        INSERT OR REPLACE INTO files (path, embedding, cluster)
        VALUES (?, ?, ?)
    """, (path, json.dumps(embedding), cluster))
    conn.commit()

def delete_file(path):
    cur.execute("DELETE FROM files WHERE path=?", (path,))
    conn.commit()

def get_all_files():
    cur.execute("SELECT path, cluster FROM files")
    return [{"path": r["path"], "cluster": r["cluster"]} for r in cur.fetchall()]

# -----------------------------
# EMBEDDING OPERATIONS
# -----------------------------
def get_all_embeddings():
    cur.execute("SELECT embedding FROM files")
    return [json.loads(r["embedding"]) for r in cur.fetchall()]

def get_embeddings_with_paths():
    cur.execute("SELECT path, embedding FROM files")
    rows = cur.fetchall()
    paths, embeddings = [], []
    for r in rows:
        paths.append(r["path"])
        embeddings.append(json.loads(r["embedding"]))
    return paths, embeddings

# -----------------------------
# CLUSTER OPERATIONS
# -----------------------------
def get_files_by_cluster(cluster_id):
    cur.execute("SELECT path, embedding FROM files WHERE cluster=?", (cluster_id,))
    return cur.fetchall()

def get_unique_clusters():
    cur.execute("SELECT DISTINCT cluster FROM files")
    return [r["cluster"] for r in cur.fetchall()]

# -----------------------------
# DASHBOARD METRICS
# -----------------------------
def get_metrics():
    cur.execute("SELECT COUNT(*) FROM files")
    files_processed = cur.fetchone()[0]
    cur.execute("SELECT COUNT(DISTINCT cluster) FROM files")
    clusters_formed = cur.fetchone()[0]
    return {"files_processed": files_processed, "clusters_formed": clusters_formed, "time_saved_minutes": files_processed*2}

# -----------------------------
# UTILITY
# -----------------------------
def reset_database():
    cur.execute("DELETE FROM files")
    conn.commit()
