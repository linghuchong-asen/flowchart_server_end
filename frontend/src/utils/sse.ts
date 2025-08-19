export function connectSSE(url: string, onMessage: (msg: string) => void) {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data.delta) {
        onMessage(data.delta);
      }
    } catch {
      console.error("SSE parse error", e.data);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error", err);
    eventSource.close();
  };

  return eventSource;
}
