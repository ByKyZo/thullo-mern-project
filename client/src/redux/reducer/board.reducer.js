import { GET_BOARD, CREATE_BOARD, GET_ALL_BOARD_BY_USERID } from '../actions/board.action';

const initialState = {
    currentBoard: {},
    boards: [],
};

export default function boardReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_BOARD:
            return { ...state, boards: [...state.boards, action.payload] };
        case GET_ALL_BOARD_BY_USERID:
            return { ...state, boards: action.payload };
        case GET_BOARD:
            return { ...state, currentBoard: action.payload };
        default:
            return state;
    }
}
