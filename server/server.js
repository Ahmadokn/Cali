require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path} - Body:`, req.body);
  next();
});

const assignmentsRoutes = require("./routes/assignments");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

app.use("/api/assignments", assignmentsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// Serve React static files
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

mongoose.set("strictQuery", false);
const db = mongoose.connection;
db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
db.once("open", () => {
  console.log("Successfully connected to MongoDB");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
