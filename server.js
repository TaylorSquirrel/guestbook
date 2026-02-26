const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors()); // Allow requests from any domain (needed for Neocities)
app.use(express.json());

const filePath = path.join(__dirname, "messages.json");

// Get all messages
app.get("/api/messages", (req, res) => {
  const data = fs.readFileSync(filePath);
  res.json(JSON.parse(data));
});

// Add a new message
app.post("/api/messages", (req, res) => {
  const { name, message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message required" });
  }

  const data = JSON.parse(fs.readFileSync(filePath));
  const newEntry = {
    name: name || "Anonymous",
    message,
    date: new Date().toISOString()
  };

  data.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
