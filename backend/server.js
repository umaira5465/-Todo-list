const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// File location
const dataFolder = path.join(__dirname, "data");
const file = path.join(dataFolder, "todos.json");

// Automatically create data folder and JSON file
if (!fs.existsSync(dataFolder)) {
  fs.mkdirSync(dataFolder, { recursive: true });
}

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, "[]");
}

// Get tasks
function getTodos() {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// Save tasks
function saveTodos(todos) {
  fs.writeFileSync(file, JSON.stringify(todos, null, 2));
}

// GET all tasks
app.get("/api/todos", (req, res) => {
  res.json(getTodos());
});

// POST new task
app.post("/api/todos", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task required"
    });
  }

  const todos = getTodos();

  const newTodo = {
    id: Date.now(),
    title: title.trim()
  };

  todos.push(newTodo);
  saveTodos(todos);

  res.status(201).json(newTodo);
});

// PUT - EDIT task
app.put("/api/todos/:id", (req, res) => {
  const todos = getTodos();

  const todo = todos.find(
    t => t.id === Number(req.params.id)
  );

  if (!todo) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task title required"
    });
  }

  todo.title = title.trim();

  saveTodos(todos);

  res.json(todo);
});

// DELETE task
app.delete("/api/todos/:id", (req, res) => {
  const todos = getTodos();

  const updated = todos.filter(
    todo => todo.id !== Number(req.params.id)
  );

  if (updated.length === todos.length) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  saveTodos(updated);

  res.json({
    message: "Task deleted successfully"
  });
});

// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Umaira Todo List is Running!");
});

// START SERVER
app.listen(5000, () => {
  console.log("Umaira Todo List Backend running on http://localhost:5000");
});