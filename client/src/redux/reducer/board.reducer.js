import {
    GET_BOARD,
    CREATE_BOARD,
    GET_ALL_BOARD_BY_USERID,
    CLEAN_CURRENTBOARD,
    JOIN_BOARD,
    CHANGE_STATE,
    BAN_MEMBER,
    CHANGE_DESCRIPTION,
} from '../actions/board.action';

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
            const currentBoardIndex = state.boards.findIndex(
                (board) => board._id === action.payload.board._id
            );
            if (action.payload.currentUser._id === action.payload.user._id)
                return { ...state, boards: [...state.boards, action.payload.board] };
            if (action.payload.board._id === state.currentBoard._id && currentBoardIndex !== -1)
                return {
                    ...state,
                    currentBoard: {
                        ...state.currentBoard,
                        members: [...state.currentBoard.members, action.payload.user],
                    },
                    boards: state.boards.map((board) => {
                        if (board._id === action.payload.board._id)
                            board.members.push(action.payload.user);
                        return board;
                    }),
                };
            if (action.payload.board._id !== state.currentBoard._id && currentBoardIndex !== -1)
                return {
                    ...state,
                    boards: state.boards.map((board) => {
                        if (board._id === action.payload.board._id)
                            board.members.push(action.payload.user);
                        return board;
                    }),
                };
            return { ...state };

        case CHANGE_STATE:
            if (
                state.currentBoard._id === action.payload.boardID &&
                !state.currentBoard.NOT_MEMBER
            ) {
                return {
                    ...state,
                    currentBoard: { ...state.currentBoard, isPrivate: action.payload.state },
                };
            }
            if (
                state.currentBoard._id === action.payload.boardID &&
                state.currentBoard.NOT_MEMBER
            ) {
                document.location.reload();
                return {
                    ...state,
                    currentBoard: {},
                };
            }
            return { ...state };
        case BAN_MEMBER:
            if (state.currentBoard._id === action.payload.boardID) {
                if (action.payload.memberBannedID === action.payload.currentUser._id)
                    document.location.reload();
                return {
                    ...state,
                    currentBoard: {
                        ...state.currentBoard,
                        members: state.currentBoard.members.filter(
                            (member) => member._id !== action.payload.memberBannedID
                        ),
                    },
                    boards: state.boards.map((board) => {
                        if (board._id === action.payload.boardID) {
                            board.members = board.members.filter(
                                (member) => member._id !== action.payload.memberBannedID
                            );
                            return board;
                        }
                        return board;
                    }),
                };
            }
            if (
                state.boards.findIndex((board) => board._id === action.payload.boardID) !== -1 &&
                action.payload.memberBannedID === action.payload.currentUser._id
            ) {
                return {
                    ...state,
                    boards: state.boards.filter((board) => board._id !== action.payload.boardID),
                };
            }
            return { ...state };
        case CHANGE_DESCRIPTION:
            if (state.currentBoard._id === action.payload.boardID) {
                return {
                    ...state,
                    currentBoard: {
                        ...state.currentBoard,
                        description: action.payload.description,
                    },
                };
            }
            return { ...state };
        default:
            return state;
    }
}
