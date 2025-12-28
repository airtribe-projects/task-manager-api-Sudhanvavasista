const express = require("express");
const app = express();

app.use(express.json());

// In-memory storage

let tasks = [];
let nextId = 1;

// GET /

app.get("/", (req, res) => {
  res.status(200).json({ message: "Task Manager API" });
});

// POST /tasks (Create)

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Invalid title" });
  }

  const task = {
    id: nextId++,
    title,
    completed: false,
  };

  tasks.push(task);
  res.status(201).json(task);
});

// GET /tasks (Read all)

app.get("/tasks", (req, res) => {
  const { completed } = req.query;

  if (completed !== undefined) {
    if (completed !== "true" && completed !== "false") {
      return res.status(400).json({ error: "Invalid completed value" });
    }

    const filtered = tasks.filter(
      (task) => task.completed === (completed === "true")
    );
    return res.status(200).json(filtered);
  }

  res.status(200).json(tasks);
});

// GET /tasks/:id (Read one)

app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

// PUT /tasks/:id (Update)

app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title !== undefined) {
    if (typeof title !== "string") {
      return res.status(400).json({ error: "Invalid title" });
    }
    task.title = title;
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Invalid completed value" });
    }
    task.completed = completed;
  }

  res.status(200).json(task);
});

// DELETE /tasks/:id

app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

module.exports = app;
