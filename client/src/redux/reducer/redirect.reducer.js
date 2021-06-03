import { CLEAR_REDIRECT, REDIRECT } from '../actions/redirect.action';

const initialState = '';

export default function redirectReducer(state = initialState, action) {
    switch (action.type) {
        case REDIRECT:
            return action.payload;
        case CLEAR_REDIRECT:
            return action.payload;
        default:
            return state;
    }
}
