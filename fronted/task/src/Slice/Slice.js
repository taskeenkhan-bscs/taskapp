
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// 1. Create Async Thunk
export const fetchNames = createAsyncThunk(
  'names/fetchNames',

  async (_, thunkAPI) => {
    try {
      // API call
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users'
      );

      // Convert response into JavaScript data
      const data = await response.json();

      // Get only names
      return data.map((user) => user.name);

    } catch (error) {
      // Send error to Redux
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


// 2. Create Slice
const nameSlice = createSlice({

  name: 'names',

  initialState: {
    items: ['Ali', 'Sara', 'Ahmed'],
    loading: false,
    error: null,
  },

  reducers: {

    addName: (state, action) => {
      state.items.push(action.payload);
    },

    removeName: (state, action) => {
      state.items = state.items.filter(
        (name) => name !== action.payload
      );
    },

    updateName: (state, action) => {
      const { oldName, newName } = action.payload;

      const index = state.items.indexOf(oldName);

      if (index !== -1) {
        state.items[index] = newName;
      }
    },

  },

  // 3. Handle fetchNames
  extraReducers: (builder) => {

    builder

      // API is running
      .addCase(fetchNames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // API successful
      .addCase(fetchNames.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      // API failed
      .addCase(fetchNames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },

});


// Normal actions
export const {
  addName,
  removeName,
  updateName,
} = nameSlice.actions;


// Reducer
export default nameSlice.reducer;
