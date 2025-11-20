import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
const PORT = 3008;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const wss = new WebSocketServer({ port: 9600 });

wss.on("connection", (ws) => {
  console.log("Frontend client connected");

  ws.on("message", (message) => {
    console.log("Received:", message.toString());
  });
});

app.post("/webhook/payment", (req, res) => {
  const { order_id, redirect_url, status, method, error } = req.body;

  if (redirect_url) {
    console.log(redirect_url);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ order_id, redirect_url, method }));
      }
    });
  } else if (status === "failed") {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ order_id, status: "failed", error }));
      }
    });
  }

  res.status(200).send("OK");
});

app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
});
