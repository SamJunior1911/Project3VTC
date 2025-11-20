import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import geminiRoute from "./routes/gemini.route.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/gemini", geminiRoute);

const PORT = process.env.PORT|| 5009;

app.listen(PORT, () => {
  console.log(`Chatbot service running on port ${PORT}`);
});
