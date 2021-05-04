import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import todosReducer from './todos.reducer';

export default combineReducers({ userReducer, todosReducer });
