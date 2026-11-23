
import { useEffect } from "react";
import "./App.css";
import ConfirmModal from "./ConfirmModal";
import useTodoStore from "./store";

const API = "http://localhost:5000/api/todos";

function App() {
  // Get states and functions from Zustand
  const {
    task,
    editId,
    todos,

    showModal,
    modalAction,
    selectedTodo,
    modalData,

    setTask,
    setEditId,
    setTodos,
    openModal,
    showMessage,
    closeModal,
    clearForm,
  } = useTodoStore();

  // Load tasks from backend
  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.log("Loading error:", error);

        showMessage(
          "Error!",
          "Unable to load tasks. Please try again."
        );
      }
    }

    fetchTodos();
  }, [setTodos, showMessage]);

  // Add and Update task
  async function addTask(e) {
    e.preventDefault();

    const newTask = task.trim();

    // Empty task check
    if (newTask === "") {
      showMessage(
        "Empty Task!",
        "Please enter a task before submitting."
      );
      return;
    }

    // Duplicate task check
    const duplicate = todos.some(
      (todo) =>
        todo.title.toLowerCase() === newTask.toLowerCase() &&
        todo.id !== editId
    );

    if (duplicate) {
      showMessage(
        "Duplicate Task!",
        "This task already exists! Please enter a different task."
      );
      return;
    }

    try {
      let response;

      // Add new task
      if (editId === null) {
        response = await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTask,
          }),
        });
      }

      // Update existing task
      else {
        response = await fetch(`${API}/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTask,
          }),
        });
      }

      if (!response.ok) {
        throw new Error("Task save failed");
      }

      // Clear input and edit mode
      clearForm();

      // Reload tasks
      const res = await fetch(API);

      if (!res.ok) {
        throw new Error("Failed to reload tasks");
      }

      const data = await res.json();
      setTodos(data);

    } catch (error) {
      console.log("Save error:", error);

      showMessage(
        "Error!",
        "Something went wrong while saving your task."
      );
    }
  }

  // Delete task
  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      // Reload tasks
      const res = await fetch(API);

      if (!res.ok) {
        throw new Error("Failed to reload tasks");
      }

      const data = await res.json();
      setTodos(data);

      // Clear edit mode if deleted task was being edited
      if (editId === id) {
        clearForm();
      }

      return true;

    } catch (error) {
      console.log("Delete error:", error);

      showMessage(
        "Error!",
        "Unable to delete this task. Please try again."
      );

      return false;
    }
  }

  // Confirm Edit or Delete
  async function confirmAction() {
    if (!selectedTodo) return;

    // Edit confirmation
    if (modalAction === "edit") {
      setTask(selectedTodo.title);
      setEditId(selectedTodo.id);
      closeModal();
    }

    // Delete confirmation
    else if (modalAction === "delete") {
      const success = await deleteTask(selectedTodo.id);

      if (success) {
        closeModal();
      }
    }
  }

  return (
    <div className="container">
      <h1>Umaira Todo List</h1>

      {/* Task Form */}
      <form onSubmit={addTask}>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter your task"
        />

        <button type="submit">
          {editId === null ? "Add Task" : "Update Task"}
        </button>
      </form>

      {/* Task List */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>

            <div className="actions">
              {/* Edit Button */}
              <button
                className="edit"
                type="button"
                onClick={() => openModal("edit", todo)}
              >
                Edit
              </button>

              {/* Delete Button */}
              <button
                className="delete"
                type="button"
                onClick={() => openModal("delete", todo)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Common Confirmation Modal */}
      <ConfirmModal
        show={showModal}

        title={
          modalAction === "duplicate"
            ? modalData.title
            : modalAction === "edit"
            ? "Confirm Edit"
            : modalAction === "delete"
            ? "Confirm Delete"
            : modalData.title
        }

        message={
          modalAction === "duplicate"
            ? modalData.message
            : selectedTodo
            ? `Are you sure you want to ${modalAction} "${selectedTodo.title}"?`
            : ""
        }

        confirmText={
          modalAction === "duplicate"
            ? modalData.confirmText
            : modalAction === "edit"
            ? "Yes, Edit"
            : "Yes, Delete"
        }

        type={
          modalAction === "duplicate"
            ? modalData.type
            : modalAction
        }

        onConfirm={
          modalAction === "duplicate"
            ? closeModal
            : confirmAction
        }

        onCancel={
          modalAction === "duplicate"
            ? null
            : closeModal
        }
      />
    </div>
  );
}

export default App;
