import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, action) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      const {user} = action.payload;
      state.isLoading = false;
      //   state.token = token;
      state.user = user;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.error;
    },
    logOut: () => initialState,
  },
});

export const actions = authSlice.actions;
export default authSlice.reducer;
