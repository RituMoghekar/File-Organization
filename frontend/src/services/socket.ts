export function connectActivitySocket(onMessage: (data: any) => void) {
  const ws = new WebSocket("ws://localhost:9000/ws/activity");

  ws.onmessage = (e) => {
    onMessage(JSON.parse(e.data));
  };

  return ws;
}
