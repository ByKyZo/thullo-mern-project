import { LOGIN, REMEMBER_ME } from '../actions/user.action';

const initialState = {};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return action.payload;
        case REMEMBER_ME:
            return action.payload;
        default:
            return state;
    }
}
