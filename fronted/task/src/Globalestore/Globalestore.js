import { configureStore } from "@reduxjs/toolkit";
import nameReducer from "../Slice/Slice.js";
import taskReducer from "../Taskslice/Taskslice.js";

const store = configureStore({
  reducer: {
    names: nameReducer,
    tasks: taskReducer,
  },
});

export default store;