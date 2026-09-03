import { createSlice } from '@reduxjs/toolkit';

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    items: [
      { id: 1, title: 'Learn Redux', completed: false },
      { id: 2, title: 'Build Task App', completed: false },
    ],
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = { 
        id: Date.now(),
        title: action.payload,
        completed: false,
      };
      state.items.push(newTask);
    },
    removeTask: (state, action) => {
      state.items = state.items.filter((task) => task.id !== action.payload);
    },
    updateTask: (state, action) => {
      const { id, newTitle } = action.payload;
      const task = state.items.find((task) => task.id === id);
      if (task) {
        task.title = newTitle;
      }
    },
    toggleComplete: (state, action) => {
      const task = state.items.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
  },
});

export const { addTask, removeTask, updateTask, toggleComplete } = taskSlice.actions;
export default taskSlice.reducer;