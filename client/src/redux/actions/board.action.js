import axios from '../../utils/axios';
import { errorsManager, successToast } from '../../utils/utils';
import { store } from '../store';
import { endLoading, loading } from './loader.action';

export const CREATE_BOARD = 'CREATE_BOARD';
export const GET_BOARD = 'GET_BOARD';
export const GET_ALL_BOARD_BY_USERID = 'GET_ALL_BOARD_BY_USERID';
export const CLEAN_CURRENTBOARD = 'CLEAN_CURRENTBOARD';
export const JOIN_BOARD = 'JOIN_BOARD';
export const CHANGE_STATE = 'CHANGE_STATE';
export const BAN_MEMBER = 'BAN_MEMBER';
export const CHANGE_DESCRIPTION = 'CHANGE_DESCRIPTION';
export const ADD_LIST = 'ADD_LIST';
export const LEAVE_BOARD = 'LEAVE_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const ADD_CARD = 'ADD_CARD';
export const DELETE_LIST = 'DELETE_LIST';
export const RENAME_LIST = 'RENAME_LIST';
export const REORDER_LIST = 'REORDER_LIST';
export const REORDER_CARD = 'REORDER_CARD';
export const ASSIGN_MEMBER = 'ASSIGN_MEMBER';
export const CHANGE_CARD_TITLE = 'CHANGE_CARD_TITLE';
export const CHANGE_CARD_DESCRIPTION = 'CHANGE_CARD_DESCRIPTION';
export const ADD_CARD_LABEL = 'ADD_CARD_LABEL';
export const DELETE_CARD_LABEL = 'DELETE_CARD_LABEL';
export const CHANGE_CARD_PICTURE = 'CHANGE_CARD_PICTURE';

export const createBoard = (data) => {
    return (dispatch) => {
        axios
            .post('/board/create', data)
            .then((res) => {
                const board = res.data;
                console.log(board);
                successToast(`Board ${board.name} create !`);
                return dispatch({ type: CREATE_BOARD, payload: board });
            })
            .catch((err) => {
                console.log(err);
                const errors = err.response.data;
                errorsManager(errors);
            });
    };
};

export const getAllBoardByUserID = (userID) => {
    return (dispatch) => {
        return axios
            .get(`/board/getallboardbyuserid/${userID}`)
            .then((res) => {
                const boards = res.data;
                dispatch({ type: GET_ALL_BOARD_BY_USERID, payload: boards });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const getBoard = (boardID) => {
    return (dispatch) => {
        dispatch(loading());
        axios
            .get(`/board/${boardID}`, { withCredentials: true })
            .then((res) => {
                const boards = res.data;
                console.log(boards);
                dispatch({ type: GET_BOARD, payload: boards });
            })
            .catch((err) => {
                const errors = err.response.data;
                errorsManager(errors);
                dispatch({ type: GET_BOARD, payload: 'BOARD_ERROR' });
            })
            .finally(() => {
                dispatch(endLoading());
            });
    };
};

export const cleanCurrentBoard = () => {
    return (dispatch) => {
        return dispatch({ type: CLEAN_CURRENTBOARD, payload: {} });
    };
};

export const joinBoard = (user, board) => {
    return async (dispatch) => {
        const currentUser = await store.getState().userReducer;
        console.log(user);
        dispatch({ type: JOIN_BOARD, payload: { currentUser, user, board } });
    };
};

export const changeState = (boardID, state) => {
    return (dispatch) => {
        return dispatch({ type: CHANGE_STATE, payload: { boardID, state } });
    };
};

export const banMember = (boardID, memberBannedID) => {
    return async (dispatch) => {
        const currentUser = await store.getState().userReducer;
        return dispatch({ type: BAN_MEMBER, payload: { boardID, memberBannedID, currentUser } });
    };
};

export const changeDescription = (description, boardID) => {
    return async (dispatch) => {
        return dispatch({
            type: CHANGE_DESCRIPTION,
            payload: { description, boardID },
        });
    };
};

export const addList = (listCreated, boardID, userID) => {
    return async (dispatch) => {
        const currentUser = store.getState().userReducer;
        return dispatch({ type: ADD_LIST, payload: { listCreated, boardID, userID, currentUser } });
    };
};

export const addCard = (cardCreated, listID, boardID) => {
    return async (dispatch) => {
        return dispatch({ type: ADD_CARD, payload: { cardCreated, listID, boardID } });
    };
};

export const deleteList = (listID, boardID) => {
    return async (dispatch) => {
        return dispatch({ type: DELETE_LIST, payload: { listID, boardID } });
    };
};

export const renameList = (rename, listID, boardID) => {
    return async (dispatch) => {
        return dispatch({ type: RENAME_LIST, payload: { rename, listID, boardID } });
    };
};

export const reorderList = (listsReorder, boardID, userID) => {
    return async (dispatch) => {
        const currentUser = store.getState().userReducer;

        return dispatch({
            type: REORDER_LIST,
            payload: { listsReorder, boardID, userID, currentUser },
        });
    };
};

export const leaveBoard = (userID, boardID) => {
    return async (dispatch) => {
        const currentUser = store.getState().userReducer;
        return dispatch({ type: LEAVE_BOARD, payload: { userID, boardID, currentUser } });
    };
};

export const deleteBoard = (boardID) => {
    return async (dispatch) => {
        return dispatch({ type: DELETE_BOARD, payload: { boardID } });
    };
};

export const assignMemberToCard = (assignedMembers, boardID, listID, cardID) => {
    return async (dispatch) => {
        return dispatch({
            type: ASSIGN_MEMBER,
            payload: { assignedMembers, boardID, listID, cardID },
        });
    };
};

export const changeCardTitle = (boardID, listID, cardID, cardTitle) => {
    return async (dispatch) => {
        return dispatch({
            type: CHANGE_CARD_TITLE,
            payload: { boardID, listID, cardID, cardTitle },
        });
    };
};

export const changeCardDescription = (boardID, listID, cardID, description) => {
    return async (dispatch) => {
        return dispatch({
            type: CHANGE_CARD_DESCRIPTION,
            payload: { boardID, listID, cardID, description },
        });
    };
};
export const addCardLabel = (boardID, listID, cardID, label) => {
    return async (dispatch) => {
        return dispatch({
            type: ADD_CARD_LABEL,
            payload: { boardID, listID, cardID, label },
        });
    };
};

export const deleteCardLabel = (boardID, listID, cardID, labelID) => {
    return async (dispatch) => {
        return dispatch({
            type: DELETE_CARD_LABEL,
            payload: { boardID, listID, cardID, labelID },
        });
    };
};

export const changeCardPicture = (boardID, listID, cardID, picture) => {
    return async (dispatch) => {
        return dispatch({
            type: CHANGE_CARD_PICTURE,
            payload: { boardID, listID, cardID, picture },
        });
    };
};
