import {
    GET_BOARD,
    CREATE_BOARD,
    GET_ALL_BOARD_BY_USERID,
    CLEAN_CURRENTBOARD,
    JOIN_BOARD,
} from '../actions/board.action';
import { store } from '../store';

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
        case CLEAN_CURRENTBOARD:
            return { ...state, currentBoard: {} };
        case JOIN_BOARD:
            // if (action.payload.currentUser._id === action.payload.user._id)
            //     return { ...state, boards: [...state.boards, action.payload.board] };
            if (action.payload.board._id === state.currentBoard._id)
                return {
                    ...state,
                    currentBoard: {
                        members: [...state.currentBoard.members, action.payload.currentUser],
                    },
                };
            return { ...state };
        default:
            return state;
    }
}
