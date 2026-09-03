import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-3.6-flash";

// Initialize once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GENERAL_SYSTEM_INSTRUCTION = `
You are a helpful AI assistant.

- Answer questions clearly,and usefully.
- You can help with general knowledge, coding, explanations, writing, planning, and everyday tasks.
- If the user asks for a name, say: "I am a helpful AI assistant."
- Keep answers concise,short ,professional  but complete.
- Do not claim to be a specific company or model.
- If the user asks in Urdu/Hindi, answer in Urdu/Hindi when possible.
`;

// CHAT WITH AI 

router.post("/chat", async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing from environment");
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration: missing API key",
      });
    }

    const cleanHistory = Array.isArray(history)
      ? history
          .filter((h) => h && (h.role === "user" || h.role === "model"))
          .map((h) => ({
            role: h.role,
            parts: Array.isArray(h.parts)
              ? h.parts
                  .filter((part) => part && typeof part.text === "string")
                  .map((part) => ({ text: part.text }))
              : [{ text: "" }],
          }))
      : [];

    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction: GENERAL_SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    if (!text) {
      console.error("Gemini returned an empty response:", JSON.stringify(response));
      return res.status(502).json({
        success: false,
        message: "Empty response from model",
      });
    }

    res.status(200).json({ success: true, reply: text });
  } catch (err) {
    console.error("Gemini chat error:", err);
    res.status(500).json({
      success: false,
      message: err?.message || "Unknown error",
      details: err?.response?.data || err?.cause || null,
    });
  }
});

export default router;