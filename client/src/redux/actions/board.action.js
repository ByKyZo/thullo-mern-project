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

export const createBoard = (data) => {
    return (dispatch) => {
        return axios
            .post('/board/create', data)
            .then((res) => {
                console.log(res);
                const board = res.data;
                dispatch({ type: CREATE_BOARD, payload: board });
                successToast(`Board ${board.name} create !`);
            })
            .catch((err) => {
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
    return async (dispatch) => {
        dispatch(loading());
        return axios
            .get(`/board/${boardID}`, { withCredentials: true })
            .then((res) => {
                const boards = res.data;
                dispatch({ type: GET_BOARD, payload: boards });
            })
            .catch((err) => {
                const errors = err.response.data;
                errorsManager(errors);
                console.log('board id error');
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
        const currentUser = await store.getState().userReducer;
        // console.log(description);
        // console.log(boardID);qs
        return dispatch({
            type: CHANGE_DESCRIPTION,
            payload: { description, boardID },
        });
    };
};
