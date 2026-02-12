import json
import mimetypes
from pathlib import Path
from typing import List, Tuple
from auth import create_user, authenticate_user, create_access_token
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from auth_router import router as auth_router

from database import get_all_files, get_embeddings_with_paths, save_or_update_file
from embeddings import get_embedding
from clustering import cluster_embeddings

# -----------------------------
# Paths
# -----------------------------
DATA_DIR = Path("data")
FILES_DIR = DATA_DIR / "files"
ACTIVITY_FILE = DATA_DIR / "activity.json"

# -----------------------------
# API KEY (demo purpose)
# -----------------------------
API_KEY = "hackathon-secret-key"
API_KEY_NAME = "X-API-KEY"

# -----------------------------
# Models
# -----------------------------
class ActivityItem(BaseModel):
    type: str
    text: str

class LoginRequest(BaseModel): 
    username: str 
    password: str

# -----------------------------
# App Setup
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_api_key(api_key: str = Header(..., alias=API_KEY_NAME)):
    if api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return api_key

# -----------------------------
# Helpers
# -----------------------------
def read_activities() -> List[ActivityItem]:
    if ACTIVITY_FILE.exists():
        with open(ACTIVITY_FILE, "r") as f:
            return [ActivityItem(**item) for item in json.load(f)]
    return []

def write_activities(items: List[ActivityItem]):
    DATA_DIR.mkdir(exist_ok=True)
    with open(ACTIVITY_FILE, "w") as f:
        json.dump([item.dict() for item in items], f, indent=2)

# -----------------------------
# Endpoints
# -----------------------------
@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.get("/api/activity", response_model=List[ActivityItem])
def get_activity():
    return read_activities()

@app.post("/api/activity", response_model=ActivityItem)
def add_activity(item: ActivityItem):
    activities = read_activities()
    activities.append(item)
    write_activities(activities)
    return item

@app.post("/api/login")
def login(data: LoginRequest):
    if not authenticate_user(data.username, data.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": data.username})
    return {"access_token": token, "token_type": "bearer"}

# -----------------------------
# Files endpoint
# -----------------------------
@app.get("/api/files")
def list_files(api_key: str = Header(..., alias=API_KEY_NAME)):
    files_data = []

    all_files = get_all_files() or []

    # Fetch cluster info from DB
    file_embeddings = get_embeddings_with_paths()  # should return (paths, embeddings, cluster_ids)
    paths, _, cluster_ids = file_embeddings if file_embeddings else ([], [], [])

    cluster_mapping = {str(path): cid for path, cid in zip(paths, cluster_ids)}

    CLUSTER_LABELS = {
        0: "Research Papers",
        1: "Code Projects",
        2: "Design Assets",
        3: "Meeting Notes",
        4: "Financial Docs",
        5: "Personal Projects"
    }

    FILES_DIR.mkdir(exist_ok=True)
    for f in FILES_DIR.glob("*"):
        type_guess, _ = mimetypes.guess_type(f)
        type_str = type_guess.split("/")[0].capitalize() if type_guess else f.suffix[1:].capitalize()
        size_bytes = f.stat().st_size
        size_str = f"{round(size_bytes / (1024*1024),1)} MB" if size_bytes>1024*1024 else f"{round(size_bytes/1024)} KB"
        
        cluster_id = cluster_mapping.get(str(f), None)
        cluster_name = CLUSTER_LABELS.get(cluster_id, "Unassigned") if cluster_id is not None else "Unassigned"

        files_data.append({
            "name": f.name,
            "type": type_str,
            "cluster": cluster_name,
            "size": size_str
        })

    return files_data

# -----------------------------
# Clusters endpoint
# -----------------------------
@app.get("/api/clusters")
def get_clusters(api_key: str = Header(..., alias=API_KEY_NAME)):
    # Fetch embeddings from DB
    file_embeddings = get_embeddings_with_paths()
    if not file_embeddings:
        return []

    paths, embeddings, _ = file_embeddings
    if not embeddings:
        return []

    # Cluster embeddings safely
    labels = cluster_embeddings(embeddings)
    if len(labels) != len(paths):
        labels = [0]*len(paths)  # fallback if lengths mismatch

    # Update DB with cluster ids
    for path, cluster_id in zip(paths, labels):
        save_or_update_file(path, embeddings[paths.index(path)], cluster_id)

    # Map cluster IDs to semantic names
    CLUSTER_LABELS = {
        0: "Research Papers",
        1: "Code Projects",
        2: "Design Assets",
        3: "Meeting Notes",
        4: "Financial Docs",
        5: "Personal Projects"
    }

    COLOR_PALETTE = ["emerald-400","violet-400","amber-400","yellow-400",
                     "gray-400","sky-400","pink-400","rose-400"]

    # Count files per cluster
    cluster_counts = {}
    for label in labels:
        cluster_counts[label] = cluster_counts.get(label, 0) + 1

    # Build cluster info for frontend
    clusters = []
    for i, count in cluster_counts.items():
        clusters.append({
            "name": CLUSTER_LABELS.get(i, f"Cluster {i+1}"),
            "color": COLOR_PALETTE[i % len(COLOR_PALETTE)],
            "count": count,
            "updated": "Just now"
        })
    return clusters
