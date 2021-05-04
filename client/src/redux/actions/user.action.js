export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const REMEMBER_ME = 'REMEMBER_ME';

export const login = () => {
    return (dispatch) => {
        return dispatch({ type: LOGIN, payload: 'toto' });
    };
};

export const rememberMe = () => {
    return (dispatch) => {
        return dispatch({ type: REMEMBER_ME, payload: 'toto' });
    };
};

export const register = () => {
    return (dispatch) => {
        return dispatch({ type: REGISTER, payload: 'toto' });
    };
};
