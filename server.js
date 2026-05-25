// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
if (fs.existsSync(".env.local")) {
  try {
    const envConfig = dotenv.parse(fs.readFileSync(".env.local"));
    for (const k in envConfig) {
      process.env[k] = envConfig[k];
    }
  } catch (err) {
    console.error("Failed to parse .env.local:", err);
  }
}
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.use(express.json());
var ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  ...process.env.APP_URL ? [process.env.APP_URL] : []
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
var PORT = process.env.PORT || 3001;
var rateLimitStore = /* @__PURE__ */ new Map();
var createRateLimiter = (windowMs, maxRequests) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let limitInfo = rateLimitStore.get(ip);
    if (!limitInfo || now > limitInfo.resetTime) {
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    if (limitInfo.count >= maxRequests) {
      return res.status(429).json({
        error: "Too many requests from this IP. Please try again later."
      });
    }
    limitInfo.count++;
    next();
  };
};
var chatLimiter = createRateLimiter(60 * 1e3, 15);
var contactLimiter = createRateLimiter(60 * 1e3, 5);
var apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI Chat functionality will fail.");
}
var ai = new GoogleGenAI({ apiKey: apiKey || "" });
var SYSTEM_INSTRUCTION = `You are the AI Assistant / Professional Clone of Richard Masika, a results-driven Lead Software Engineer and Tech Educator based in Koforidua, Ghana.
Your job is to answer questions from visitors to his portfolio website in a friendly, conversational, and highly professional manner.

Keep the following core details about Richard in mind to answer questions accurately:
1. About Richard:
   - Name: Richard Masika
   - Title: Lead Software Engineer & Tech Educator
   - Experience: 4+ years of experience in full-stack development, technical leadership, and teaching.
   - Core Passion: Bridging industry gaps through scalable code and innovative tech education. Mentored 100+ students.
   - Core Skills: Python, Flask, React, JavaScript, AWS (EC2, S3), MySQL, Supabase, Git, Agile methodologies, SDLC, project management.

2. Work Experience:
   - Lead Software Engineer at ZyraTech (2025 - Present): Directs the technical roadmap for full-stack web applications, ensuring 99.9% system reliability. Led a two-month intensive training program for learners in Python and Network architecture.
   - Teaching Assistant at Koforidua Technical University (2023 - Present): Mentors and instructs 100+ students across most IT areas (including Python, Web Development, and Database Management). Built a Flask-based academic project tracking dashboard.
   - Project Manager at Web-Based Consult (2023 - 2024): Led cross-functional teams to deliver diverse web projects using Agile methodologies. Managed SDLC from concept to deployment.

3. Projects:
   - CampusHub Ghana: A full-stack student e-commerce ecosystem reaching 90% production readiness. Features secure payment flows, product listings, and a React-based UX optimized for university campuses. (Tech: React, Full-Stack, Payments, Supabase)
   - Attendance Management System: Real-time student attendance tracking with automated reporting and analytics. Built for university-scale deployment. (Tech: Supabase, Netlify, Real-Time DB, React)
   - Academic Project Dashboard: A Flask-based tracking dashboard built to automate academic tracking at Koforidua Technical University. (Tech: Python, Flask, MySQL, Jinja2)

4. Contact & Links:
   - Location: Koforidua, Eastern Region, Ghana
   - Email: richardabiolamasika@gmail.com
   - Phone (Calling): +233 54 113 6756 (or 0541136756)
   - WhatsApp: +233 59 263 9157 (or 0592639157)
   - GitHub: https://github.com/Maskarano111 (handle: @Maskarano111)
   - LinkedIn: https://linkedin.com/in/richard-abiola-masika-9b21b622a (handle: Richard Abiola Masika)

5. AI-Guided Contact Collection:
   - If the visitor expresses a desire to contact, hire, or leave a message for Richard, you should offer to collect their contact details.
   - Ask for their Name, Email, and Message (either one by one in a friendly chat sequence or in a single prompt).
   - Once they have provided all three details, acknowledge it warmly and state that you will submit it for them.
   - At the VERY END of that final message, you MUST append this exact tag: [SUBMIT_CONTACT: Name | Email | Message]
     Replace "Name", "Email", and "Message" with the actual details provided by the user. For example: [SUBMIT_CONTACT: John Doe | john@example.com | Hello, I would like to work with you.]
     Ensure the syntax is exactly: [SUBMIT_CONTACT: Name | Email | Message] so the frontend can detect it and submit it automatically to the backend. Do not add formatting like bold inside the tag itself.

Tone & Rules:
- Adopt a warm, polite, direct, and slightly tech-enthusiastic tone.
- Be concise. Avoid writing overly long essays unless detail is explicitly requested.
- Keep in character as Richard's AI assistant. Answer using "Richard is..." or "Richard has..." rather than "I did..." (or if asked to speak as Richard himself, speak as him in a confident, encouraging manner).
- If the user asks about something unrelated to Richard's professional background, skills, or portfolio, politely guide them back to topics regarding his work, skills, or how to contact him.
- Never make up information not supported by these facts.
`;
app.post("/api/chat", chatLimiter, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "A messages array is required." });
    }
    if (!apiKey) {
      return res.status(500).json({
        error: "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment."
      });
    }
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));
    const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let lastError = null;
    let responseText = "";
    for (const modelName of modelsToTry) {
      try {
        console.log(`[AI Chat] Requesting generation using: ${modelName}`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 800
          }
        });
        if (response && response.text) {
          responseText = response.text;
          console.log(`[AI Chat] Successful generation using: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`[AI Chat] Model ${modelName} failed or unavailable:`, err.message || err);
        lastError = err;
      }
    }
    if (!responseText && lastError) {
      throw lastError;
    }
    const aiMessage = responseText || "I'm sorry, I couldn't generate a response.";
    res.json({ message: aiMessage });
  } catch (error) {
    console.error("Error with Gemini API:", error);
    res.status(500).json({ error: error.message || "An error occurred during content generation." });
  }
});
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const trimmedName = name?.trim();
    const trimmedEmail = email?.trim();
    const trimmedMessage = message?.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      return res.status(400).json({ error: "Name, email, and message are required fields." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: "Invalid email address format." });
    }
    const newContact = {
      id: Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    const contactsPath = path.join(__dirname, "contacts.json");
    let contacts = [];
    if (fs.existsSync(contactsPath)) {
      try {
        const fileData = fs.readFileSync(contactsPath, "utf8");
        contacts = JSON.parse(fileData);
      } catch (err) {
        console.error("Error reading contacts.json:", err);
      }
    }
    contacts.push(newContact);
    fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2), "utf8");
    console.log(`[Contact Form Received] Name: ${name}, Email: ${email}, Message: ${message}`);
    res.json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    res.status(500).json({ error: "Failed to submit contact form." });
  }
});
var isProd = process.env.NODE_ENV === "production";
var distPath = path.join(__dirname, "dist");
if (isProd) {
  app.use(
    express.static(distPath, {
      maxAge: "1y",
      immutable: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith(".html")) {
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        }
      }
    })
  );
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Backend API server is running in development mode on port " + PORT + ". Run the frontend via Vite on port 3000.");
  });
}
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} (isProd: ${isProd})`);
});
