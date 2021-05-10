import { CLEAR_TOAST, PUSH_TOAST, REMOVE_TOAST } from '../actions/toast.action';

const initialState = [];

export default function toastReducer(state = initialState, action) {
    switch (action.type) {
        case PUSH_TOAST:
            return [...state, action.payload];
        case REMOVE_TOAST:
            const toastID = action.payload;
            return state.filter((toast) => toast.id !== toastID);
        case CLEAR_TOAST:
            return state.filter((toast) => !action.payload.includes(toast.type));
        default:
            return state;
    }
}
