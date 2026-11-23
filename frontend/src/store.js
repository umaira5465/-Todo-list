
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useTodoStore = create(
  persist(
    (set) => ({
      // Todo states
      task: "",
      editId: null,
      todos: [],

      // Modal states
      showModal: false,
      modalAction: "",
      selectedTodo: null,

      modalData: {
        title: "",
        message: "",
        confirmText: "OK",
        type: "duplicate",
      },

      // Todo state functions
      setTask: (task) => set({ task }),

      setEditId: (editId) => set({ editId }),

      setTodos: (todos) => set({ todos }),

      // Open Edit/Delete modal
      openModal: (action, todo) =>
        set({
          modalAction: action,
          selectedTodo: todo,
          showModal: true,
        }),

      // Show duplicate or error message
      showMessage: (title, message) =>
        set({
          modalData: {
            title,
            message,
            confirmText: "OK",
            type: "duplicate",
          },
          modalAction: "duplicate",
          selectedTodo: null,
          showModal: true,
        }),

      // Close modal
      closeModal: () =>
        set({
          showModal: false,
          modalAction: "",
          selectedTodo: null,
        }),

      // Clear form
      clearForm: () =>
        set({
          task: "",
          editId: null,
        }),
    }),

    {
      name: "todo-storage",

      // Only persist task and editId
      partialize: (state) => ({
        task: state.task,
        editId: state.editId,
      }),
    }
  )
);

export default useTodoStore;
