// Import Statements
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import notesRoutes from "./routes/notes.js"
import attendenceRoutes from "./routes/attendence.js"
import fileUpload from "express-fileupload";

// Configuration
dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload({
  useTempFiles:true
}))


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/attendence", attendenceRoutes)

// MongoDb Setup
const PORT = process.env.PORT || 6000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`${err} did not connect`);
  });
