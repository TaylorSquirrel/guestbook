const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 10000;
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrLoX3hJXJ8MQISkEw3Qh3g2cKditAp5AYe8lrFRYd9igLSGfppImEF1uCVauKz_Bwmw/exec";

// Serve guestbook.html at /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/guestbook.html"));
});

// GET messages from Google Sheets
app.get("/api/messages", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) throw new Error("Bad response from Google Script");
    const data = await response.json();
    res.json(data.reverse()); // latest first
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// POST message to Google Sheets
app.post("/api/messages", async (req, res) => {
  const { name, message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ name, message }),
    });
    if (!response.ok) throw new Error("Bad response from Google Script");
    res.json({ success: true });
  } catch (err) {
    console.error("Error posting message:", err.message);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



