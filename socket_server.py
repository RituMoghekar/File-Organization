from fastapi import WebSocket
from typing import List

active_connections: List[WebSocket] = []


async def connect(ws: WebSocket):
    await ws.accept()
    active_connections.append(ws)
    print("✅ WebSocket connected")


def disconnect(ws: WebSocket):
    if ws in active_connections:
        active_connections.remove(ws)
    print("❌ WebSocket disconnected")


async def emit_update(data: dict):
    """
    Sends updates to all connected frontend clients
    """
    dead_connections = []

    for connection in active_connections:
        try:
            await connection.send_json(data)
        except:
            dead_connections.append(connection)

    # cleanup broken sockets
    for dc in dead_connections:
        disconnect(dc)
