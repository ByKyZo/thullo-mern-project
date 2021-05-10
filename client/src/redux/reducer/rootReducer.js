import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import boardReducer from './board.reducer';
import loaderReducer from './loader.reducer';
import toastReducer from './toast.reducer';

export default combineReducers({ userReducer, boardReducer, loaderReducer, toastReducer });
