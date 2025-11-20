// hooks/useWebSocket.js
import { useEffect, useRef } from "react";

const useWebSocket = (url, onMessage, onOpen, onClose) => {
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      console.log("Connected to WebSocket server");
      if (onOpen) onOpen(event);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from WebSocket:", data);
      if (onMessage) onMessage(data);
    };

    ws.onclose = (event) => {
      console.log("Disconnected from WebSocket server");
      if (onClose) onClose(event);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current = ws;

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, onMessage, onOpen, onClose]);

  const sendMessage = (message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not open. Cannot send message.");
    }
  };

  return { sendMessage };
};

export default useWebSocket;
