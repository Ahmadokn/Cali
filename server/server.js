require("dotenv").config();

const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// MongoDB connection event handlers
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
    app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

const assignmentsRoutes = require("./routes/assignments");
const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/assignments", assignmentsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
