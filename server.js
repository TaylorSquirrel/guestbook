const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static files

const filePath = path.join(__dirname, "messages.json");

// API: get all messages
app.get("/api/messages", (req, res) => {
  const data = fs.readFileSync(filePath);
  res.json(JSON.parse(data));
});

// API: add a message
app.post("/api/messages", (req, res) => {
  const { name, message } = req.body;
  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message required" });
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  data.push({ name: name || "Anonymous", message, date: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// Serve guestbook.html for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "guestbook.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
