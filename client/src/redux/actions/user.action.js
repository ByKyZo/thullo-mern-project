import { Cookies } from 'react-cookie';
import axios from '../../utils/axios';
import { addToast, clearToastByTypes, errorsManager, setRememberMeCookie } from '../../utils/utils';
import { loading, endLoading } from './loader.action';
import { FiUserCheck } from 'react-icons/fi';
import { getAllBoardByUserID } from './board.action';

export const LOGIN = 'LOGIN';
export const REMEMBER_ME = 'REMEMBER_ME';
export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';

export const login = (userLogin) => {
    return (dispatch) => {
        axios
            .post('/user/login', userLogin)
            .then((res) => {
                const { user, token } = res.data;
                setRememberMeCookie(token);
                clearToastByTypes(['danger', 'warning']);
                addToast(<FiUserCheck />, `Welcome ${user.pseudo} !`, 'neutral');
                dispatch(getAllBoardByUserID(user._id));
                return dispatch({ type: LOGIN, payload: user });
            })
            .catch((err) => {
                const errors = err.response.data;
                errorsManager(errors);
            });
    };
};

export const rememberMe = () => {
    return (dispatch) => {
        dispatch(loading());
        const cookie = new Cookies();
        axios
            .get('/user/rememberme', { withCredentials: true })
            .then((res) => {
                const { user, token } = res.data;
                setRememberMeCookie(token);
                addToast(<FiUserCheck />, `Welcome ${user.pseudo} !`, 'neutral');
                dispatch(getAllBoardByUserID(user._id));
                return dispatch({ type: REMEMBER_ME, payload: user });
            })
            .catch((err) => {
                cookie.remove('token');
                dispatch({ type: REMEMBER_ME, payload: {} });
                console.log('RememberMe error : ' + err);
            })
            .finally(() => {
                dispatch(endLoading());
            });
    };
};

export const addNotification = (notifications) => {
    return (dispatch) => {
        console.log(notifications);
        return dispatch({ type: ADD_NOTIFICATION, payload: notifications });
    };
};

export const deleteNotification = (userID, notificationID, boardIDRequested) => {
    return (dispatch) => {
        const deleteNotifObject = {
            userID,
            notificationID,
            boardIDRequested,
        };
        return axios
            .post(`/user/delete-notification`, deleteNotifObject)
            .then((res) => {
                return dispatch({ type: DELETE_NOTIFICATION, payload: notificationID });
            })
            .catch((err) => {
                console.log(err);
            });
    };
};
