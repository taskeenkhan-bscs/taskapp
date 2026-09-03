import { configureStore } from '@reduxjs/toolkit';
import nameReducer from '../Slice/Slice.js';

const store = configureStore({
  reducer: {
    names: nameReducer,
  },
});

export default store;