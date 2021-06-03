export const REDIRECT = 'REDIRECT';
export const CLEAR_REDIRECT = 'CLEAR_REDIRECT';

export const redirect = (to) => {
    return (dispatch) => {
        return dispatch({ type: REDIRECT, payload: to });
    };
};

export const clearRedirect = () => {
    return (dispatch) => {
        return dispatch({ type: CLEAR_REDIRECT, payload: '' });
    };
};
