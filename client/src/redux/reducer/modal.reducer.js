import { CLOSE_MODAL, OPEN_MODAL } from '../actions/modal.action';

const initialState = {
    modalName: '',
    props: {},
};

export default function modalReducer(state = initialState, action) {
    switch (action.type) {
        case OPEN_MODAL:
            return action.payload;
        case CLOSE_MODAL:
            return initialState;
        default:
            return state;
    }
}
