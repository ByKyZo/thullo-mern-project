import { LOADING, END_LOADING } from '../actions/loader.action';

const initialState = false;

export default function loaderReducer(state = initialState, action) {
    switch (action.type) {
        case LOADING:
            return action.payload;
        case END_LOADING:
            return action.payload;
        default:
            return state;
    }
}
