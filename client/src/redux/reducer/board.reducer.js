import { isEmpty } from '../../utils/utils';
import {
    GET_BOARD,
    CREATE_BOARD,
    GET_ALL_BOARD_BY_USERID,
    CLEAN_CURRENTBOARD,
    JOIN_BOARD,
    CHANGE_STATE,
    BAN_MEMBER,
    CHANGE_DESCRIPTION,
    ADD_LIST,
    LEAVE_BOARD,
    DELETE_BOARD,
    ADD_CARD,
    DELETE_LIST,
    RENAME_LIST,
    REORDER_LIST,
    ASSIGN_MEMBER,
    CHANGE_CARD_TITLE,
    CHANGE_CARD_DESCRIPTION,
    ADD_CARD_LABEL,
    DELETE_CARD_LABEL,
    CHANGE_CARD_PICTURE,
} from '../actions/board.action';

const initialState = {
    currentBoard: {},
    boards: [],
};

export default function boardReducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_BOARD:
            const boards = state.boards ? [...state.boards, action.payload] : [action.payload];
            // const boards = [action.payload];
            // return { ...state };
            // return { ...state, boards: [...state.boards, action.payload] };
            return { ...state, boards: boards };
        case GET_ALL_BOARD_BY_USERID:
            return { ...state, boards: action.payload };
        case GET_BOARD:
            // return { ...state };
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
        case ADD_LIST:
            if (state.currentBoard._id !== action.payload.boardID || isEmpty(state.currentBoard))
                return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: [...state.currentBoard.lists, action.payload.listCreated],
                },
            };
        case ADD_CARD:
            if (state.currentBoard._id !== action.payload.boardID || isEmpty(state.currentBoard))
                return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (
                            state.currentBoard._id === action.payload.boardID &&
                            list._id === action.payload.listID
                        )
                            list.cards.push(action.payload.cardCreated);
                        return list;
                    }),
                },
            };
        case RENAME_LIST:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) list.name = action.payload.rename;
                        return list;
                    }),
                },
            };
        case REORDER_LIST:
            if (
                state.currentBoard._id !== action.payload.boardID ||
                action.payload.currentUser._id === action.payload.userID
            )
                return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: action.payload.listsReorder,
                },
            };
        case DELETE_LIST:
            if (state.currentBoard._id !== action.payload.boardID || isEmpty(state.currentBoard))
                return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.filter(
                        (list) => list._id !== action.payload.listID
                    ),
                },
            };
        case ASSIGN_MEMBER:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) {
                            list.cards.forEach((card) => {
                                if (card._id === action.payload.cardID) {
                                    card.members = [...action.payload.assignedMembers];
                                }
                            });
                        }

                        return list;
                    }),
                },
            };
        case CHANGE_CARD_TITLE:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) {
                            list.cards.forEach((card) => {
                                if (card._id === action.payload.cardID) {
                                    console.log('CHANGE CARD TOTITLE');
                                    card.title = action.payload.cardTitle;
                                }
                            });
                        }
                        return list;
                    }),
                },
            };
        case CHANGE_CARD_DESCRIPTION:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) {
                            list.cards.forEach((card) => {
                                if (card._id === action.payload.cardID) {
                                    card.description = action.payload.description;
                                }
                            });
                        }
                        return list;
                    }),
                },
            };
        case ADD_CARD_LABEL:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) {
                            list.cards.forEach((card) => {
                                if (card._id === action.payload.cardID) {
                                    card.labels.push(action.payload.label);
                                }
                            });
                        }
                        return list;
                    }),
                },
            };
        case DELETE_CARD_LABEL:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) {
                            list.cards.forEach((card) => {
                                if (card._id === action.payload.cardID) {
                                    card.labels = card.labels.filter(
                                        (label) => label._id !== action.payload.labelID
                                    );
                                }
                            });
                        }
                        return list;
                    }),
                },
            };
        case CHANGE_CARD_PICTURE:
            if (state.currentBoard._id !== action.payload.boardID) return { ...state };

            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    lists: state.currentBoard.lists.map((list) => {
                        if (list._id === action.payload.listID) {
                            list.cards.forEach((card) => {
                                if (card._id === action.payload.cardID) {
                                    card.picture = action.payload.picture;
                                }
                            });
                        }
                        return list;
                    }),
                },
            };
        case LEAVE_BOARD:
            return {
                ...state,
                currentBoard: {
                    ...state.currentBoard,
                    members: state.currentBoard.members.filter((member) => {
                        if (
                            member._id === action.payload.userID &&
                            state.currentBoard._id === action.payload.boardID
                        ) {
                            if (action.payload.currentUser._id === action.payload.userID)
                                document.location.reload();
                            return false;
                        }
                        return true;
                    }),
                },
                boards: state.boards.filter((board) => {
                    return board._id === action.payload.boardID &&
                        action.payload.currentUser._id === action.payload.userID
                        ? false
                        : true;
                }),
            };
        case DELETE_BOARD:
            return {
                ...state,
                currentBoard:
                    state.currentBoard._id === action.payload.boardID
                        ? 'BOARD_ERROR'
                        : { ...state.currentBoard },
                boards: state.boards.filter((board) => board._id !== action.payload.boardID),
            };
        default:
            return { ...state };
    }
}
