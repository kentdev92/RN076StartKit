import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  highlights: [],
  books: [],
};
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    addBook: (state, action) => {
      const newBook = action.payload;
      if (state.books.filter(book => book.name === newBook.name).length === 0) {
        state.books = [...state.books, newBook];
      }
    },
    removeBook: (state, action) => {
      const {user} = action.payload;
      state.isLoading = false;
      //   state.token = token;
      state.user = user;
      state.isLoggedIn = true;
    },
    addHighlight: (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    },
    reset: () => initialState,
  },
});

export const actions = homeSlice.actions;
export default homeSlice.reducer;
