const express = require("express");
const fetch = require("node-fetch"); // if Node < 18, install: npm install node-fetch
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // guestbook.html + style.css live here

const PORT = process.env.PORT || 10000;
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwWcF6p_yN6z994DG_qM8SXFdZwOnM-cY6danysq0HrUszm3g6Mr7vwMll7jiFN4Dlgjg/exec";

// Get messages from Google Sheets
app.get("/api/messages", async (req, res) => {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    const data = await response.json();
    res.json(data.reverse()); // latest first
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load messages" });
  }
});

// Post message to Google Sheets
app.post("/api/messages", async (req, res) => {
  const { name, message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify({ name, message })
      // no headers needed, avoids CORS preflight
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit message" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
