import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Task from "./models/task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

// ✅ Corrected path usage (use `join` instead of `path.join`)
app.use(express.static(join(__dirname, "public")));

const PORT = 8001;

// MongoDB Connection (No Deprecated Options)
mongoose.connect("mongodb://localhost:27017/todo_with_nord")
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "❌ Connection error:"));
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).exec();
    res.render("index", { tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving tasks");
  }
});

app.post("/add-task", async (req, res) => {
  const taskName = req.body.name;
  const newTask = new Task({ name: taskName, completed: false });
  try {
    await newTask.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding task");
  }
});

app.post("/complete-task", async (req, res) => {
  const taskId = req.body.taskId;
  try {
    const task = await Task.findById(taskId).exec();
    if (task) {
      task.completed = !task.completed;
      await task.save();
      res.redirect("/");
    } else {
      res.status(404).send("Task not found");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error completing task");
  }
});

app.post("/remove-task", async (req, res) => {
  const taskId = req.body.taskId;
  try {
    await Task.findByIdAndDelete(taskId).exec();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error removing task");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
