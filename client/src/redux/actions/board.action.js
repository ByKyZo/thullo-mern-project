import { Redirect } from 'react-router-dom';
import axios from '../../utils/axios';
import { errorsManager, successToast } from '../../utils/utils';
import { endLoading, loading } from './loader.action';

export const CREATE_BOARD = 'CREATE_BOARD';
export const GET_BOARD = 'GET_BOARD';
export const GET_ALL_BOARD_BY_USERID = 'GET_ALL_BOARD_BY_USERID';

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
    return (dispatch) => {
        dispatch(loading());
        return axios
            .get(`/board/${boardID}`)
            .then((res) => {
                const boards = res.data;
                dispatch({ type: GET_BOARD, payload: boards });
            })
            .catch((err) => {
                const errors = err.response.data;
                errorsManager(errors);
                console.log('board id error');
                // document.location = '/allboards';
                <Redirect to="/allboards" />;
                dispatch({ type: GET_BOARD, payload: {} });
            })
            .finally(() => {
                dispatch(endLoading());
            });
    };
};
