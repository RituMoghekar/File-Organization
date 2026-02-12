from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from extractor import extract_text
from embeddings import get_embedding
import asyncio
from socket import broadcast_event
from database import (
    save_or_update_file,
    delete_file,
    get_all_embeddings,
    get_all_files,
    get_metrics,
    get_files_by_cluster,
    get_unique_clusters
)
from clustering import cluster_embeddings
from utils import generate_cluster_name
import time
import os


class FileHandler(FileSystemEventHandler):

    def on_created(self, event):
        if not event.is_directory:
            process_file(event.src_path)

    def on_modified(self, event):
        if not event.is_directory:
            process_file(event.src_path)

    def on_deleted(self, event):
        if not event.is_directory:
            delete_file(event.src_path)

            data = {
                "files": get_all_files(),
                "metrics": get_metrics()
            }

            asyncio.create_task(broadcast_event(data))


def process_file(path):
    if not path.endswith((".pdf", ".txt", ".docx")):
        return

    text = extract_text(path)
    if not text.strip():
        return

    embedding = get_embedding(text)

    vectors = get_all_embeddings()
    vectors.append(embedding.tolist())

    labels = cluster_embeddings(vectors)
    cluster = labels[-1]

    save_or_update_file(path, embedding, cluster)

    data = {
        "files": get_all_files(),
        "metrics": get_metrics()
    }

    asyncio.create_task(broadcast_event(data))


def start_watcher(folder):
    observer = Observer()
    observer.schedule(FileHandler(), folder, recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()


def auto_name_clusters():
    clusters = get_unique_clusters()
    cluster_names = {}

    for cid in clusters:
        files = get_files_by_cluster(cid)
        texts = []

        for path, _ in files:
            text = extract_text(path)
            if text:
                texts.append(text)

        cluster_names[cid] = generate_cluster_name(texts)

    return cluster_names
