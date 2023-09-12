import {combineReducers} from '@reduxjs/toolkit';
import auth from './auth.slice';
import home from './home.slice';

export default combineReducers({
  auth,
  home,
});
