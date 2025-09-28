const express = require("express");
const fs = require("fs-extra");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Get all targets
app.get("/api/targets", async (req, res) => {
  try {
    const data = await fs.readJson(DATA_FILE);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read data" });
  }
});

// Add new target
app.post("/api/targets", async (req, res) => {
  try {
    const targets = await fs.readJson(DATA_FILE);
    targets.push(req.body);
    await fs.writeJson(DATA_FILE, targets, { spaces: 2 });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Update target (by index)
app.put("/api/targets/:id", async (req, res) => {
  try {
    const targets = await fs.readJson(DATA_FILE);
    const id = parseInt(req.params.id);
    if (targets[id]) {
      targets[id] = req.body;
      await fs.writeJson(DATA_FILE, targets, { spaces: 2 });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Target not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update data" });
  }
});

// Delete target
app.delete("/api/targets/:id", async (req, res) => {
  try {
    const targets = await fs.readJson(DATA_FILE);
    const id = parseInt(req.params.id);
    if (targets[id]) {
      targets.splice(id, 1);
      await fs.writeJson(DATA_FILE, targets, { spaces: 2 });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Target not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
