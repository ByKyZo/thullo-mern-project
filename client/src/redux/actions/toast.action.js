import { v4 as uuid } from 'uuid';

export const PUSH_TOAST = 'PUSH_TOAST';
export const REMOVE_TOAST = 'REMOVE_TOAST';
export const CLEAR_TOAST = 'CLEAR_TOAST';

export const pushToast = (icon, info, type) => {
    return (dispatch) => {
        const toastID = uuid();
        dispatch({ type: PUSH_TOAST, payload: { id: toastID, icon, info, type } });
        setTimeout(() => {
            dispatch({ type: REMOVE_TOAST, payload: toastID });
        }, 6000);
    };
};

export const removeToast = (toastID) => {
    return (dispatch) => {
        return dispatch({ type: REMOVE_TOAST, payload: toastID });
    };
};

export const clearToast = (type) => {
    return (dispatch) => {
        return dispatch({ type: CLEAR_TOAST, payload: type });
    };
};
