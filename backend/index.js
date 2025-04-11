require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const fileRoutes = require("./routes/fileroutes");
app.use("/api", fileRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running and ready!");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
